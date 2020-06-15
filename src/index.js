import setDagre from './setDagre'
import GetCrossPoint from './getCrossPoint'
import defaultOption from './defaultOption'
import FlowApi from './Flow'
import roamable from './roamable'
import util from './util/util'
 
class Flow {
  constructor(dom, data, option) {
    this.option = zrender.util.merge(option, defaultOption)

    // 计算每个节点和关系的坐标值
    // TODO:这里不设置this.option么？
    // TODO:这里写死了dagre布局，后面需要修改，以支持更多的布局方式
    this.position = setDagre(data, option)        

    this.nodeList = {}
    this.edgeList = {}
    this.zr = zrender.init(document.getElementById(dom))
    this.dagreGroup = new zrender.Group()
    this.zr.add(this.dagreGroup)
    this.tooltip = this.createTooltip()
  }

  createTooltip() {
    let tooltip = document.createElement('div')
    tooltip.id = 'tooltip_' + this.zr.getId()
    let style = tooltip.style
    style.position = 'absolute'
    style.maxWidth = '200px'
    style.padding = '8px 8px'
    style.background = 'rgba(51,51,51,.8)'
    style.color = '#fff'
    style.borderRadius = '6px'
    style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
    style.display = 'none'
    document.body.appendChild(tooltip)
    return tooltip
  }

  draw() {
    this.drawLine(this.option)
    this.drawShape(this.option)
    let flowApi = new FlowApi(this.zr, this.dagreGroup)
    window.flowApi = flowApi
    flowApi.fit()
    //flowApi.center()
    roamable(this.zr, this.dagreGroup)
  }

  redraw(data, option) {
    this.dagreGroup.removeAll();
    this.option = zrender.util.merge(option, defaultOption)
    this.position = setDagre(data, option)
    this.draw()
  }

  drawShape(option) {
    let nodePoint = {}
    //获取中心点

    for (const [key, value] of Object.entries(this.position.nodeInfo)) {
      let nodeGroup = new zrender.Group({})
      nodeGroup.draggable = true
      nodeGroup.name = 'nodeGroup'
      nodeGroup.value = value
      let self = this
      let g = this.position.g

      let custom = this.option.nodes.custom
      let customStyle = {}

      if (custom) {
        customStyle = custom(nodeGroup, value, { zrender, g }) || {}
      }
      let merge = zrender.util.merge
      // TODO：这里写死了Rect，需要扩展以支持更多形状
      this.nodeList[key] = new zrender.Rect(
        merge(
          {
            shape: { x: value.x, y: value.y, width: value.width, height: value.height, r: option.nodes.borderRadius },
            style: {
              text: value.label,
              textOffset: option.nodes.label.textOffset,
              transformText: true,
              fill: option.nodes.fill,
              textFill: option.nodes.label.color,
              fontSize: option.nodes.label.fontSize,
              shadowBlur: option.nodes.shadowBlur,
              shadowColor: option.nodes.shadowColor,
              shadowOffsetX: option.nodes.shadowOffsetX,
              shadowOffsetY: option.nodes.shadowOffsetY,
            },
            z: 1,
          },
          customStyle,
          true
        )
      )
      //获取每个矩形的原始每个点的坐标
      let originPoint = util.getCoordinate(this.nodeList[key].shape)
      nodePoint[key] = originPoint

      nodeGroup.add(this.nodeList[key])

      nodeGroup.on('mouseover', function (e) {
        if (!this.value.tooltip) {
          this.trigger('mouseup')
          return
        }
        self.tooltip.innerHTML = this.value.tooltip
        let style = self.tooltip.style
        style.top = e.offsetY + 'px'
        style.left = e.offsetX + 'px'
        style.display = 'block'
        style.transition = 'all .2s'
      })
      self.tooltip.onmouseenter = () => {
        self.tooltip.style.display = 'block'
      }
      nodeGroup.on('mouseout', () => (self.tooltip.style.display = 'none'))

      this.dagreGroup.add(nodeGroup)
      /*if (g.outEdges(key).length === 0) {
        this.nodeList[key].attr('style', { fill: '#f8c291' })
      }*/
    }
    let self = this

    let groupDragging = false,
      _x,
      _y
    this.zr.on('dragstart', function (e) {
      if (e.target.name === 'nodeGroup') {
        self._groupDragging = true
        _x = e.offsetX
        _y = e.offsetY
      }
    })

    this.zr.on('dragend', function (e) {
      this._groupDragging = false
    })
    // TODO:这段代码应该往下移动，让拖动相关的代码放在一起；另外建议封装为函数，不要全部写在一个函数内
    if (this.option.showRelation) {
      this.zr.on('click', function (e) {
        if (e.target) {
          if (e.target.parent.name === 'nodeGroup') {
            let id = e.target.parent.value.id

            for (let v of Object.values(self.nodeList)) {
              v.parent.eachChild(function (el) {
                el.attr('style', { opacity: 1 })
              })
            }
            for (let v of Object.values(self.edgeList)) {
              v.parent.eachChild(function (el) {
                el.attr('style', { opacity: 1 })
              })
            }

            let relatedNode = self.position.g.neighbors(id)
            let relatedEdge = self.position.g.nodeEdges(id)
            let unrelatedEdges = self.position.g.edges().filter((edge) => !relatedEdge.includes(edge))
            let unrelatedNodes = self.position.g.nodes().filter((node) => !(relatedNode.includes(node) || node === id))
            unrelatedNodes.forEach((node) => {
              self.nodeList[node].parent.eachChild(function (el) {
                el.attr('style', { opacity: 0.3 })
              })
            })
            unrelatedEdges.forEach((edge) => {
              self.edgeList[`from__${edge.v}__to__${edge.w}`].parent.eachChild(function (el) {
                el.attr('style', { opacity: 0.3 })
              })
            })
          }
        } else {
          for (let v of Object.values(self.nodeList)) {
            v.parent.eachChild(function (el) {
              el.attr('style', { opacity: 1 })
            })
          }
          for (let v of Object.values(self.edgeList)) {
            v.parent.eachChild(function (el) {
              el.attr('style', { opacity: 1 })
            })
          }
        }
      })
    }

    this.zr.on('drag', function (e) {
      self.tooltip.style.display = 'none'
      if (!self._groupDragging) {
        return
      }
      e.target.attr('z', 999)
      let oldPos = e.target.transformCoordToLocal(_x, _y)
      let newPos = e.target.transformCoordToLocal(e.offsetX, e.offsetY)
      let x = e.offsetX
      let y = e.offsetY
      //获取偏移的距离
      let dx = newPos[0] - oldPos[0]
      let dy = newPos[1] - oldPos[1]
      _x = x
      _y = y
      let key = e.target.value.id
      let g = self.position.g

      /*
       *变换坐标位置到 shape 的局部坐标空间
       *https://ecomfe.github.io/zrender-doc/public/api.html#zrendertransformabletransformcoordtolocalx-y
       */
      //通过dagre自带的api找到与该节点对应的边
      let relatedEdges = g.nodeEdges(key)
      //计算偏移后每个矩形的四个点的位置
      for (let [k, v] of Object.entries(nodePoint[key])) {
        nodePoint[key][k] = [v[0] + dx, v[1] + dy]
      }
      let arrowSize = self.option.edges.arrowSize
      relatedEdges.forEach((edge) => {
        self.updateLine(edge, nodePoint[edge.v], nodePoint[edge.w], arrowSize)
      })
    })
  }

