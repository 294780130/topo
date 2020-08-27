// 包布局
let pack = function (that, zrender) {
  let option = {
    padding: 20,
    radius: null, //最小圆的半径
    size: [that.container.width, that.container.height],
    color: undefined,
  }

  //初始化获取x,y,r
  let pack = (data) =>
    d3.pack().size(option.size).radius(option.radius).padding(option.padding)(
      d3
        .hierarchy(data) //数据转换为树形结构
        .sum((d) => d.value) //求出所有子孙节点的value和
        .sort((a, b) => b.value - a.value) //对后代进行排序
    )
  let root = pack(that.data)

  //初始化颜色比例尺
  option.color = d3
    .scaleLinear()
    .domain([0, root.height])
    .range(['rgb(255,0,255)', 'rgb(0,255,0)'])
    .interpolate(d3.interpolateRgb)

  let data = {
    nodes: {},
    edges: [],
  }
  //上色
  root.each((d) => {
    d.style = {
      text: d.name,
      fill: option.color(d.depth),
      stroke: '1px solid #000',
    }
    data.nodes[d.data.name] = d
  })

  //改变初始样式，删除多余属性  zrender圆形基于rect实现，需要进行圆心偏移
  for (let name in data.nodes) {
    let nodeItem = data.nodes[name]
    nodeItem.name = name
    nodeItem.x -= nodeItem.r
    nodeItem.y -= nodeItem.r
    delete nodeItem.parent
    delete nodeItem.children
    delete nodeItem.data
    delete nodeItem.depth
    delete nodeItem.height
    nodeItem.shape = {
      width: nodeItem.r * 2,
      height: nodeItem.r * 2,
      r: nodeItem.r,
    }
  }

  that.data = data
}
export default pack
