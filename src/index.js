import zrender from 'zrender'
import roam from './util/roam'
import { layout } from './layout/index'

class HXTopology {
  constructor(dom, data, option) {
    var defaultOption = {
      layout: 'static', // static  function  '已经写好的'
      tooltip: {
        style: {
          position: 'absolute',
          maxWidth: '200px',
          padding: '8px 8px',
          background: 'rgba(51,51,51,.8)',
          color: '#fff',
          borderRadius: '6px',
          boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
          display: 'none',
        },
        formatter: function (d) {
          return `名称：${d.label}`
        },
        offset: [10, 10],
        // tooltip是否在容器内部
        inside: true,
      },
      nodes: {
        style: {
          fill: '#54A0FF',
          textFill: '#fff',
          // 文字是否跟随缩放
          transformText: true,
          fontSize: 14,
        },
        shape: {
          // width: 200,
          // height: 40,
        },
      },
      edges: {
        style: {
          stroke: '#54A0FF',
          // lineDash: [5, 3],
        },
        arrow: {
          distance: function (angle) {
            return 0
          },
          style: {
            fill: '#54A0FF',
          },
          size: 16,
          angle: Math.PI / 12,
        },
      },
      custom: null,
      scalePadding: 20
    }
    this.eventCallback = {
      nodeClick: null,
      doubleClick: null,
      blur: null,
    }
    this.nodes = data.nodes
    this.edges = data.edges
    this.Z_line = 100000
    this.Z_arrow = 200000
    this.Z_shape = 300000
    this.atomLineWidth = 1
    this.dom = dom
    this.doubleClick = false
    this.dragLog = []
    // 1.合并配置项
    this.option = zrender.util.merge(option, defaultOption)
    // 删除多余的边（起点或者终点不在nodes范围内）
    this.deleteSurplus()
    // 2.zrender初始化
    this.initZr()
    // 3.初始化tooltip
    this.initTooltip()
    // 4.计算位置
    this.calculate()
    // 5.绘图
    this.draw()
    this.bindDrag()
    // 6.可被拖动和缩放
    this.zr.domName = dom
    this.roam = new roam(this.zr, this.group)
    this.fitSize();
  }

  deleteSurplus() {
    var deleteIndex = []
    this.edges.forEach((edge, i) => {
      if (!this.nodes[edge.from] || !this.nodes[edge.to] || edge.from == edge.to) {
        deleteIndex.push(i)
      }
    })
    for (var i = deleteIndex.length - 1; i >= 0; i--) {
      this.edges.splice(deleteIndex[i], 1)
    }
  }

  // zrender初始化
  initZr() {
    this.zr = zrender.init(document.getElementById(this.dom))
    this.group = new zrender.Group()
    this.zr.add(this.group)
    this.container = {
      width: this.zr.getWidth(),
      height: this.zr.getHeight(),
    }
    this.zr.on('click', (e) => {
      if (!e.target && typeof this.eventCallback['blur'] == 'function') {
        this.eventCallback['blur']()
      }
    })
  }

  // 初始化tooltip
  initTooltip() {
    var domEle = document.getElementById(this.dom)
    if (window.getComputedStyle(domEle).position == 'static') {
      domEle.style.position = 'relative'
    }
    this.tooltip = document.createElement('div')
    this.tooltip.id = 'tooltip_' + this.zr.getId()
    let tooltipStyle = this.option.tooltip.style
    for (let key in tooltipStyle) {
      this.tooltip.style[key] = tooltipStyle[key]
    }
    document.getElementById(this.dom).appendChild(this.tooltip)
  }

  // 定位计算的入口，具体执行的定位类型在此分类
  calculate() {
    if (typeof this.option.layout == 'function') {
      this.nodes = this.option.layout(this.nodes, this.edges, this.container, this.option)
    } else if (layout[this.option.layout]) {
      // 参数：所有节点，所有边，容器宽高
      this.nodes = layout[this.option.layout](this.nodes, this.edges, this.container, this.option)
    } else {
      console.error('未找到匹配的布局算法')
    }
  }

  // 绘图
  draw() {
    this.drawShape()
    this.drawLine()
    this.addCustomLayer()
  }

