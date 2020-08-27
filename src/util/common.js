let common = {
    // 过滤无关边：没有起点、没有终点、起点就是终点
    filterEdges: function (data) {
        if(!data.edges) data.edges = [];
        data.edges = data.edges.filter(edge=>(data.nodes[edge.from] && data.nodes[edge.to] && (edge.from !== edge.to)))
    },
    // 执行函数到数值（兼容传入的是数值）
    fnToNum(a, b){
        return (typeof a == 'function' ? a(...b) : a)
    },
    // 矩形的distance通用函数（用于节点的distance）
    rectDistance(angle, width, height){
        if(Math.abs(Math.tan(Math.PI - angle)) <= (width / height) ){
            return height / 2 / Math.abs(Math.cos(Math.PI - angle));
        }else{
            return width / 2 / Math.abs(Math.sin(Math.PI - angle));
        }
    },
    getContentBox(that){
        let group = that.zr.group
        let position = group.position
        let origin = group.origin
        let scale = group.scale[0]
        let bBox = group.getBoundingRect();
        // 计算视口真实xy范围
        let realRegionStart = [0,0]
        let rewalWidth = bBox.width * scale;
        let rewalHeight = bBox.height * scale;
        // 视口范围的起始点
        let startPoint = [(origin[0] + position[0])/scale*-1 + origin[0], (origin[1] + position[1])/scale*-1 + origin[1]]
        // 视口的真实宽度
        let realSize = [that.container.width / scale,that.container.height / scale]
        // 四周边距
        let pad = that.option.nodes.hidePadding;
        let contentBox = {
            start:[startPoint[0]-pad[0],startPoint[1]-pad[1]],
            end: [startPoint[0]+realSize[0]+pad[0],startPoint[1]+realSize[1]+pad[1]]
        }
        return contentBox
    }
}

export default common