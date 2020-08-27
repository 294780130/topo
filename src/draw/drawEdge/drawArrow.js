// 绘制箭头
let drawArrow = function (edge, that, zrender, showEdge) {
    let style = zrender.util.merge(edge.arrowStyle || {}, that.option.edges.arrowStyle)
    // 箭头尺寸，用于控制箭头大小
    let size = showEdge ? (edge.arrowSize === undefined ? that.option.edges.arrowSize : edge.arrowSize) : 0
    // 起终点旋转角度，用于计算箭头的旋转角度
    let angle = (edge.arrowAngle === undefined ? that.option.edges.arrowAngle : edge.arrowAngle)
    // 箭头绘制在0,0点，通过偏移和旋转绘制到目标位置
    let points = [[0,0]];
    let dx = size * Math.abs(Math.sin(angle))
    points.push([-dx, -size])
    points.push([dx, -size])
    let arrow = new zrender.Polygon({
        style,
        shape: {
            points
        },
        // 旋转
        rotation: edge.angle + Math.PI,
        // 偏移
        position: edge.arrowStart,
        // 需要设置一下旋转中心
        origin: [0,0],
        // 位于节点下方
        z: edge.z || -1,
    })
    arrow.polugonPoints = points
    arrow.name = 'arrow'

    // 更新箭头
    arrow.updateShape = function(edge, showEdge){
        arrow.attr('rotation', edge.angle + Math.PI)
        arrow.attr('position', edge.arrowStart)
        arrow.attr('shape', {points: showEdge ? arrow.polugonPoints : []})
    }
    return arrow;
}

export default drawArrow;