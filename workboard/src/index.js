import {createCanvas,throttle,degToRad} from './utils'
import {drawGrid,drawBackground} from './utils/draw'
import EventEmitter from 'eventemitter3'
import {BASE_ELEMENTS,POINT_ELEMENTS,TEXT_ELEMENTS} from './constants'
//坐标、位置 管理类
import CooManager from './CooManager'
//手柄、操作 管理类
import HandleManager from './HandleManager'
//元素管理类
import EleManager from './EleManager'

//工作白板
class WorkBoard extends EventEmitter{
    //默认 样式主题
    static defaultStyle = {
        backgroundColor :"#ffff",
        MarqueeStrokeStyle :"#666",

        //元素默认绘制样式(与主题)
        strokeStyle :"#8888",
        fillStyle : 'transparent',
        lineWidth: 2, // 线条宽度
        lineDash: [0,0] , // 线条虚线大小[实线]
        globalAlpha: 1, // 透明度

        fontFamily :"微软雅黑, Microsoft YaHei",
        fontSize :18,
        noteColor: "#ffe952"
    }

    constructor(opts){
        super()

        //参数 [容器元素、样式主题、媒体]
        this.opts = opts;
        this.container = opts.container
        this.style = opts.styleTheme || WorkBoard.defaultStyle
        //媒体代表操作画板所用的设备，包括-鼠标键盘（MOUSE AND KEYBOARD）、触摸、..
        this.media = opts.media || "MOUSE AND KEYBOARD"

        this.resizeObserver = null
        this.containerWidth = 0
        this.containerHeight = 0
        this.containerLeft = 0
        this.containerTop = 0

        //画布相关
        this.canvas = null
        this.ctx = null

        //白板工作状态 selection、creating、readonly
        this.workState = 'selection'
        //白板分化功能模块
        this.cooManager = new CooManager(this)
        this.eleManager = new EleManager(this)
        this.handleManager = new HandleManager(this)

        //实例生成初始工作
        this.init()
    }

    init(){
        // 获取容器 尺寸位置信息
        let{width,height,top,left} = this.container.getBoundingClientRect()
        this.containerWidth = width
        this.containerHeight = height
        this.containerLeft = left
        this.containerTop = top

        //创建画布
        let { canvas,ctx } = createCanvas(this.containerWidth, this.containerHeight,{
            className:'main'
        })
        this.canvas = canvas
        this.ctx = ctx
        this.container.appendChild(this.canvas)

        //容器事件绑定
        this.resizeObserver = new ResizeObserver((entries) => {
            //画布所在容器更新（全屏、移动、缩放时）
            let{width,height,top,left} = entries[0].contentRect

            this.containerWidth = width
            this.containerHeight = height
            this.containerLeft = left
            this.containerTop = top
            
            this.canvas.width = width
            this.canvas.height = height
    
            this.render()
        });
        this.resizeObserver.observe(this.container);

        //画布操作接口绑定
        switch(this.media){
            case 'MOUSE AND KEYBOARD':
                //鼠标和键盘 媒体 - 画布操作事件绑定
                this.canvas.addEventListener("mousedown",this.onMousedown.bind(this))
                this.canvas.addEventListener("mouseup",this.onMouseup.bind(this))
                this.canvas.addEventListener("mousemove",throttle.call(this,this.onMousemove,20))
                this.canvas.addEventListener("mousewheel",function(e){e.preventDefault();})
                this.canvas.addEventListener("mousewheel",throttle.call(this,this.onMousewheel,20))
                this.canvas.addEventListener("dblclick",this.onDbclick.bind(this))
                // this.canvas.addEventListener("contextmenu",this.onContextmenu)
                window.addEventListener("keydown",this.onKeydown.bind(this))
                break;
            default:
                break;
        }
    }


