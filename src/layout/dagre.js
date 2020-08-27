// 层级布局-dagre
let dagreLayout = function(that, zrender) {
    if(!window.dagre){
        console.error(`使用的布局需要dagre支持，请在html中引入'//s.thsi.cn/js/datav/lib/dagre.min.js'`)
        return;
    }
    // 配置项文档详见   https://github.com/dagrejs/dagre/wiki
    let defaultOption = {
        graph:{
            rankdir: 'TB'
        },
        node:{
            width: 100,
            height: 100
        },
    }
    let option = zrender.util.merge(that.option.layout.option || {}, defaultOption, true)
    let g = new dagre.graphlib.Graph()
    g.setGraph(option.graph)
    g.setDefaultEdgeLabel(function () {return {}})
    for(let key in that.data.nodes){
        g.setNode(key, {...option.node, id: key})
    }
    that.data.edges.forEach((v) => g.setEdge(v.from, v.to))
    dagre.layout(g)
    g.nodes().forEach((nodeId) => {
        var nodeData = g.node(nodeId)
        that.data.nodes[nodeId].x = nodeData.x
        that.data.nodes[nodeId].y = nodeData.y
    })
}

export default dagreLayout;