let action = {
    // 画布整体事件
    canvas:{
        // 点击没有元素的地方
        clickBlank: null,
        // 缩放改变
        roam: null
    },
    // 节点事件
    node:{
        // 单击
        click: null,
        // 鼠标按下
        mouseDown: null,
        // 拖拽
        drag: null,
        // 双击
        doubleClick: null,
        // 鼠标移动
        mouseMove: null,
        // 鼠标移出
        mouseOut: null
    },
    // 连线事件
    edge:{
        // 单击
        click: null,
        // 鼠标移动
        mouseMove: null
    },
    // 调用函数
    do: function(what, when, ...args){
        typeof this[what][when] == 'function' && this[what][when](...args);
    }
}

export default action