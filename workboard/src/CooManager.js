import {degToRad} from './utils'
import {drawGrid} from './utils/draw'

// 画板坐标 管理类(屏幕坐标 容器坐标 画布坐标)
export default class CooManager {
  constructor(app) {
    this.app = app

    this.scale =  1
    this.scroll = {x:0,y:0}
    this.scrollX = 0
    this.scrollY = 0
    this.rotate = 0

    this.scaleStep = 0.1
    this.rotateStep = 5
    this.gridRender = true
  }

  // 坐标轴移动
  changeScroll(opts = {scrollX:0,scrollY:0,offsetX,offsetY:0}) {
    if(opts.scrollX !== undefined || opts.scrollY !== undefined){
      //参数为滚动值？
      this.scroll.x =  opts.scrollX
      this.scroll.y =  opts.scrollY
    }else if(opts.offsetX !== undefined || opts.offsetY !== undefined){
      //参数为偏移量？
      this.scroll.x += opts.offsetX
      this.scroll.x += opts.offsetY
    }else{
      return
    }
    this.app.emit('scrollChange', this.scroll)
    this.app.render()
  }

  changeScale(opts = {scale:0,offset:0}) {
    if(opts.scale !== undefined){
      //设置缩放值？
      this.scale =  opts.scale
    }else if(opts.offset !== undefined){
      //参数为偏移量？
      if((this.scale - opts.offset) <= 0){
        return
      }else{
        this.scale -= opts.offset
      }
    }else{
      return
    }
    this.app.emit('scaleChange', this.scale)
    this.app.render()
  }

  changeRotate(opts = {rotate:0, offset:0}) {
    if(opts.rotate !== undefined){
      //设置旋转角度？
      this.rotate = opts.rotate
    }else if(opts.offset !== undefined){
      //参数为偏移量？
      this.rotate = (this.rotate + opts.offset + 360) % 360
    }else{
      return
    }
    this.app.emit('rotateChange', this.rotate)
    this.app.render()
  }

  // 添加水平滚动距离
  // changeScrollX(x) {
  //   return x + this.scrollX
  // }

  //屏幕位置转为白板坐标系位置
  transformOverall(x,y){
    let conp = this.windowToContainer(x, y)
    let cooP = this.containerToCoordinate(conp.x, conp.y)

    return cooP
  }

  transformOverallReverse(x,y){
    let conP = this.coordinateToContainer(x, y)
    let winP = this.containerToWindow(conP.x, conP.y)

    return winP
  }

  // 容器坐标转换成画布坐标
  containerToCoordinate(x, y) {
    //屏幕中心点
    x = x - this.app.containerWidth / 2
    y = y - this.app.containerHeight / 2
    //缩放
    x = x / this.scale
    y = y / this.scale
    //偏移
    x = x - this.scroll.x
    y = y - this.scroll.y
    
    return {
      x,
      y
    }
  }

  // 画布坐标转换成容器坐标
  coordinateToContainer(x, y) {
    //偏移
    x = x + this.scroll.x
    y = y + this.scroll.y

    //缩放
    x = x * this.scale
    y = y * this.scale

    //屏幕中心点
    x = x + this.app.containerWidth / 2
    y = y + this.app.containerHeight / 2
    
    return {
      x,
      y
    }
  } 

  // 相对窗口的坐标转换成相对容器的，用于当容器非全屏的时候
  windowToContainer(x, y) {
    return {
      x: x - this.app.containerLeft,
      y: y - this.app.containerTop
    }
  }

  //相对容器的坐标转换成相对窗口的，用于当容器非全屏的时候
  containerToWindow(x, y) {
    return {
      x: x + this.app.containerLeft,
      y: y + this.app.containerTop
    }
  }
  // }

  // 屏幕坐标在应用画布缩放后的位置


  // 屏幕坐标在反向应用画布缩放后的位置
  // reverseScale(x, y) {
  //   let { } = this.app
  //   // 屏幕坐标转画布坐标
  //   let tp = this.transformToCanvasCoordinate(x, y)
  //   let sp = this.transformToScreenCoordinate(
  //     tp.x /.scale,
  //     tp.y /.scale
  //   )
  //   return {
  //     x: sp.x,
  //     y: sp.y
  //   }
  // }
  render(){
    //处理画布的坐标轴
      //坐标系移动到画布中心
      this.app.ctx.translate(this.app.containerWidth / 2,this.app.containerHeight / 2)
      this.app.ctx.translate(this.scroll.x,this.scroll.y)
      this.app.ctx.rotate(degToRad(this.rotate))
      if(this.gridRender){
          drawGrid(this.app.ctx,-this.scroll.x,-this.scroll.y,this.app.containerWidth,this.app.containerHeight,50 +((this.scale*100)%50), 1)
      }
      this.app.ctx.scale(this.scale, this.scale)
  }

}
