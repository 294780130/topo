// 自定义布局
let custom = function (that) {
    checkPosition(that.data.nodes);
}

// 校验节点xy，若无重置为0
let checkPosition = function(nodes){
    for(let id in nodes){
        let node = nodes[id]
        if(node.x === undefined){
            console.error(`节点${id}没有x坐标，已初始化为0`);
            node.x = 0;
        }
        if(node.y === undefined){
            console.error(`节点${id}没有y坐标，已初始化为0`);
            node.y = 0;
        }
    }
}

export default custom;