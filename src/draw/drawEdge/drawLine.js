// 绘制连线
let drawLine = function (edge, that, zrender) {
    let style = zrender.util.merge(edge.style || {}, that.option.edges.style)
    let line = new zrender.Line({
        style,
        shape: createShape(edge),
        z: edge.z || -1,
    })
    line.name = "line"
    // 提供更新连线的方法
    line.updateShape = function(edge){
        line.attr('shape', createShape(edge))
    }
    return line;
}

// 计算连线的起终点
function createShape(edge){
    return{
        x1: edge.lineStart[0],
        y1: edge.lineStart[1],
        x2: edge.lineEnd[0],
        y2: edge.lineEnd[1],
    }
}
export default drawLine;