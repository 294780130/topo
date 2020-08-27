// 绘制节点
let drawNode = function (that, zrender) {
  let nodesGroup = new zrender.Group()
  nodesGroup.name = 'nodesGroup'
  for (let id in that.data.nodes) {
    that.data.nodes[id].id = id
    // 循环遍历创建节点
    let nodeGroup = createNode(that.data.nodes[id], that.option.nodes, zrender, that)
    nodesGroup.add(nodeGroup)
  }
  that.zr.group.add(nodesGroup)
}

// 创建一个节点
let createNode = function (nodeData, defaultOption, zrender, that) {
  let nodeGroup = new zrender.Group()
  nodeGroup.nodeId = nodeData.id
  nodeGroup.name = `nodeGroup_${nodeData.id}`
  nodeGroup.value = {
    x: nodeData.x,
    y: nodeData.y
  }
  nodeGroup.draggable = true
  let style = zrender.util.merge(nodeData.style || {}, defaultOption.style)
  let shape = zrender.util.merge(nodeData.shape || {}, defaultOption.shape)
  nodeData.width = shape.width
  nodeData.height = shape.height
  shape.x = nodeData.x
  shape.y = nodeData.y
  let node = new zrender[nodeData.type || defaultOption.type]({
    shape: shape,
    style: style,
  })
  node.name = 'node'
  nodeGroup.add(node)
  // 绑定鼠标移动事件
  nodeGroup.on('mousemove', (e) => {
    // 更新tooltip
    let content = style.formatter ? style.formatter(style.text) : style.text
    that.tooltip.update(style.text, [e.offsetX, e.offsetY])
    that.action.do('node', 'mouseMove', e)
  })
  // 绑定鼠标移出事件
  nodeGroup.on('mouseout', (e) => {
    // 隐藏tooltip
    that.tooltip.hide()
    that.action.do('node', 'mouseOut', e)
  })
  // 绑定鼠标按下事件
  nodeGroup.on('mousedown', (e) => {
    that.action.do('node', 'mouseDown', nodeData.id, nodeGroup, e)
  })
  // 绑定鼠标点击事件
  nodeGroup.on('click', (e) => {
    if (that.doubleClick) {
      that.doubleClick = false
      that.action.do('node', 'doubleClick', nodeData.id, nodeGroup, e)
    } else {
      that.doubleClick = true
    }
    setTimeout(() => {
      if (that.doubleClick) {
        that.action.do('node', 'click', nodeData.id, nodeGroup, e)
        that.doubleClick = false
      }
    },that.action.node.doubleClick ? that.option.nodes.doubleClickTimer : 0)
  })
  return nodeGroup
}
export default drawNode
