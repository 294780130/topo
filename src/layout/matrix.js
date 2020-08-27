// 矩阵布局
let matrix = function (that, zrender) {
  let defaultLayoutOption = {
    numPerCol: 10, //每列最多节点数
    gap: 5, //节点间距离
    groupInterval: 20, //组间间距
    levelInterval: 20, //层间间距
  }

  defaultLayoutOption = zrender.util.merge(that.option.layout.option || {}, defaultLayoutOption)
  let nodes = that.data.nodes
  let option = that.option
  let result = []

  for (let key in nodes) {
    let node = nodes[key]

    let row = node.position[0] - 1
    let col = node.position[1] - 1
    if (!result[row]) {
      result[row] = []
    }
    if (!result[row][col]) {
      result[row][col] = []
    }
    result[row][col].push(node)
  }

  let x = 0
  let y = 0

  let nodeWidth = option.nodes.shape.width
  let nodeHeight = option.nodes.shape.height
  let maxcount = 0
  let maxWidth = []
  let maxHeight = []
  let count
  //坐标初始化
  result.forEach((row) => {
    row.forEach((col) => {
      count = 0

      col.forEach((node) => {
        if (count >= defaultLayoutOption.numPerCol) {
          count = 0
          y = 0
          x += defaultLayoutOption.gap + nodeWidth
        }
        node.x = x
        node.y = y
        y += defaultLayoutOption.gap + nodeHeight
        count++
        maxcount = Math.max(maxcount, count)
      })

      y = 0

      x += defaultLayoutOption.groupInterval + nodeWidth
    })
    maxWidth.push(x + nodeWidth)
    maxHeight.push(maxcount * (nodeHeight + defaultLayoutOption.gap) - defaultLayoutOption.gap)
    x = 0
  })
  //横纵偏移
  let mid = Math.max(...maxWidth) / 2
  result.forEach((row, index) => {
    row.forEach((col) => {
      col.forEach((node) => {
        node.x += mid - maxWidth[index] / 2
        node.y += (maxHeight[index - 1] || 0) + defaultLayoutOption.levelInterval * index
      })
    })
  })
}

export default matrix
