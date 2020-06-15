## 开始使用HXTopology

#### 一.引入HXTopology

在使用HXTopology前需要在body中添加一个含有id容器，设置容器的宽高

```html
<div id="main"></div>
```

可以通过下面的设置使得main自动占满浏览器窗口

```css
#main {
        margin: 0 auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
```

另外需要在html中加载对应的js文件

```html
<script src="./dist/zrender.js"></script>
```



#### 二.使用HXTopology

在使用HXTopology前需要创建一个对应实例，传入相应的参数，其中domId为容器的id，data为数据，option为配置项。最后执行drawTopo函数

```javascript
let topo = new HXTopology(domId,data,option);

topo.draw();
```



#### 三.数据结构和配置项格式

##### 数据结构

```javascript
 data: {
    nodes: [
      {
        //节点的id（必填）
        id: '0',
        // 节点的文本内容（必填）
        label: 'Node1',
        // 节点类型，用来作custom自定义判断
        type: '',
        // 节点描述提示框
        tooltip: '',
      },
      {
        id: '1',
        label: 'Node2',
      },
    ],
    edges: {
      //起始节点的id（必填）
      source: '0',
      //目标节点的id（必填）
      target: '1',
      //连线的标签
      label: '30.3%',
    },
  }
```

##### 配置项

```javascript
option: {
  //暂时只支持dagre布局
  layout: 'dagre',
  //是否点击显示相关
  showRelation:false,
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
      //文本偏移量
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
    arrowColor:'#000',
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
```



#### 四、使用自定义配置

HXTopology底层绘图库选用的是zrender，所以在custom中可以直接调用zrender的方法绘制图形，暂时只支持节点的自定义样式，具体可以看下面的demo

```javascript
custom: function (context, value, helper) {
            let id = value.id
            //匹配data.nodes.label中的括号里的值，即数量
            let badge = /\s\((.*)\)/gi.exec(value.label)
            //g是dagre布局生成的实例，具体的方法可以参考dagre的文档
            let {zrender, g} = helper
            //获取没有子节点的节点
            let sinkNodes = g.sinks()
			
            badge = badge && badge[1]
			//如果字段中包含如（11）这种的字符则在左上角放置一个图形
            if (badge) {
              context.add(
                new zrender.Circle({
                  shape: {
                    cx: value.x + value.width,
                    cy: value.y,
                    r: 10,
                  },
                  style: {
                    text: badge,
                    fontSize: 12,
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                    textOffset: [0, 1],
                    fill: '#f0932b',
                    textFill: '#fff',
                    transformText: true,
                  },
                  z: 11,
                })
              )
            }
			//将没有子节点的节点标记为另一种颜色
            if (sinkNodes.includes(id)) {
              return {
                style: {
                  fill: '#7bb6ff'
                }
              }
            }
			//对单个节点进行设置
            if (id === 'nw_hq_shl2_215_69;cnfutures;1') {

              context.add(
                new zrender.Image({
                  style: {
                    image: '../assets/pic2.png',
                    x: value.x + 10,
                    y: value.y + value.height / 2 - 15,
                    height: 30,
                    width: 30,
                  },
                  z: 10,
                })
              )
              return {
                style: {
                  fill: 'red',
                  textAlign: 'left',
                  textOffset: [-50, 0],
                },
              }
            } else if (id === 'sqyd_hq_fu_2_153;cnfutures;1') {


              context.add(
                new zrender.Image({
                  style: {
                    image: '../assets/pic1.png',
                    x: value.x + 10,
                    y: value.y + value.height / 2 - 15,
                    height: 30,
                    width: 30,
                  },
                  z: 10,
                })
              )
            }
          },
```





## 问题列表

##### 视图平移缩放后，导致绘图坐标系统与鼠标事件对象的数据不一致？

通过 transformCoordToLocal 方法将事件对象中的值进行转换，该方法会在提供的参数基础上作用上偏移、缩放等因素，返回正确用于绘图的坐标值。

如 transformCoordToLocal(e.offsetX, e.offsetY)

https://ecomfe.github.io/zrender-doc/public/api.html#zrendertransformabletransformcoordtolocalx-y

##### group 的拖动？

group 是一个容器，可以插入子节点，group 的变换也会被应用到子节点上。

zrender 内部未做 group 拖拽的直接支持，通过以下步骤实现：

group 可拖拽的条件：

1. 在创建 group 的时候，传入 {draggable: true}
```
var group = new zrender.Group({
  draggable: true
})
```

2. group 内部的子节点都``不能``设置 draggable 为 true

3. 可拖拽的 group，支持绑定 `dragstart`, `drag`, `dragend` 事件

##### 怎么更新箭头和直线的位置？

箭头和直线的位置的更新是通过直线和两个矩形的相交点坐标的变化来动态生成的

1.关于交叉点坐标的获取，可以调用`GetCrossPoint.lineRect（linePoint,RectPoint）`方法来生成坐标，具体算法可以看看getCrossPoint.js文件，里面有注释。

核心是分别判断直线和矩形四条边是否相交，若相交就能获取交点坐标。

2.箭头的顶部坐标就是targetNode和直线相交点的坐标，通过直线两点的横纵坐标可以计算出箭头旋转的角度，从而可以实现箭头和直线位置、角度更新

##### 怎么实现点击只显示相关节点？

在drawFlow.js中，使用了zrender中的group来管理图形。

例如某个node节点中节点图形、自定义添加的图标、形状等都在同一个的nodeGroup中，然后将多个nodeGroup放在dagreGroup中。同理lineGroup也包含了相应的标签、箭头以及直线。

下面就是具体的实现步骤：

1.找到被点击的节点

这个直接调用e.target就可以找到对应的nodeGroup中某一个元素，然后找到parent中的value.id，即对应的节点id信息。

2.调用g（dagre）实例可以找到该节点相关的父节点和子节点，另外也可以找到对应相关的线

3.通过这些结果就可以找到对应不相关的节点和线

4.对找到的这些节点进行遍历（找到的节点其实只是这个节点的矩形元素），调用node.parent.eachChild方法（遍历该nodeGroup的所有子元素），对所有不相关的线和节点透明度提高就可以实现显示相关节点

##### custom是怎么实现的？

```javascript
 if (custom) {
     //先执行custom函数，可以实现增加图形的功能，然后返回一个配置项
        customStyle = custom(nodeGroup, value, {zrender, g}) || {}
      }

      let merge = zrender.util.merge
		//将配置项和默认配置项合并进行覆盖
      this.nodeList[key] = new zrender.Rect(
        merge(
          {
            shape: { x: value.x, y: value.y, width: value.width, height: value.height, r: option.nodes.borderRadius },
            style: {
              text: value.label,
              textOffset: option.nodes.label.textOffset,
              transformText: true,
              fill: option.nodes.fill,
              textFill: option.nodes.label.color,
              fontSize: option.nodes.label.fontSize,
              shadowBlur: option.nodes.shadowBlur,
              shadowColor: option.nodes.shadowColor,
              shadowOffsetX: option.nodes.shadowOffsetX,
              shadowOffsetY: option.nodes.shadowOffsetY,
            },
            z: 1,
          },
          customStyle,
          true
        )
      )
```



##### tooltip有什么bug？

tooltip的触发绑在节点对象的`mouseover`事件中，所以在节点拖动过程中如果触碰到其他节点则会触发其他节点的`mouseover`事件，那么tooltip就会闪烁

