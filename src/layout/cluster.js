// 簇布局
let cluster = function (that, zrender) {
  let defaultOption = {
    padding: 20,
    radius: null, //最小圆的半径
    size: [that.container.width, that.container.height],
    color: undefined,
  }

  let option = zrender.util.merge(that.option.layout.option || {}, defaultOption)

  //初始化获取x,y,r

  let pack = (data) =>
    d3.pack().size(option.size).radius(option.radius).padding(option.padding)(
      d3
        .hierarchy(data) //数据转换为树形结构
        .sum((d) => d.value) //求出所有子孙节点的value和
        .sort((a, b) => b.value - a.value) //对后代进行排序
    )
  let root = pack(that.data)

  //获取颜色比例尺
  option.color = d3.scaleOrdinal(
    root.children.map((d) => d.name),
    d3.schemeCategory10
  )

  let data = {
    nodes: {},
    edges: [],
  }
  //计算父节点个数   根据分类上色
  let ancestors = 0
  root.each((d) => {
    d.style = {
      text: d.data.name,
      fill: d.parent ? option.color(d.parent.data.name) : null,
      stroke: '1px solid #000',
    }
    if (d.children) {
      ancestors++
    }
  })

  //删除父节点
  root = root.descendants().slice(ancestors)

  //删除无关属性，改变初始样式
  root.forEach((d) => {
    d.name = d.data.name
    d.x -= d.r
    d.y -= d.r
    delete d.parent
    delete d.children
    delete d.data
    delete d.depth
    delete d.height
    d.shape = {
      width: d.r * 2,
      height: d.r * 2,
      r: d.r,
    }
    data.nodes[d.name] = d
  })
  that.data = data
}
export default cluster