  drawShape() {
    for (let key in this.nodes) {
      let nodeGroup = new zrender.Group({})
      nodeGroup.draggable = true
      nodeGroup.name = 'nodeGroup'
      var d = this.nodes[key]
      nodeGroup.value = d
      nodeGroup.value.id = key
      var style = zrender.util.merge(d.style || {}, this.option.nodes.style)
      var shape = zrender.util.merge(d.shape || {}, this.option.nodes.shape)
      style.text = d.label
      shape.x = d.x
      shape.y = d.y
      shape.cx = d.cx
      shape.cy = d.cy
      d.shape = new zrender[d.type || 'Rect']({
        shape: shape,
        style: style,
        z: this.Z_shape++,
      })
      nodeGroup.add(d.shape)
      if (d.image) {
        this.drawImage(nodeGroup, d)
      }
      if (d.custom && d.custom.length > 0) {
        d.customShape = []
        d.custom.forEach((cus) => {
          var defaultShape = {
            x: (d.cx || d.x || 0) + (cus.offset ? cus.offset[0] : 0),
            y: (d.cy || d.y || 0) + (cus.offset ? cus.offset[1] : 0),
            cx: (d.cx || d.x || 0) + (cus.offset ? cus.offset[0] : 0),
            cy: (d.cy || d.y || 0) + (cus.offset ? cus.offset[1] : 0),
          }
          var ele = new zrender[cus.type || 'Rect']({
            shape: zrender.util.merge(cus.shape, defaultShape),
            style: cus.style || {},
            z: 399999,
          })
          d.customShape.push(ele)
          nodeGroup.add(ele)
        })
      }
      d.nodeGroup = nodeGroup

      // 控制tooltip
      nodeGroup.on('mousemove', (e) => {
        this.tooltip.innerHTML = d.tooltip || this.option.tooltip.formatter(this.nodes[key])
        this.tooltip.style.display = 'block'
        // tooltip不出范围
        var top = e.offsetY + this.option.tooltip.offset[0]
        var left = e.offsetX + this.option.tooltip.offset[1]
        if (this.option.tooltip.inside) {
          var h = this.tooltip.offsetHeight
          var w = this.tooltip.offsetWidth
          if (left + w > this.container.width) {
            left = this.container.width - w
          }
          if (top + h > this.container.height) {
            top = this.container.height - h
          }
          left < 0 ? (left = 0) : 1
          top < 0 ? (top = 0) : 1
        }

        this.tooltip.style.top = top + 'px'
        this.tooltip.style.left = left + 'px'
      })
      nodeGroup.on('mouseout', () => {
        this.tooltip.style.display = 'none'
      })

      nodeGroup.on('click', (e) => {
        if (this.doubleClick) {
          this.doubleClick = false
          if (typeof this.eventCallback.doubleClick == 'function') {
            this.eventCallback.doubleClick(key, this.nodes[key])
          }
        } else {
          this.doubleClick = true
        }
        setTimeout(
          () => {
            if (this.doubleClick) {
              if (typeof this.eventCallback.nodeClick == 'function') {
                this.eventCallback.nodeClick(key, this.nodes[key])
              }
              this.doubleClick = false
            }
          },
          typeof this.eventCallback.doubleClick == 'function' ? 300 : 0
        )
      })
      this.group.add(nodeGroup)
    }
  }

  drawImage(nodeGroup, d) {
    d.img = new zrender.Image({
      style: {
        image: d.image.url,
        x: (d.cx || d.x || 0) + d.image.offset[0],
        y: (d.cy || d.y || 0) + d.image.offset[1],
        height: d.image.height,
        width: d.image.width,
      },
      z: 399999,
    })
    nodeGroup.add(d.img)
  }

