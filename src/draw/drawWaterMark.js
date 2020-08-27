// 添加水印
let drawWaterMark = function (that, zrender) {
    let opt = that.option.waterMark;
    that.zr.waterMark = new zrender.Group()
    // 通过固定的水印密度（几行几列）布满容器
    let width = that.container.width / opt.col;
    let height = that.container.height / opt.row;
    for(let i = 0; i < opt.row; i++){
        for(let j = 0; j < opt.col; j++){
            opt.option.shape = {
                x: j * width,
                y: i * height,
                width,
                height
            }
            let content = new zrender[opt.type](opt.option)
            that.zr.waterMark.add(content)
        }
    }
    that.zr.add(that.zr.waterMark)
}

export default drawWaterMark;