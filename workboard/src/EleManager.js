import Rectangle from './elements/Rectangle'
import Circle from './elements/Circle'
import Diamond from './elements/Diamond'
import Triangle from './elements/Triangle'
import Note from './elements/Note'
import Arrow from './elements/Arrow'
import Image from './elements/Image'
import Line from './elements/Line'
import Text from './elements/Text'
// import Marquee from './elements/Marquee'

import PictureLoader from './utils/PictureLoader'
import TextEdit from './utils/TextEdit'

import {getTowPointRotate} from './utils'
import {BASE_ELEMENTS,POINT_ELEMENTS,TEXT_ELEMENTS} from './constants'

//元素管理类
export default class EleManager {
    constructor(app) {
        this.app = app
        // 元素队列
        this.elementList = []

        // 正在创建的元素
        this.creatingType = null
        this.creatingElement = null

        //当前正在调整元素
        this.activeElement = null
        // 激活元素状态 rotating resizing moving pointMove
        this.activeState = null
        //调整前 元素属性
        this.preProps = {startX:0, startY:0, startWidth:0, startHeight:0, point:[], points:[]} //index,x,y

        //当前正在触碰元素
        // this.TouchElement = null

        // this.marquee = new Marquee()
        this.textEdit = new TextEdit(this)
        this.textEdit.on('editFinish', this.textEditFinish.bind(this))
        this.pictureLoader = new PictureLoader()
        this.pictureLoader.on('imageloaded', this.pictureIsLoad.bind(this))
    }
    //生成序列化数据(元素数组)
    serialize(){
        let data = this.elementList.map(element => {
            return element.serialize()
        })
        return data
    }
    //从序列化数据创建元素
    createElementsFromData(data) {
        //生成一个元素数组
        let elements = []

        data.forEach(item => {
        let element = null
        switch(item.type){
            case 'rectangle':
                element = new Rectangle(item,this.app);
                break;
            case 'triangle':
                element = new Triangle(item,this.app);
                break;
            case 'diamond':
                element = new Diamond(item,this.app);
                break;
            case 'circle':
                element = new Circle(item,this.app);
                break;
            case 'arrow':
                element = new Arrow(item,this.app);
                break;
            case 'line':
                element = new Line(item,this.app);
                break;
            case 'text':
                element = new Text(item,this.app);
                break;
            case 'note':
                element = new Note(item,this.app);
                break;
            case 'image':
                element = new Image(item,this.app);
        }
        elements.push(element)
        })

        //将元素数组 添加到 元素队列中去  
        //元素队列直接赋值
        // this.elementList = this.elementList.concat(elements)
        this.elementList = elements
    }
    
    createOneElement(opts = {}){
        switch(opts.type){
            case 'rectangle':
                this.creatingElement = new Rectangle(opts,this.app);
                break;
            case 'triangle':
                this.creatingElement = new Triangle(opts,this.app);
                break;
            case 'diamond':
                this.creatingElement = new Diamond(opts,this.app);
                break;
            case 'circle':
                this.creatingElement = new Circle(opts,this.app);
                break;               
            case 'arrow':
                this.creatingElement = new Arrow(
                    {points: [[opts.x,opts.y],[opts.x,opts.y]]},
                    this.app
                );
                break;
            case 'line':
                this.creatingElement = new Line(
                    {points: [[opts.x,opts.y],[opts.x,opts.y]]},
                    this.app
                );
                break;
            case 'text':
                this.creatingElement = new Text(opts,this.app);
                this.textEdit.startEdit(this.creatingElement);
                this.elementList.push(this.creatingElement)
                this.app.setWorkState('selection')
                break;
            case 'note':
                this.creatingElement = new Note(opts,this.app);
                this.textEdit.startEdit(this.creatingElement);
                this.elementList.push(this.creatingElement)
                this.app.setWorkState('selection')
                break;
            case 'image':
                //通过图片加载器的回调函数获取图像然后创建
                this.app.handleManager.isMousedown = false
                this.pictureLoader.loadNewPicture()
                break;
        }
    }

    deleteOneElement(element){
        let pos = this.elementList.indexOf(element)
        this.elementList.splice(pos,1)
    }
    //删除所有元素
    deleteAllElements(){
        this.elementList = []
        this.creatingElement = null
        this.touchElement = null
        this.activeElement = null     
        this.app.render()
    }

    //元素创建完成后
    creatingFinish(){
        if(!this.creatingElement.isExpired()){
            this.elementList.push(this.creatingElement)
        }
        this.app.setWorkState('selection')
        this.app.render()
    }
    //图片加载并创建图片元素
    pictureIsLoad(imageDom,imageBase64,ratio){
        this.creatingElement = new Image({
            x:this.app.handleManager.mousedownInfo.x,
            y:this.app.handleManager.mousedownInfo.y,
            imageDom:imageDom,
            imageBase64:imageBase64,
            ratio:ratio,
        },this.app);
        this.creatingFinish()
    }
    textEditFinish(editElement){
        if(editElement.text == ''){
            this.deleteOneElement(this.editElement)
        }
        this.app.render()
    }


    //检测点击到 元素方法类
    getActiveE(){
        for(let i = this.elementList.length-1;i>=0;i--){
            if(this.elementList[i].isHitEle(
                this.app.handleManager.mousedownInfo.x,
                this.app.handleManager.mousedownInfo.y
            )){
                this.activeElement = this.elementList[i]
                this.app.emit("activeEChange",this.activeElement)
                this.app.render()
                return true
            }
        }
        return false
    }

