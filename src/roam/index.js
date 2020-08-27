// 画布允许拖动和缩放，参照官方示例
class Roam{
  constructor(that, zr, zrender, handler){
    this.zr = zr;
    this.root = zr.group;
    this.handler = handler;
    this.zrender = zrender;
    this.that = that;
    this.roots = [];
    this.rawTransformable = new zrender.Group()
    this.roamTransformable = new zrender.Group()
    this.roamTransformable.add(this.rawTransformable)
    this.moving = false;
    this.indexExists = this.find(this.root) 
    this.init()
  }
  init(){
    if (this.zr === false || this.root === false) {
      this.roots.length = 0
      return
    }

    if (this.handler === false) {
      if (this.indexExists >= 0) {
        this.roots.splice(this.indexExists, 1)
      }
      return
    }

    if (this.indexExists >= 0) {
      return
    }

    this.roots.push({ root: this.root, handler: this.handler })

    if (!this.zr.__testRoamableMounted) {
      this.zr.on('mousewheel', (e)=> {

        e.stop()

        let wheelDelta = e.wheelDelta
        let absWheelDeltaDelta = Math.abs(wheelDelta)
        let originX = e.offsetX
        let originY = e.offsetY

        // wheelDelta maybe -0 in chrome mac.
        if (wheelDelta === 0) {
          return
        }

        let factor = absWheelDeltaDelta > 3 ? 1.4 : absWheelDeltaDelta > 1 ? 1.2 : 1.1
        let scaleDelta = wheelDelta > 0 ? factor : 1 / factor

        for (let i = 0; i < this.roots.length; i++) {
          this.updateTransform(this.roots[i], [0, 0], [scaleDelta, scaleDelta], [originX, originY])
        }
      })
      this.zr.on('mousedown', (e)=>{
        if (!e.target) {
          this.moving = [e.offsetX, e.offsetY]
        }
      })
      this.zr.on('mousemove', e=>{
        if (!this.moving) {
          return
        }
        let pointerPos = [e.offsetX, e.offsetY]
        for (let i = 0; i < this.roots.length; i++) {
          this.updateTransform(this.roots[i], [pointerPos[0] - this.moving[0], pointerPos[1] - this.moving[1]], [1, 1], [0, 0])
        }
        this.moving = pointerPos
      })
      this.zr.on('mouseup', e =>{
        this.moving = false
      })
      this.zr.__testRoamableMounted = true
    }
  }

  find(root) {
    for (let i = 0; i < this.roots.length; i++) {
      if (this.roots[i].root === root) {
        return i
      }
    }
    return -1
  }

  handleMouseWheel(e) {
    e.stop()
    let wheelDelta = e.wheelDelta
    let absWheelDeltaDelta = Math.abs(wheelDelta)
    let originX = e.offsetX
    let originY = e.offsetY
    // wheelDelta maybe -0 in chrome mac.
    if (wheelDelta === 0) {
      return
    }
    let factor = absWheelDeltaDelta > 3 ? 1.4 : absWheelDeltaDelta > 1 ? 1.2 : 1.1
    let scaleDelta = wheelDelta > 0 ? factor : 1 / factor
    for (let i = 0; i < roots.length; i++) {
      this.updateTransform(roots[i], [0, 0], [scaleDelta, scaleDelta], [originX, originY])
    }
  }

  updateTransform(rootRecord, positionDeltas, scaleDeltas, origin) {
    let root = rootRecord.root

    this.rawTransformable.scale = root.scale.slice()
    this.rawTransformable.position = root.position.slice()
    this.rawTransformable.origin = root.origin && root.origin.slice()
    this.rawTransformable.rotation = root.rotation

    this.roamTransformable.scale = scaleDeltas
    this.roamTransformable.origin = origin
    this.roamTransformable.position = positionDeltas
    this.roamTransformable.updateTransform()
    this.rawTransformable.updateTransform()

    this.zrender.matrix.copy(root.transform || (root.transform = []), this.rawTransformable.transform || this.zrender.matrix.create())

    this.root.decomposeTransform()
    this.root.dirty(true)

    let handler = rootRecord.handler
    handler && handler(root)
    // 绑定拖动缩放的事件
    this.that.action.do('canvas', 'roam', root)
    // 传递信号，正在调整画布大小和位置
    this.that.roaming();
  }
}

export default Roam