  drawLine(option) {
    for (const [key, value] of Object.entries(this.position.edgeInfo)) {
      let lineGroup = new zrender.Group({ name: key })
      let sourcePoint = util.getCoordinate(this.position.nodeInfo[value.source])
      let targetPoint = util.getCoordinate(this.position.nodeInfo[value.target])
      //连线的两点坐标
      let linePoint = {
        p1: [this.position.g.node(value.source).x, this.position.g.node(value.source).y],
        p2: [this.position.g.node(value.target).x, this.position.g.node(value.target).y],
      }
      //获取交叉点坐标
      let targetCrossPoint = GetCrossPoint.lineRect(linePoint, targetPoint)
      let sourceCrossPoint = GetCrossPoint.lineRect(linePoint, sourcePoint)

      this.edgeList[key] = new zrender.Polyline({
        shape: { points: [sourceCrossPoint, targetCrossPoint] },
        style: {
          text: value.label,
          fontSize: option.edges.label.fontSize,
          textFill: option.edges.label.color,
          transformText: true,
          lineWidth: option.edges.lineWidth,
          stroke: option.edges.stroke,
          lineDash: option.edges.lineDash ? [10, 5] : 0,
        },
      })

      let arrowSize = this.option.edges.arrowSize
      let arrowPoint = [
        [targetCrossPoint[0], targetCrossPoint[1]],
        [targetCrossPoint[0] + 10 * arrowSize, targetCrossPoint[1] - 6.0 * arrowSize],
        [targetCrossPoint[0] + 10 * arrowSize, targetCrossPoint[1] + 6.0 * arrowSize],
      ]
      let rotation = -Math.atan2(value.points[0][1] - value.points[1][1], value.points[0][0] - value.points[1][0])
      let arrow = new zrender.Polygon({
        shape: { points: arrowPoint },
        style: { fill: option.edges.arrowColor },
        rotation: rotation,
        origin: arrowPoint[0],
        name: `${key}--arrow`,
      })
      lineGroup.add(this.edgeList[key])
      lineGroup.add(arrow)
      this.dagreGroup.add(lineGroup)
    }
  }

  updateLine(edge, sourceRect, targetRect, arrowSize) {
    let thatEdge = this.edgeList[`from__${edge.v}__to__${edge.w}`]

    let linePoint = { p1: util.getCentralPoint(sourceRect), p2: util.getCentralPoint(targetRect) }
    let sourceCrossPoint = GetCrossPoint.lineRect(linePoint, sourceRect)
    let targetCrossPoint = GetCrossPoint.lineRect(linePoint, targetRect)
    thatEdge.attr('shape', {
      points: [sourceCrossPoint, targetCrossPoint],
    })
    //进行判断，如果有交叉点则对箭头进行处理
    if (targetCrossPoint) {
      let rotation = -Math.atan2(sourceCrossPoint[1] - targetCrossPoint[1], sourceCrossPoint[0] - targetCrossPoint[0])

      let arrowPoint = [
        [targetCrossPoint[0], targetCrossPoint[1]],
        [targetCrossPoint[0] + 10 * arrowSize, targetCrossPoint[1] - 6.0 * arrowSize],
        [targetCrossPoint[0] + 10 * arrowSize, targetCrossPoint[1] + 6.0 * arrowSize],
      ]
      let arrow = this.dagreGroup
        .childOfName(`from__${edge.v}__to__${edge.w}`)
        .childOfName(`from__${edge.v}__to__${edge.w}--arrow`)

      arrow.attr('shape', { points: arrowPoint })
      arrow.attr('rotation', rotation)
      arrow.attr('origin', targetCrossPoint)
    }
  }
}

export default Flow