    setActiveState(){
        let hitPos = this.activeElement.hitWhere(this.app.handleManager.mousedownInfo.x,this.app.handleManager.mousedownInfo.y)
        if(hitPos === 'none'){
            this.activeElement = null
            this.app.emit("activeEChange",this.activeElement)
            this.app.render()
        }else{
            if(POINT_ELEMENTS.includes(this.activeElement.type)){
                if(hitPos === 'line'){
                    this.activeState = 'linesMove'
                    this.preProps.points = this.activeElement.points
                }else{
                    this.activeState = 'pointMove'
                    this.preProps.point[0] = Number(hitPos)
                    this.preProps.point[1] = this.activeElement.points[Number(hitPos)][0]
                    this.preProps.point[2] = this.activeElement.points[Number(hitPos)][1]
                }
            }else{
                Object.assign(this.preProps,{
                    startX: this.activeElement.x, 
                    startY: this.activeElement.y,
                    startWidth: this.activeElement.width, 
                    startHeight: this.activeElement.height,
                    startRotate: this.activeElement.rotate
                })
                switch(hitPos){
                    case 'inner':
                        this.activeState = 'moving'
                        break;
                    case 'left-up-corner':
                        this.activeState = 'resizing_leftUp'
                        break;
                    case 'right-up-corner':
                        this.activeState = 'resizing_rightUp'
                        break;
                    case 'left-bottom-corner':
                        this.activeState = 'resizing_leftDown'
                        break;
                    case 'right-bottom-corner':
                        this.activeState = 'resizing_rightDown'
                        break;
                    case 'left-border':
                        this.activeState = 'resizing_left'
                        break;
                    case 'right-border':
                        this.activeState = 'resizing_right'
                        break;
                    case 'top-border':
                        this.activeState = 'resizing_up'
                        break;
                    case 'bottom-border':
                        this.activeState = 'resizing_down'
                        break;
                    case 'rotating':
                        this.activeState = 'rotating'
                        break;
                }
            }
        }
    }

    clearActiveState(){
        this.activeState = null
        this.app.handleManager.setCursor('default')
    }

    //未来把对鼠标 等信息的转换也放在这里
    updatePropOfActiveE(){
        switch(this.activeState){
            case 'rotating':
                this.activeElement.updateRotate(this.preProps.startRotate -
                    getTowPointRotate(
                        this.preProps.startX + this.preProps.startWidth/2,
                        this.preProps.startY + this.preProps.startHeight/2,
                        this.app.handleManager.mousedownInfo.x,
                        this.app.handleManager.mousedownInfo.y,
                        this.app.handleManager.mousemoveInfo.posX,
                        this.app.handleManager.mousemoveInfo.posY
                    )
                )
                break; 
            case 'resizing_leftUp':
                this.activeElement.move(
                    this.preProps.startX + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startY + this.app.handleManager.mousemoveInfo.offsetY
                )
                this.activeElement.updateSize(
                    this.preProps.startWidth - this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startHeight - this.app.handleManager.mousemoveInfo.offsetY
                )                
                break;
            case 'resizing_rightUp':
                this.activeElement.move(
                    this.preProps.startX,
                    this.preProps.startY + this.app.handleManager.mousemoveInfo.offsetY
                )
                this.activeElement.updateSize(
                    this.preProps.startWidth + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startHeight - this.app.handleManager.mousemoveInfo.offsetY
                )                
                break;
            case 'resizing_leftDown':
                this.activeElement.move(
                    this.preProps.startX + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startY
                )
                this.activeElement.updateSize(
                    this.preProps.startWidth - this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startHeight + this.app.handleManager.mousemoveInfo.offsetY
                )                
                break;
            case 'resizing_rightDown':
                this.activeElement.updateSize(
                    this.preProps.startWidth + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startHeight + this.app.handleManager.mousemoveInfo.offsetY
                )                
                break;
            case 'resizing_left':
                this.activeElement.move(
                    this.preProps.startX + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startY
                )
                this.activeElement.updateSize(
                    this.preProps.startWidth - this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startHeight
                )                
                break;
            case 'resizing_right':
                this.activeElement.move(
                    this.preProps.startX,
                    this.preProps.startY
                )
                this.activeElement.updateSize(
                    this.preProps.startWidth + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startHeight
                )                
                break;
            case 'resizing_up':
                this.activeElement.move(
                    this.preProps.startX,
                    this.preProps.startY + this.app.handleManager.mousemoveInfo.offsetY
                )
                this.activeElement.updateSize(
                    this.preProps.startWidth,
                    this.preProps.startHeight - this.app.handleManager.mousemoveInfo.offsetY
                )                
                break;
            case 'resizing_down':
                this.activeElement.updateSize(
                    this.preProps.startWidth,
                    this.preProps.startHeight + this.app.handleManager.mousemoveInfo.offsetY
                )                
                break;
            case 'moving':
                this.activeElement.move(
                    this.preProps.startX + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.startY + this.app.handleManager.mousemoveInfo.offsetY
                )
                break;
            case 'pointMove':
                this.activeElement.updatePoint(
                    this.preProps.point[0],
                    this.preProps.point[1] + this.app.handleManager.mousemoveInfo.offsetX,
                    this.preProps.point[2] + this.app.handleManager.mousemoveInfo.offsetY
                )
                break
            case 'linesMove':
                this.activeElement.points = this.preProps.points
                this.activeElement.move(
                    this.app.handleManager.mousemoveInfo.offsetX,
                    this.app.handleManager.mousemoveInfo.offsetY
                )
                break
        }
    }
}