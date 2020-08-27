# API手册

​	在绘图初始化后，得到一个实例对象，你可以通过其方法，更好地控制它

### 基础方法

* 获取元素
  * getData：获取绘图用的data
  * getZr：获取zrender实例
  * getZrender： 获取zrender（为了可以用它的方法）
  * getNodeGroup(id?)：获取节点的group，可选传入参数id，传入则返回对应id的节点group，不传则返回所有节点
  * getEdgeGroup(formId, toId)：获取连线的group，可选传入参数formId toId，传入则返回对应的连线group，不传则返回所有连线
  * getCustomGroup：获取自定义层的group，用于绘制自定义内容
  * ​
* 视图操作
  * fitSize：自适应缩放到图撑满容器
  * hoverNode(id, style)：根据id高亮一个节点，置于高亮层并赋予新样式（覆盖）
  * addHover(el, style)：将一个元素添加到高亮层并赋予新样式（覆盖）
  * clearHover()：清除整个高亮层
* 其他操作
  * save：保存当前canvas视图为图片

### 事件类

* registerAction：注册事件，三个参数：what，when，how，支持的事件如下

| what--事件发生在 | when--当什么事件时 | 说明       | 回调函数how的参数       |
| ----------- | ------------ | -------- | ---------------- |
| canvas      | clickBlank   | 点击画布空白区域 | 点击事件e            |
| canvas      | roam         | 画布拖动或缩放  | 缩放的group         |
| node        | click        | 点击节点     | 节点id，节点group，事件e |
| node        | mouseDown    | 按下节点     | 节点id，节点group，事件e |
| node        | drag         | 拖动节点     | 事件e              |
| node        | doubleClick  | 双击节点     | 节点id，节点group，事件e |
| node        | mouseMove    | 鼠标在节点上移动 | 事件e              |
| node        | mouseOut     | 鼠标移出节点   | 事件e              |
| edge        | click        | 鼠标点击连线   | 连线group，事件e      |
| edge        | mouseMove    | 鼠标在连线上移动 | 连线group，事件e      |



### 自定义层操作

**自定义采用调用API暴露底层的方法实现**

1.创建绘图实例

```javascript
let flow = new RelationGraphs('chart', data, option) //创建实例 
```

2.调用API，初始化绘图工具

```javascript
let customGroup = flow.getCustomGroup()   //获取自定义渲染层
let zrender = flow.getZrender()  //获取zrender绘制库
```

3.绘制图形，推入自定义渲染层，图形绘制可参考[zrender官网](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable)

```javascript
 let heart = new zrender.Heart({
        draggable: true,
        shape: {
          cx: 300,
          cy: 300,
          width: 100,
          height: 150,
        },
        style: {
          fill: 'red',
        },
        z: -2,   //可自定义图形所在层级，节点默认在0层，连线默认在-1层
      })
  customGroup.add(heart)
  flow.fitSize() //图形尺寸位置自适应调整
```

