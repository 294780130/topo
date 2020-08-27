import drawNode from './drawNode/'
import drawEdge from './drawEdge/'
import drawTooltip from './drawTooltip'
import drawWaterMark from './drawWaterMark'
import bindZrEvent from './bindZrEvent';

// 绘图
let draw = function (that, zrender) {
  that.zr.group = new zrender.Group()
  // scaleTo方法，用于fitsize时使用，聚焦到某个位置
  that.zr.group.scaleTo = function (x, y, scale) {
    that.zr.group.scale = [scale, scale]
    that.zr.group.origin = [x, y]
    // 将缩放中心平移到容器中心
    that.zr.group.position = [that.container.width / 2 - x, that.container.height / 2 - y]
    that.zr.group.dirty(true)
  }

  that.zr.add(that.zr.group)
  // 绘制tooltip
  drawTooltip(that, zrender)
  // 绘制节点
  drawNode(that, zrender)
  // 绘制边
  drawEdge(that, zrender)
  // 绘制水印
  that.option.waterMark.show && drawWaterMark(that, zrender)

  // 绑定拖拽事件
  bindZrEvent(that)

  // 将画布内容缩放到能看到全部
  that.fitSize()
}

export default draw
