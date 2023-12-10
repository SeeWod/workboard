import { drawFrame } from '../utils/draw'
import { checkIsAtRectangleInner,checkIsAtFrameWhere } from '../utils/checkHit'
import { transformPointOnElement,degToRad } from '../utils'
  
  // 基础元素类
  export default class BaseElement {
    constructor(opts = {}, app) {
      this.app = app

      this.type = opts.type || ''
      this.x = opts.x || 0
      this.y = opts.y || 0
      this.width = opts.width || 0
      this.height = opts.height || 0
      this.rotate = opts.rotate || 0

      this.style = {
        //默认样式
        strokeStyle: '', // 线条颜色
        fillStyle: '', // 填充颜色
        lineWidth: '', // 线条宽度
        lineDash: '', // 线条虚线大小
        globalAlpha: '', // 透明度

        //样式覆盖
        ...(opts.style || {})
      }
      //主题样式补全
      this.initStyle()
    }

    serialize() {
      return {
        type: this.type,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        rotate: this.rotate,
        style: {
          ...this.style
        }
      }
    }
    //初始化样式为 白板主题默认样式
    initStyle() {
      Object.keys(this.style).forEach(key => {
        if (this.style[key] === '') {
          if (
            this.app.style[key] !== undefined &&
            this.app.style[key] !== null &&
            this.app.style[key] !== ''
          ){
            this.style[key] = this.app.style[key]
          }
        }
      })
    }
    // 渲染元素
    render(){
      throw new Error('子类需要实现该方法！')
    }

    //渲染激活态-操作框
    renderFramework(){
      let { width, height } = this
      this.warpRender2(({ halfWidth, halfHeight }) =>
        drawFrame(this.app.ctx, -halfWidth, -halfHeight, width, height,this.app.cooManager.scale)
      )
    }
  
    // 公共渲染操作
    warpRender(drawFn) {
      let { x, y, width, height, rotate, style } = this
      // 坐标转换-移动画布中点到元素中心，否则旋转时中心点不对
      let halfWidth = width / 2
      let halfHeight = height / 2
      let cx = x + halfWidth
      let cy = y + halfHeight
      this.app.ctx.save()
      this.setStyle(style)
      this.app.ctx.translate(cx, cy)
      if(rotate){
        this.app.ctx.rotate(degToRad(rotate))
      }
      drawFn({
        halfWidth,
        halfHeight,
        x,
        y,
        cx,
        cy
      })
      this.app.ctx.restore()
    }

    warpRender2(drawFn) {
      let { x, y, width, height, rotate, style } = this
      // 坐标转换-移动画布中点到元素中心，否则旋转时中心点不对
      let halfWidth = width / 2
      let halfHeight = height / 2
      let cx = x + halfWidth
      let cy = y + halfHeight
      this.app.ctx.save()
      this.app.ctx.translate(cx, cy)
      if(rotate){
        this.app.ctx.rotate(degToRad(rotate))
      }
      drawFn({
        halfWidth,
        halfHeight,
        x,
        y,
        cx,
        cy
      })
      this.app.ctx.restore()
      return this
    }
    // 设置绘图样式
    setStyle(_style = {}) {
      Object.keys(_style).forEach(key => {
        if(key === 'lineDash'){
            this.app.ctx.setLineDash(_style.lineDash)
        }else if(
          _style[key] !== undefined &&
          _style[key] !== '' &&
          _style[key] !== null
        ){
          this.app.ctx[key] = _style[key]
        }
      })
    }
  
    //用赋值 ，不用差值
    move(x, y) {
      this.x = x
      this.y = y
    }

    updateSize(width, height) {
      this.width = width
      this.height = height
    }
  
    updateRotate(angle) {
      angle = angle % 360
      if (angle < 0) {
        angle = 360 + angle
      }
      this.rotate = parseInt(angle)
    }
  
    // 检测是否被击中
    isHitEle(x, y) {
      let rp = transformPointOnElement(x, y, this)  
      return checkIsAtRectangleInner(this, rp)
    }

    hitWhere(x, y){
      let rp = transformPointOnElement(x, y, this)
      return checkIsAtFrameWhere(this, rp)
    }

    isExpired(){
      if(this.width == 0 && this.height == 0){
        return true
      }
      return false
    }
  }
  