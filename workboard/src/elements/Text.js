import BaseElement from './BaseElement'
import { drawText } from '../utils/draw'
// import DragElement from './DragElement'
import {
  splitTextLines,
  getTextElementSize
} from '../utils'
// import { checkIsAtRectangleInner } from '../utils/checkHit'

// 文本元素类
export default class Text extends BaseElement {
  constructor(opts = {}, app) {
    super(opts, app)
    this.type = 'text'
    this.text = opts.text || ''

    this.style.fillStyle = opts.style?.fillStyle || this.app.style.strokeStyle || '#000'
    this.style.fontSize = opts.style?.fontSize || this.app.style.fontSize || 18
    this.style.lineHeightRatio = opts.style?.lineHeightRatio || 1.5
    this.style.fontFamily = opts.style?.fontFamily || this.app.style.fontFamily
    //重新渲染  

    this.mode = 'normal'
  }
  serialize() {
    let base = super.serialize()
    return {
      ...base,
      text: this.text,
    }
  }
  // 渲染到画布
  render() {
    let { width, height } = this
    if(this.mode === 'editing'){
      return
    }else{
      this.warpRender(({ halfWidth, halfHeight }) => {
        // 画布中心点修改了，所以元素的坐标也要相应修改
        drawText(this.app.ctx, this, -halfWidth, -halfHeight, width, height)
      })
    }
  }

  // 更新包围框
  // updateRect(x, y, width, height) {
  //   let { text, style } = this
  //   // 新字号 = 新高度 / 行数
  //   let fontSize = Math.floor(
  //     height / splitTextLines(text).length / style.lineHeightRatio
  //   )
  //   this.style.fontSize = fontSize
  //   super.updateRect(x, y, width, height)
  // }

  // 字号改不了更新尺寸
  // updateTextSize(){
  //   let { width, height } = getTextElementSize(this)
  //   this.width = width
  //   this.height = height
  // }

  updateSize(){
    let {width:w,height:h} = getTextElementSize(this)
    this.width = w
    this.height = h
  }

}