  drawLine() {
    this.edges.forEach((d) => {
      let lineGroup = new zrender.Group({})
      lineGroup.name = 'lineGroup'
      lineGroup.value = d
      var p1 = this.nodes[d.from]
      var p2 = this.nodes[d.to]

      if (d.count) {
        d.style = zrender.util.merge(d.style || {}, { lineWidth: this.atomLineWidth * d.count })
      }

      let linearGradient = new zrender.LinearGradient(
        p1.x,
        p1.y,
        p2.x,
        p2.y,
        [
          { offset: 0, color: '#e74c3c' },
          { offset: 1, color: '#2ecc71' },
        ],
        true
      )

      d.style = zrender.util.merge(d.style || {}, { stroke: linearGradient })

      var style = zrender.util.merge(d.style || {}, this.option.edges.style)

      var shape = this.getTwoNodeCenterLine(p1, p2)
      // 提前计算，以得到shape的angle属性
      var nodeTo = this.nodes[d.to]
      var points = this.getPolygonPoints(shape, nodeTo.distance || this.option.edges.arrow.distance)
      style.textRotation = shape.angle + Math.PI / 2
      d.line = new zrender.Line({
        shape: shape,
        style: style,
        z: this.Z_line++,
      })
      lineGroup.add(d.line)
      var style = zrender.util.merge(d.arrowStyle || {}, this.option.edges.arrow.style)
      d.arrow = new zrender.Polygon({
        shape: {
          points: points,
        },
        style: style,
        z: this.Z_arrow++,
      })
      lineGroup.add(d.arrow)
      this.group.add(lineGroup)
    })
  }

  addCustomLayer() {
    if (this.option.custom && this.option.custom.length > 0) {
      this.customGroup = new zrender.Group({})
      this.customGroup.name = 'customGroup'
      this.customGroup.value = this.option.custom
      this.customShape = []
      this.option.custom.forEach((d) => {
        var option = d.option
        if (typeof d.option == 'function') {
          option = d.option(this.nodes, this.edges, this.container)
        }
        var shape = new zrender[d.type](option)
        this.customShape.push(shape)
        this.group.add(shape)
      })
    }
  }

  bindDrag() {
    // 拖动过程中更新绘图
    let groupDragging = false,
      _x,
      _y

    this.zr.on('dragstart', (e) => {
      if (e.target.name === 'nodeGroup') {
        self._groupDragging = true
        _x = e.offsetX
        _y = e.offsetY
      }
    })

    this.zr.on('dragend', (e) => {
      this._groupDragging = false
    })

    this.zr.on('drag', (e) => {
      this.tooltip.style.display = 'none'
      if (!self._groupDragging) {
        return
      }

      var id = e.target.value.id
      if (this.dragLog.indexOf(id) == -1) {
        this.dragLog.push(id)
      }
      this.updateLine(id, this.nodes[id], e.target.position)
    })
  }

  dragReset() {
    this.dragLog.forEach((d) => {
      this.nodes[d].nodeGroup.position = [0, 0]
      this.updateLine(d, this.nodes[d], [0, 0])
    })
  }

  updateLine(id, node, offset) {
    this.edges.forEach((d) => {
      var type = -1 // -1 无关边  0  起点   1  终点
      var obj = {}
      if (d.from == id) {
        type = 0
        obj = {
          x1: this.getNodeCenter(node).x + offset[0],
          y1: this.getNodeCenter(node).y + offset[1],
        }
      } else if (d.to == id) {
        type = 1
        obj = {
          x2: this.getNodeCenter(node).x + offset[0],
          y2: this.getNodeCenter(node).y + offset[1],
        }
      }
      if (type !== -1) {
        console.log(d)
        d.line.attr('shape', obj)
        // 更新箭头
        var nodeTo = this.nodes[d.to]
        var points = this.getPolygonPoints(d.line.shape, nodeTo.distance || this.option.edges.arrow.distance)
        // 如果是渐变色，要更新渐变色的气止坐标
        if (d.line.style.stroke.colorStops) {
          d.line.style.stroke.x = d.line.shape.x1
          d.line.style.stroke.y = d.line.shape.y1
          d.line.style.stroke.x2 = d.line.shape.x2
          d.line.style.stroke.y2 = d.line.shape.y2
        }
        d.line.attr('style', {
          textRotation: d.line.shape.angle + Math.PI / 2,
        })
        d.arrow.attr('shape', { points: points })
      }
    })
  }

  getPolygonPoints(shape, distance) {
    var points = []
    var baseX1 = shape.x1
    var baseY1 = shape.y1
    var baseX2 = shape.x2
    var baseY2 = shape.y2
    shape.angle = Math.atan2(baseX1 - baseX2, baseY1 - baseY2)
    var distance = Math.abs(distance(this.formatterAngle(shape.angle)))
    // 很接近时不显示箭头
    if (Math.pow(baseX1 - baseX2, 2) + Math.pow(baseY1 - baseY2, 2) < Math.pow(distance, 2)) {
      distance = 0
    }
    var arrowSize = this.option.edges.arrow.size
    var arrowAngle = this.option.edges.arrow.angle
    var head = [baseX2 + distance * Math.sin(shape.angle), baseY2 + distance * Math.cos(shape.angle)]
    points.push(head)
    points.push([
      head[0] + arrowSize * Math.sin(shape.angle - arrowAngle),
      head[1] + arrowSize * Math.cos(shape.angle - arrowAngle),
    ])
    points.push([
      head[0] + arrowSize * Math.sin(shape.angle + arrowAngle),
      head[1] + arrowSize * Math.cos(shape.angle + arrowAngle),
    ])
    return points
  }

