import common from './common'
let defaultOption = {
  // 画布的四周留白，用于自适应缩放画布
  scalePadding: 40,
  // 是否需要过滤错误的边
  needFilter: true,
  // 布局设置
  layout: {
    // 布局的名称,custom为静态的,使用数据的xy直接布局
    type: 'custom', 
    // 应用于布局的配置项,每个布局都不同
    option: {}
  },
  // tooltip
  tooltip: {
    // css样式均支持
    style: {
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
      maxWidth: '200px',
      padding: '8px 8px',
      background: 'rgba(51,51,51,.8)',
      color: '#fff',
      borderRadius: '6px',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      display: 'none',
    },
    // 内容的formatter函数
    formatter: function (d) {
      return `名称：${d.label}`
    },
    // 相对于鼠标的偏移值,不能太小不然会闪烁
    offset: [12, 8],
    // tooltip是否在容器内部
    inside: true,
  },
  // 节点样式
  nodes: {
    // 节点形状,Rect能画方形,圆角矩形,圆形
    type: 'Rect',
    // 双击节点的判定延迟,会影响单击的触发效率
    doubleClickTimer: 200,
    // 当节点在外面时隐藏显示
    hideWhenOuter: false,
    // x，y方向留白值
    hidePadding: [200,100],
    // 节点样式
    style: {
      // 填充色
      fill: '#54A0FF',
      // 字体颜色
      textFill: '#fff',
      // 文字是否跟随缩放
      transformText: true,
      // 字号
      fontSize: 14,
    },
    // 图形形状
    shape: {
      width: 120,
      height: 40,
      r: 12,
    },
    // 图形边缘距离中心的距离(箭头起点位置)随角度的变化值
    distance: function (angle, width, height) {
      // 默认为矩形的计算
      return common.rectDistance(angle, width, height)
    },
  },
  // 边的配置
  edges: {
    // 样式
    style: {
      // 描边
      stroke: '#54A0FF',
      // 虚线
      // lineDash: [5, 3],
    },
    // 箭头的样式
    arrowStyle: {
      // 填充色
      fill: '#54A0FF',
    },
    // 箭头的大小
    arrowSize: 16,
    // 箭头的角度(胖瘦)
    arrowAngle: Math.PI / 6,
  },
  // 水印
  waterMark:{
    // 是否显示
    show: false,
    // 绘制的形状
    type: 'Rect',
    // 行数
    row: 4,
    // 列数
    col: 3,
    // 配置项
    option:{
      // 不响应鼠标事件
      silent: true,
      style:{
        fill: 'rgba(0,0,0,0)',
        opacity: 0.4,
        text: 'userName@myhexin.com',
        textFill: '#ccc',
        textRotation: Math.PI/6,
      },
      // 置于底层
      z: -999
    }
  },
}

export default defaultOption
