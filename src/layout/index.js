import dagre from 'dagre'

var layout = {
    'static': function(nodes, edges, containerSize, option) {
        for(let key in nodes){
            let d = nodes[key]
            d.x == undefined ? d.x = 0 : 1;
            d.y == undefined ? d.y = 0 : 1;
            d.cx == undefined ? d.cx = 0 : 1;
            d.cy == undefined ? d.cy = 0 : 1;
        }
        return nodes;
    },
    'straight': function(nodes, edges, containerSize, option) {
        var startX = containerSize.width / 2 - option.nodes.shape.width / 2;
        var startY = 100;
        for(let key in nodes){
            let d = nodes[key]
            d.x = startX;
            d.y = startY;
            startY += 150;
        }
        return nodes;
    },
    'dagre': function(nodes, edges, containerSize, option) {
        let g = new dagre.graphlib.Graph()
        g.setGraph(option.dagre || {})
        g.setDefaultEdgeLabel(function () {
            return {}
        })
        for(let key in nodes){
            let width,height;
            if (nodes[key].type == 'Circle') {
                width = 2 * nodes[key].shape.r;
                height = width;
            }else{
                width = (nodes[key].shape && nodes[key].shape.width) || option.nodes.shape.width;
                height = (nodes[key].shape && nodes[key].shape.height) || option.nodes.shape.height
            }
            g.setNode(key, { width: width, height: height, ...nodes[key] })
        }
        edges.forEach((v) => g.setEdge(v.from, v.to))

        dagre.layout(g)
        g.nodes().forEach((nodeId) => {
            var nodeData = g.node(nodeId)
            var addOffset = [0,0];
            if(nodes[nodeId].type == 'Circle'){
                addOffset = [nodes[nodeId].shape.r,nodes[nodeId].shape.r]
            }
            nodes[nodeId].x = nodeData.x+addOffset[0];
            nodes[nodeId].y = nodeData.y+addOffset[1];
            nodes[nodeId].cx = nodeData.x+addOffset[0];
            nodes[nodeId].cy = nodeData.y+addOffset[1];
        })
        return nodes;
    }
}

export {layout}