  formatterAngle(angle) {
    while (angle < -2 * Math.PI) {
      angle += 2 * Math.PI
    }
    while (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI
    }
    return angle
  }

  // 获取节点中心点（区分cxcy和xy的）
  getNodeCenter(node) {
    // 以左上角定位，需要加一半宽高得到中心点
    var needAdd = false
    if (node.type == undefined || node.type == 'Rect') {
      needAdd = true
    }
    var x = (node.shape.shape.cx || node.shape.shape.x) + (needAdd ? node.shape.shape.width / 2 : 0)
    var y = (node.shape.shape.cy || node.shape.shape.y) + (needAdd ? node.shape.shape.height / 2 : 0)
    return { x, y }
  }

  getTwoNodeCenterLine(node1, node2) {
    var p1 = this.getNodeCenter(node1)
    var p2 = this.getNodeCenter(node2)
    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
    }
  }

  // 高亮一个节点
  hoverNode(id, shapeStyle = {}, imageStyle = {}) {
    this.zr.addHover(this.nodes[id].shape, shapeStyle)
    this.nodes[id].img ? this.zr.addHover(this.nodes[id].img, imageStyle) : 1
    this.nodes[id].customShape &&
      this.nodes[id].customShape.forEach((d) => {
        this.zr.addHover(d, {})
      })
  }

  // 高亮一条连线  selector里有两个属性 from， to    both 是否都满足，默认fale
  hoverEdges(selector, lineStyle = {}, arrowStyle = {}) {
    var from = selector.from || null
    var to = selector.to || null
    var both = selector.both || null
    var nodes = {}
    this.edges.forEach((d) => {
      var check = {}
      if (!from) {
        check.from = true
      } else {
        check.from = from == d.from
      }
      if (!to) {
        check.to = true
      } else {
        check.to = to == d.to
      }
      var needHighlight = false
      if (both && check.from && check.to) {
        needHighlight = true
      } else if (!both && (check.from || check.to)) {
        needHighlight = true
      }
      if (needHighlight) {
        nodes[d.from] = true
        nodes[d.to] = true

        // this.zr.addHover(d.line, lineStyle)
        d.line.isHover = true
        d.line.baseStyle = zrender.util.clone(d.line.style)
        delete d.line.baseStyle.textRotation
        d.line.attr('style', lineStyle)
        this.zr.addHover(d.arrow, arrowStyle)
      } else if (d.line.isHover) {
        delete d.line.isHover
        d.line.attr('style', d.line.baseStyle)
      }
    })
    return nodes
  }

  // 清除高亮层
  clearHover() {
    this.zr.clearHover()
    this.edges.forEach((d) => {
      if (d.line.isHover) {
        delete d.line.isHover
        d.line.attr('style', d.line.baseStyle)
      }
    })
  }

  // 自适应缩放
  fitSize(){
    var W = this.container.width;
    var H = this.container.height;
    var bBox = this.group.getBoundingRect();
    var pd =  + this.option.scalePadding * 2
    var scale = 1;
    if((bBox.width + pd) / (bBox.height + pd) < W / H){
      // 高撑满
      scale = H/(bBox.height + pd)
    }else{
      // 宽撑满
      scale = W/(bBox.width + pd)
    }
    this.scaleTo((bBox.x + bBox.width/2),(bBox.y + bBox.height/2), scale)
  }

  scaleTo(x,y,scale){
    this.group.scale = [scale, scale]
    this.group.origin = [x,y]
    // 将缩放中心平移到容器中心
    this.group.position = [this.container.width/2 - x, this.container.height/2-y]
    this.group.dirty(true)
  }

  addEventListener(name, cb) {
    this.eventCallback[name] = cb
  }

  clear() {
    this.zr.clear()
  }
}

export default HXTopology
