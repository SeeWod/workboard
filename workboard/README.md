# 一个绘图白板库

正在编写中。。。

# 概述

**🏷️是什么？**

workboard 是一个用于快速制作绘图白板的js库，目前仅限于pc浏览器（监听鼠标操作）。

**🏷️怎么用？**

workboard使用一个DOM元素为参数创建实例，在该DOM元素内创建一个canvas元素。

通过调用workboard的相关属性方法、监听workboard事件，在该canvas上进行绘图，修改图形样式。

🏷️有哪些特性？

- [x] 目前支持绘制 【矩形、菱形、三角形、圆形、线段、箭头、文字、图片】
- [x] 画板尺寸**无限**
- [x] 画布可**缩放、平移、旋转**
- [x] 画板数据**导出、导入**
- [x] 阅览模式

# 安装

````bash
npm i workboard
````

# 使用

````html
<div id="container"></div>
````

````js
import workboard from 'workboard';

//使用一个DOM元素为容器创建 workboard实例
let app = new workboard({
    styleTheme: {...}, //一个样式的对象 可选（不传入 使用默认样式）
	container:document.getElementById('container')
})

//监听app事件绑定
app.on('workStateChange',(workstate) => {})
app.on('scaleChange',(workstate) => {})
...
app.on('activeEChange',(element)=>{})

//通过设置workstate，在不同工作状态下使用鼠标、键盘进行各项操作
````

- [x] **注意：**画板会自适应外部容器变化，无需担心外部容器尺寸改变！

# 参考手册

### 主要

| Syntax         | 参数                                                         | Description                |
| -------------- | ------------------------------------------------------------ | -------------------------- |
| setWorkState() | workstate【String，必须】  //要设置的工作状态名称<br>opt【Object,】 //切换到creating时候必须携带creatingType[【String 创建元素的类型】属性 | 设置画板工作状态；         |
|                |                                                              | Text                       |
|                |                                                              |                            |
|                |                                                              |                            |
| exportFile()   | filename【String，必须】 //导出的文件名                      | 导出当前画板的数据（JSON） |
| importFile()   |                                                              | 导入清空画板数据           |

### 坐标轴相关

| Syntax         | 参数                                                       | Description     |
| -------------- | ---------------------------------------------------------- | --------------- |
| changeScroll() | {scrollX: xxx, scrollY: xxx}或{OffsetX: xxx, OffsetY: xxx} | 更改 画板滚动量 |
| changeScale()  | {scale:xxx}或{Offset: xxx}                                 | 更改 画板缩放量 |
| changeRotate() | {rotate: xxx}或{Offset: xxx}                               | 更改 画板旋转量 |
| gridRender     |                                                            |                 |





元素属性

|        | 图形元素 | 点组合元素 | text | image |
| ------ | -------- | ---------- | ---- | ----- |
| x，y   | ✔        |            | ✔    | ✔     |
| width  | ✔️        |            | ✔️    | ✔     |
| height | ✔️        |            | ✔    | ✔️     |
| rotate | ✔️        |            | ✔    | ✔️     |
| text   |          |            | ✔    |       |
| points |          | ✔          |      |       |
|        |          |            |      |       |

元素样式

|              | 图形元素 | 点组合元素 | text | image |
| ------------ | -------- | ---------- | ---- | ----- |
| fillStyle    | ✔️        |            | ✔️    |       |
| strokenStyle | ✔️        | ✔️          |      | ✔️     |
| lineWidth    | ✔️        | ✔️          |      | ✔️     |
| lineDash     | ✔️        | ✔️          |      | ✔️     |
| globalAlpha  | ✔️        | ✔️          | ✔️    | ✔️     |
|              |          |            |      |       |

## 事件

每一个与用户交互的参数，都设置了事件，可以通过事件监听，来获取相关参数信息

| 事件名称        | Description      | 回调函数可接受参数                                   |
| --------------- | ---------------- | ---------------------------------------------------- |
| workStateChange | 白板工作状态改变 | String  //工作状态名称                               |
| activeEchange   | 激活元素改变     | obj //激活元素的实例                                 |
| scrollChange    | 画板滚动值改变   | {x,y} //包含画布的水平滚动距离x，垂直滚动距离y的对象 |
| scaleChange     | 画板缩放值改变   | Number //当前画布缩放倍数                            |
| rotateChange    | 画板旋转值改变   | Number //当前画布旋转角度                            |

## 元素：

设置属性必须







workState：

selection：该状态下，可以使用鼠标来选择、调整元素

creating：该状态下，可以使用鼠标操作 创建元素

readonly：该状态下，鼠标的一些操作能够更好的帮助您进行阅览画板



元素创建方式：

基础图形类、线段类：鼠标按下拖动创建

文字类：点击 画板输入文字来创建，双击文字、即可编辑文字

图片类：点击画板选择图片来创建



## 样式主题

| 属性名          | 值   | 说明         | 默认值      |
| --------------- | ---- | ------------ | ----------- |
| backgroundColor |      | 画板背景颜色 | #c3e5e9     |
| fillStyle       |      | 图形填充颜色 | transparent |
| strokenStyle    |      | 默认         |             |
|                 |      |              |             |





​    backgroundColor :"#c3e5e9",

​    MarqueeStrokeStyle :"#666",

​    //元素默认绘制样式(与主题)

​    strokeStyle :"#8888",

​    fillStyle : 'transparent',

​    lineWidth: 2, // 线条宽度

​    lineDash: [0,0] , // 线条虚线大小[实线]

​    globalAlpha: 1, // 透明度

​    fontFamily :"微软雅黑, Microsoft YaHei",

​    fontSize :18,

​    noteColor: "#ffe952"
