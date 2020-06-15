export default class FlowApi {
  constructor(zr, group) {
    this.zr = zr
    this.group = group
  }

  fit(zoom) {
    let bb = this.group.getBoundingRect()
    let gWidth = this.zr.getWidth()
    let gHeight = this.zr.getHeight()

    zoom = zoom || Math.min(gWidth / bb.width, gHeight / bb.height)

    let position = [(gWidth - zoom * bb.width) / 2, (gHeight - zoom * bb.height) / 2]

    this.group.position = position
    this.group.scale = [zoom, zoom]
    this.group.dirty()

  }

  center() {
    let zoom = this.group.scale[0] || 1
    this.fit(zoom)
  }

  focus(element, zoom) {

    let bb = element.getBoundingRect()
    let gWidth = this.zr.getWidth()
    let gHeight = this.zr.getHeight()

    zoom = zoom || Math.min(gWidth / bb.width, gHeight / bb.height)

    let position = [(gWidth - zoom * bb.width) / 2, (gHeight - zoom * bb.height) / 2]

    this.group.drift(...position)
    this.group.scale = [zoom, zoom]
    this.group.dirty()

  }
}
