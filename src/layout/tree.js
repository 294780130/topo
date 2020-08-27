// 树布局
let tree = function(that, zrender) {
    var hierarchyData = d3.hierarchy(that.data)
    		.sum(function(d){
    			return d.value;
        });
    //创建一个树状图
    let tree = d3.tree()
        .size([that.container.width,that.container.height])
        .separation(function(a,b){
            return (a.parent==b.parent?1:2)/a.depth;
        })

    //初始化树状图，也就是传入数据,并得到绘制树基本数据
    let treeData = tree(hierarchyData);
    //得到节点
    let nodes = treeData.descendants();
    let links = treeData.links();

    let realNodes = {}
    nodes.forEach(d=>{
        realNodes[d.data.id] = {
            x: d.x,
            y: d.y,
            style: {
              text: d.data.name || '',
              ...d.data.style
            },
        }
    })
    let realEdges = []
    links.forEach(d=>{
        realEdges.push({from: d.source.data.id, to: d.target.data.id})
    })
    that.data.nodes = realNodes
    that.data.edges = realEdges

}

export default tree;