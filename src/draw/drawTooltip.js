// 绘制tooltip（是dom节点--div）
let drawTooltip = function (that, zrender) {
    let domEle = document.getElementById(that.dom)
    // 为了相对父元素进行定位，父元素不能是static定位
    if (window.getComputedStyle(domEle).position == 'static') {
      domEle.style.position = 'relative'
    }
    that.tooltip = document.createElement('div')
    that.tooltip.id = 'tooltip_' + that.zr.getId()
    let tooltipOption = that.option.tooltip
    that.tooltip.inside = tooltipOption.inside
    // 循环批量设置css样式
    for (let key in tooltipOption.style) {
      that.tooltip.style[key] = tooltipOption.style[key]
    }
    document.getElementById(that.dom).appendChild(that.tooltip)

    // 更新tooltip内容
    that.tooltip.update = function(content, offset = [0,0]){
        // 没有内容时不显示
        if(content == '' || content == undefined){
            that.tooltip.style.display = 'none'
            return
        }
        if(that.tooltip.innerHTML !== content) that.tooltip.innerHTML = content;
        that.tooltip.style.display = 'block'
        let left = offset[0] + tooltipOption.offset[0];
        let top = offset[1] + tooltipOption.offset[0]
        // 是否限制在父容器内部
        if(that.tooltip.inside){
            let needInside = that.tooltip.ifNeedInside([left, top])
            let bBox = that.tooltip.getBoundingClientRect()
            // x方向超出向左偏
            if(needInside[0]) left-= (2*tooltipOption.offset[0] + bBox.width);
            // y方向超出向上偏
            if(needInside[1]) top-= (2*tooltipOption.offset[1] + bBox.height);
        }
        that.tooltip.style.left = left + 'px'
        that.tooltip.style.top = top + 'px'
    }

    // 隐藏
    that.tooltip.hide = function(){
        that.tooltip.style.display = 'none'
    }

    // 显示
    that.tooltip.show = function(){
        that.tooltip.style.display = 'block'
    }

    // 判断当前位置是否需要inside处理，返回true/false
    that.tooltip.ifNeedInside = function(position = [0,0]){
        let left = position[0]
        let top = position[1]
        let h = that.tooltip.offsetHeight
        let w = that.tooltip.offsetWidth
        let res = [left + w > that.container.width, top + h > that.container.height]
        return res;
    }
}

export default drawTooltip;