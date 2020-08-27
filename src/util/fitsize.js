// 自适应画布缩放和平移到撑满容器
let fitSize = function (that) {
    let W = that.container.width;
    let H = that.container.height;
    // 整体的包围盒,需要注意如果有空的group会被计算为[0,0]也有内容
    let bBox = that.zr.group.getBoundingRect();
    let pd = that.option.scalePadding * 2
    let scale = 1;
    if((bBox.width + pd) / (bBox.height + pd) < W / H){
      // 高撑满
      scale = H/(bBox.height + pd)
    }else{
      // 宽撑满
      scale = W/(bBox.width + pd)
    }
    that.zr.group.scaleTo((bBox.x + bBox.width/2),(bBox.y + bBox.height/2), scale)
}

export default fitSize;