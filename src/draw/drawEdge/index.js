import drawLine from './drawLine';
import drawArrow from './drawArrow';
import common from '../../util/common';
// 绘制连线
let drawEdge = function (that, zrender) {
    let edges = that.data.edges;
    if(edges.length == 0) return;
    let nodes = that.data.nodes;
    let edgesGroup = new zrender.Group();
    edgesGroup.name = 'edgesGroup'
    for(let i = 0; i < edges.length; i++){
        let edge = edges[i];
        let sNode = nodes[edge.from];
        let eNode = nodes[edge.to];
        // 记录结束节点的一些属性，用于计算
        edge.sNode = {
          // 起始节点的距离计算函数
          distance: eNode.distance,
          width: eNode.width,
          height: eNode.height,
        }
        edge.eNode = {
          // 结束节点的距离计算函数
          distance: eNode.distance,
          width: eNode.width,
          height: eNode.height,
        }
        edge.eSize = [eNode.width, eNode.height]
        // 起点节点的中心
        edge.start = [sNode.x + sNode.width / 2,sNode.y + sNode.height / 2];
        // 终点节点的中心
        edge.end = [eNode.x + eNode.width / 2,eNode.y + eNode.height / 2];
        // 计算箭头起终点和旋转角度等用得上的值
        updateValue(edge, that)
        let edgeGroup = new zrender.Group();
        edgeGroup.name = `edgeGroup_${edge.from}_${edge.to}`
        edgeGroup.value = edge;
        // 绘制连线
        let line = drawLine(edgeGroup.value, that, zrender);
        // 绘制箭头
        let arrow = drawArrow(edgeGroup.value, that, zrender, edge.showEdge);
        edgeGroup.add(line)
        edgeGroup.add(arrow)
        edgeGroup.on('click', (e)=>{
          that.action.do('edge', 'click', edgeGroup, e)
        })
        edgeGroup.on('mousemove', (e)=>{
          that.action.do('edge', 'mouseMove', edgeGroup, e)
        })
        edgesGroup.add(edgeGroup)
    }
    that.zr.group.add(edgesGroup)
    
    // 更新连线
    that.updateEdge = function(id, position){
      that.zr.group.childOfName('edgesGroup').eachChild((edgeGroup,i)=>{
        // 改变哪个点
        let change = null;
        if(edgeGroup.value.from == id){
          change = 1
          edgeGroup.value.start = position
        }else if(edgeGroup.value.to == id){
          change = 2
          edgeGroup.value.end = position
        }
        if(change){
          updateValue(edgeGroup.value, that);
          edgeGroup.childOfName('line').updateShape(edgeGroup.value);
          edgeGroup.childOfName('arrow').updateShape(edgeGroup.value, edgeGroup.value.showEdge);
        }
      })
    }
}

// 计算绘图相关的值
function updateValue(edge, that){
  // 起终点倾斜角度
  edge.angle = Math.atan2(edge.start[0] - edge.end[0], edge.start[1] - edge.end[1])
  // 连线长度
  edge.length = Math.sqrt(Math.pow(edge.start[0] - edge.end[0],2) + Math.pow(edge.start[1] - edge.end[1],2))
  // 终点距离（箭头起点到结束节点的中心的距离）
  edge.distance = common.fnToNum(edge.eNode.distance || that.option.nodes.distance, [edge.angle, edge.eNode.width, edge.eNode.height])
  // 起点距离（画线起点用到）
  edge.startDistance = common.fnToNum(edge.eNode.distance || that.option.nodes.distance, [edge.angle + Math.PI, edge.eNode.width, edge.eNode.height])
  // 终点节点的边缘
  let edgeOpt = that.option.edges
  let arrowDistance =  (edge.arrowSize === undefined ? edgeOpt.arrowSize : edge.arrowSize)
  // 实际绘图连线起始点
  edge.lineStart = [edge.start[0] + (edge.startDistance) * Math.sin(edge.angle + Math.PI),
                edge.start[1] + (edge.startDistance) * Math.cos(edge.angle + Math.PI)]
  // 实际绘图连线结束点
  edge.lineEnd = [edge.end[0] + (edge.distance + arrowDistance) * Math.sin(edge.angle),
                edge.end[1] + (edge.distance + arrowDistance) * Math.cos(edge.angle)]
  // 实际绘图箭头起始点
  edge.arrowStart = [edge.end[0] + (edge.distance) * Math.sin(edge.angle),
                edge.end[1] + (edge.distance) * Math.cos(edge.angle)]
  // 是否距离过近需要隐藏边
  edge.showEdge = (edge.length >= edge.distance + edge.startDistance + that.option.edges.arrowSize)
  if(!edge.showEdge){
    edge.lineEnd = edge.lineStart
  }
}

export default drawEdge;