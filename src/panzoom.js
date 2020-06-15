import zrender from 'zrender'

function panZoom(zr, root) {
  let roaming, startX, startY, startPosition
  zr.on('mousedown', ({ offsetX, offsetY, target }) => {
    //没有 target，才能进行平移
    if (!target) {
      roaming = true
      startX = offsetX
      startY = offsetY
      startPosition = [root.position[0], root.position[1]]
    }
  })

  zr.on('mousemove', ({ target, offsetX, offsetY }) => {
    if (roaming) {
      root.attr({
        position: [offsetX - startX + startPosition[0], offsetY - startY + startPosition[1]],
      })
    }
  })

  zr.on('mouseup', (e) => {
    roaming = false
  })

  zr.on('mousewheel', function (e) {
    console.log(e.target)
    let delta = e.wheelDelta
    let scaleDelta = delta * 0.1 + 1
    scale(e.offsetX, e.offsetY, scaleDelta)
    e.stop()
  })

  function scale(offsetX, offsetY, delta) {
    let transform = root.getLocalTransform()

    zrender.matrix.translate(transform, transform, [-offsetX, -offsetY])
    zrender.matrix.scale(transform, transform, [delta, delta])
    zrender.matrix.translate(transform, transform, [offsetX, offsetY])
    root.transform = transform
    console.log(transform)
    root.decomposeTransform()
    root.dirty()
  }
}

export default panZoom