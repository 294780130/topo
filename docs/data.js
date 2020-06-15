const data = {
  data: {
    nodes: [
      {
        id: '0',
        // 节点的文本内容
        label: 'Node1',
        // 节点对应的值
        value: 10,
        // 节点类型
        type: '',
        // 节点描述
        desc: '',
        // 节点对应的地址
        link: '',
        // 节点对应的 icon 地址
        icon: '',
      },
      {
        id: '1',
        label: 'Node2',
      },
    ],
    edges: {
      source: '0',
      target: '1',
      label: '30.3%',
      // 关系类型，用于绘图(比如最终根据type，可能绘制成虚线)
      type: '',
    },
  },
  // 应用的配置
  options: {
    layout: 'dagre',
    // 画布四周留白配置
    margin: [10, 10, 10, 10],
    animation: {
      enable: true,
      duration: 5000,
      ease: 'linear',
      delay: 1000,
    },
    nodes: {
      shape: function (data) {
        return data.type === 'person' ? 'circle' : 'rect';
      },
      width: 32,
      height: 32,
      label: {
        // 节点文本字体大小
        'font-size': 12,
        // 节点文本颜色
        color: 'red',
        // 节点文本水平对齐方式
        'text-halign': 'center',
        // 节点文本垂直对齐方式
        'text-valign': 'center',
      },
      // 节点背景图片
      'background-image': '',
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
      custom: function (svg) {
        svg.append('');
      },
    },
    edges: {
      //边的样式
      shape: 'line', //polyline arc quadratic...
      stroke: function (data) {
        return 'red';
      },
      label: {
        // 节点文本字体大小
        'font-size': 12,
        // 节点文本颜色
        color: 'red',
        //文本的位置：
        position: 'center', //left right top bottom
      },
      width: 2,
      custom: function (svg) {},
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
      //箭头类型
      startArrow: false,
      endArrow: false,
      lineDash: [5, 5], //线段长和间距
    },
    tooltip: {
      // 是否开启提示框
      enable: true,
      // 提示框内容格式化函数
      formatter: function () {},
      // 提示框定位偏移量
      offset: [10, 20],
      // 触发提示框方式
      triggerOn: 'mousemove',
      // 提示框的样式配置
      style: {},
    },
  },
};