    //画布操作的回调函数
    onMousedown(e){
        //处理handle信息
        this.handleManager.mousedownDeal(e)
        switch(this.workState){
            case "selection":
                //激活元素
                if(this.eleManager.activeElement){
                    this.eleManager.setActiveState()
                }
                if(!this.eleManager.activeElement){
                    //激活被点击元素
                    if(!this.eleManager.getActiveE()){
                        //创建选框
                    }
                }
                break;
            case "creating":
                this.eleManager.createOneElement({
                    type : this.eleManager.creatingType,
                    x: this.handleManager.mousedownInfo.x,
                    y: this.handleManager.mousedownInfo.y,
                })
                break;
            case 'readonly':
                this.handleManager.setCursor('grabbing')
                break;
        }
    }

    onMousemove(e){
        //处理handle信息
        this.handleManager.mousemoveDeal(e)

        //判断鼠标是否按下状态
        if(this.handleManager.isMousedown){
            //鼠标中键（更改坐标轴scroll）
            if(this.handleManager.mousedownInfo.button === 1 || this.workState === 'readonly'){
                this.cooManager.changeScroll({
                    offsetX:this.handleManager.mousemoveInfo.offsetX,
                    offsetY:this.handleManager.mousemoveInfo.offsetY
                })
                return
            }
            //进行元素/画布操作
            switch(this.workState){
                case 'selection':
                //选择、操作、修改元素
                        if(this.eleManager.activeElement != null){
                            this.eleManager.updatePropOfActiveE()
                        }else{
                            //进行选矿创建
                            // if(this.eleManager.marquee.mode == 'creating'){
                            //     this.eleManager.marquee.updateSize()
                            //     //将选中的元素添加进 选矿元素列表
                            //     this.eleManager.isHitToMarquee(
                            //         this.handleManager.mousemoveInfo.posX,
                            //         this.handleManager.mousemoveInfo.posY
                            //     )
                            // }
                        }
                    break
                //判断创建元素的创建方式类别 不同元素拖拽创建不同---后面对这个进行综合--封装到元素内部
                case 'creating':
                    if(POINT_ELEMENTS.includes(this.eleManager.creatingType)){
                        this.eleManager.creatingElement.updatePoint(
                            this.eleManager.creatingElement.points.length - 1,
                            this.handleManager.mousemoveInfo.posX,
                            this.handleManager.mousemoveInfo.posY
                        ) 
                    }else if(BASE_ELEMENTS.includes(this.eleManager.creatingType)){
                        this.eleManager.creatingElement.updateSize(
                            this.handleManager.mousemoveInfo.offsetX,
                            this.handleManager.mousemoveInfo.offsetY
                        )
                    }
                    break
            }
        }else{
            //判断是否触摸到元素
            // if(this.workState === 'selection'){
                // this.eleManager.checkElementsIsTouched(x,y)
            // }
        }
        this.render()
    }

    onMouseup(e){
        //处理handle信息
        this.handleManager.mouseupDeal(e)
        switch(this.workState){
            case "selection":
                if(this.eleManager.activeElement){
                    this.eleManager.activeState = null
                }
                // 完成选区创建
                // if(this.eleManager.marquee.mode == 'creating'){
                //     if(this.eleManager.marquee.selectedList.length != 0){
                //         this.eleManager.marquee.setMode('formed')
                //         this.eleManager.activeElement = this.eleManager.marquee
                //     }else{
                //         this.eleManager.marquee.setMode('shutoff')
                //     }
                // }else{

                // }
                break;
            case "readonly":
                this.handleManager.setCursor('grab')
                break;
            case "creating":
                console.log("creatingfinish")
                //一次鼠标点击 一个元素创建完毕
                this.eleManager.creatingFinish()
        }
    }

    onMousewheel(e){
        if(this.workState === 'readonly' || e.ctrlKey){
            this.cooManager.changeScale({
                offset: e.deltaY/100 * this.cooManager.scaleStep
            })
        }
        if(e.shiftKey){
            this.cooManager.changeRotate({
                offset: e.deltaY/100 * this.cooManager.rotateStep
            })
        }
    }

    onDbclick(e){
        console.log(this.eleManager.activeElement.type)
        //双击必然先单击 检查激活元素是否为文本元素
        if(this.eleManager.activeElement.type === 'text' || this.eleManager.activeElement.type === 'note'){
            console.log("dsfasd")
            this.eleManager.textEdit.startEdit(this.eleManager.activeElement)
        }
        this.render()
    }

