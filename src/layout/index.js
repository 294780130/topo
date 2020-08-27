import custom from './custom'
import matrix from './matrix'
import pack from './pack'
import cluster from './cluster'
import dagre from './dagre'
import tree from './tree'

// 校验需要d3的布局算法
const d3Need = ['pack', 'cluster', 'force', 'tree']

let layout = {
  custom,
  dagre,
  matrix,
  pack,
  cluster,
  tree,
  use: function (name, that, zrender){
    if(this[name]){
      // 使用到d3的布局需要以cdn形式引入d3
      if(d3Need.includes(name)){
        if(!window.d3){
          console.error(`使用的布局需要d3.js支持，请在html中引入'//s.thsi.cn/js/datav/lib/d3.v5.min.js'`)
          return;
        }
      }
      this[name](that, zrender)
    }else{
      console.error(`没有找到匹配的布局算法${name}`)
    }
  }
}

export default layout
