// 绑定zr上的所有事件
let bindZrEvent = function (that) {
    // 拖拽事件
    bindDrag(that)
    // 点击事件
    bindClick(that)
}

// 拖拽事件
function bindDrag(that){
  that.zr.group.on('drag', (e) => {
    // 当拖拽的东西是节点时，需要更新边
    if (e.target.name.includes('nodeGroup')) {
      let target = e.target
      let shape = target.children()[0].shape
      let position = [shape.x + shape.width / 2 + target.position[0], shape.y + shape.height / 2 + target.position[1]]
      that.data.edges.length !==  0 && that.updateEdge(target.nodeId, position)
      that.action.do('node', 'drag', e)
    }
  })
}
// 点击事件
function bindClick(that){
  that.zr.on('click', (e) => {
    !e.target && that.action.do('canvas', 'clickBlank', e)
  })
}

export default bindZrEvent;