    onKeydown(e){
        //如何自动配置快捷键
        if(e.key === 'Delete'){
            this.eleManager.deleteOneElement(this.eleManager.activeElement)
            this.eleManager.activeElement = null
            this.emit("activeEChange",this.activeElement)
        }else if(e.key === 'f' && this.eleManager.activeElement != null){
            //聚焦
            this.cooManager.changeScroll({
                scrollX: -(this.eleManager.activeElement.x+this.eleManager.activeElement.width/2),
                scrollY: -(this.eleManager.activeElement.y+this.eleManager.activeElement.height/2)
            })
            this.cooManager.changeScale({
                scale: 1
            })
        }
        this.render()
    }
    

    //画布画布渲染
    render() {
        this.ctx.save()
        this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight) // 清除画布
        drawBackground(this.ctx,0, 0, this.containerWidth, this.containerHeight,this.style.backgroundColor) //绘制背景
        this.cooManager.render()   //渲染坐标轴网格 处理画布坐标
        
        // 渲染所有元素
        this.eleManager.elementList.forEach(element => {
            element.render()
        })
        //渲染正在创建中元素
        if(this.eleManager.creatingElement){
            this.eleManager.creatingElement.render()
        }
        //渲染触碰元素

        //渲染激活元素的操作框
        if(this.eleManager.activeElement){
            this.eleManager.activeElement.renderFramework()
        }

        //渲染选框
        // this.eleManager.marquee.render()
        this.ctx.restore()
    }
    switchGrid(){
        this.cooManager.gridRender = !this.cooManager.gridRender;
        this.render()
    }
    setBackgroundColor(color){
        this.style.backgroundColor = color;
        console.log(this.style.backgroundColor)
        this.render()
    }
    //白板操作
    setWorkState(type,opts = {}){
        //清空创建元素
        this.eleManager.creatingType = null
        this.eleManager.creatingElement = null
        this.eleManager.activeElement = null
        this.emit("activeEChange",this.activeElement)        
        this.render()
        //...清空其他的一些参数
        this.workState = type
        if(type === 'readonly'){
            this.handleManager.setCursor('grab')
        }else if(type ==='creating'){
            this.handleManager.setCursor('crosshair')
            this.eleManager.creatingType = opts.creatingType
        }else if(type === 'selection'){
            this.handleManager.setCursor('default')
        }
        //设置手柄图标
        this.emit('workStateChange',type)
    }

    //生成当前项目数据-JSON格式
    exportDataJSON() {
        return JSON.stringify({
            elements: this.eleManager.serialize(),
            // state: {
            // ...this.state
            // },
            theme: {
                ...this.style
            }
        }, null, 4)
    }
    //导入项目数据-JSON格式 顺序不能颠倒
    importDataJSON(jsonData){
        let obj = JSON.parse(jsonData)
        //主题生成（样式赋值）
        Object.keys(obj.theme).forEach(key => {
            if(obj.theme[key]  && obj.theme[key] != ''){
                this.style[key] = obj.theme[key]
            }
        })
        //状态形成
        // Object.keys(obj.state).forEach(key => {
        //     if (this.style[key] === '') {
            //   if(
            //   ){
            //     this.style[key] = this.app.style[key]
            //   }
        //     }
        // })
        //元素生成
        this.eleManager.createElementsFromData(obj.elements)
    }

    exportFile(filename){
        console.log(filename)
        let a = document.createElement('a'); 
        a.style = 'display: none'; // 创建一个隐藏的a标签
        a.download = filename+'.json';
        a.href = URL.createObjectURL(new Blob([this.exportDataJSON()]));
        document.body.appendChild(a);
        a.click(); // 触发a标签的click事件
        document.body.removeChild(a);
    }
    importFile(){
        let el = document.createElement('input')
        el.type = 'file'
        el.accept = 'application/json'
        el.addEventListener('input', () => {
          let reader = new FileReader()
          reader.onload = () => {
            el.value = null
            if (reader.result) {
                //
                this.importDataJSON(reader.result)
                //
            }
          }
          reader.readAsText(el.files[0])
        })
        el.click()
    }
    exportPicture(filname){

    }
}
export default WorkBoard