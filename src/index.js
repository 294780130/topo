import zrender from 'zrender'
import layout from './layout'
import draw from './draw'
import common from './util/common'
import defaultOption from './util/defaultOption'
import roam from './roam' 
import fit from './util/fitsize'
import action from './action';


class RelationGraphs {
  constructor(dom, data, option) {
    // 初始化数据
    this.dom = dom
    this.data = data
    this.action = action
    this.common = common
    // 合并配置项
    this.option = zrender.util.merge(option || {}, defaultOption)
    // 初始化画布
    this.initZr()
    // 布局
    layout.use(this.option.layout.type, this, zrender)
    // 过滤边
    this.option.needFilter && common.filterEdges(this.data)
    // 绘图
    draw(this, zrender)
    // 绑定拖动和缩放事件
    this.roam = new roam(this, this.zr, zrender)
  }

  // 初始化画布
  initZr() {
    this.zr = zrender.init(document.getElementById(this.dom))
    // 获取容器宽高并记录
    this.container = {
      width: this.zr.getWidth(),
      height: this.zr.getHeight(),
    }
  }

  // 返回数据
  getData() {
    return this.data
  }

  // 返回zrender实例
  getZr() {
    return this.zr
  }

  // 返回zrender对象
  getZrender() {
    return zrender
  }

  // 获取自定义层的group
  getCustomGroup() {
    if (!this.zr.group.childOfName('customGroup')) {
      let customGroup = new zrender.Group()
      customGroup.name = 'customGroup'
      this.zr.group.add(customGroup)
    }
    this.fitSize()
    return this.zr.group.childOfName('customGroup')
  }

  // fitsize方法的暴露
  fitSize() {
    fit(this, zrender)
  }

  // 获取节点的group
  getNodeGroup(id = null) {
    if (id!==null)return this.zr.group.childOfName('nodesGroup').childOfName(`nodeGroup_${id}`)
    return this.zr.group.childOfName('nodesGroup')
  }

  // 获取边的group
  getEdgeGroup(fromId = null, toId = null) {
    if (fromId!==null && toId!==null) return this.zr.group.childOfName('nodesGroup').childOfName(`edgeGroup_${fromId}_${toId}`)
    return this.zr.group.childOfName('edgesGroup')
  }

  // 保存当前视图为图片
  save(){
    var canvas = document.querySelector(`#${this.dom} canvas`);
    var pngData = canvas.toDataURL("image/png");
    var oA = document.createElement("a");
    // 设置下载的文件名，默认是'下载'
    oA.download = '';
    oA.href = pngData;
    document.body.appendChild(oA);
    oA.click();
    // 下载之后把创建的元素删除
    oA.remove();
  }

  // 注册事件
  registerAction(what, when, how){
    this.action[what] && (this.action[what][when] = how);
  }

  // 高亮节点
  hoverNode(id, style){
    let el = this.getNodeGroup(id).childOfName('node');
    this.addHover(el, style)
  }

  // 高亮某个元素
  addHover(el, style){
    this.zr.addHover(el, style)
  }

  // 清楚所有高亮
  clearHover(){
    this.zr.clearHover()
  }

  // 正在调整画布的大小和位置
  roaming(){
    if(this.option.nodes.hideWhenOuter){
      let box = common.getContentBox(this);
      this.zr.group.childOfName('nodesGroup').eachChild(nodeGroup=>{
        var x = nodeGroup.value.x + nodeGroup.position[0]
        var y = nodeGroup.value.y + nodeGroup.position[1]
        if(x >= box.start[0] && x <= box.end[0] && y >= box.start[1] && y <= box.end[1]){
          nodeGroup.show();
        }else{
          nodeGroup.hide();
        }
      })
    }
  }
}

export default RelationGraphs
