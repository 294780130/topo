const defaultOption = {
  //暂时只支持dagre布局
  layout: 'dagre',
  //是否高亮相关节点
  showRelation :false,
  //暂未实现
  animation: {
    enable: true,
    duration: 5000,
    ease: 'linear',
    delay: 1000,
  },
  nodes: {
    //节点的形状,暂时只支持矩形节点
    shape: 'rect',
    //矩形的宽高
    width: 200,
    height: 80,
    label: {
      // 节点文本字体大小
      fontSize: 14,
      // 节点文本颜色
      color: '#000',
      //文本位置
      position: 'center',
      textOffset:[0,0],
    },
    //矩形圆角
    borderRadius: [20, 20, 20, 20],
    //阴影设置
    shadowBlur: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    //矩形填色
    fill: '#e55039',
    // 节点背景图片（暂未实现）
    backgroundImage: '',
    //对应的不同状态的样式
    state: {
      //鼠标悬浮对应样式
      hover: {
        backgroundColor: '',
        border: '',
        label: '',
      },
      //点击对应样式
      click: { lineWidth: '', color: '', custom: function () {} },
    },
    custom: function () {},
  },
  edges: {
    //边的样式，暂时只支持直线
    shape: 'line', //polyline arc quadratic...
    stroke: '#999',
    label: {
      // 节点文本字体大小
      fontSize: 16,
      // 节点文本颜色
      color: '#fff',
      //文本的位置：
      position: 'center', //left right top bottom
    },
    //线宽
    lineWidth: 2,
    state: {
      //鼠标悬浮对应样式
      hover: {
        backgroundColor: '',
        border: '',
        label: '',
      },
      //点击对应样式
      click: { lineWidth: '', color: '', custom: function () {} },
    },
    //箭头配置
    arrow: true,
    arrowSize: 1,
    arrowColor:'',
    //是否设置为虚线
    lineDash: false,
    custom: function () {},
  },
  tooltip: {
    // 是否开启提示框
    enable: true,
    // 提示框内容格式化函数
    formatter: function () {},
    // 提示框定位偏移量
    offset: [10, 20],
  },
}

export default defaultOption
