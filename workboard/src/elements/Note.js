import Text from './Text'
import { drawText, drawNoteBG } from '../utils/draw'
// import DragElement from './DragElement'
import {
  transformPointOnElement,
  splitTextLines,
  getTextElementSize
} from '../utils'
import { checkIsAtRectangleInner } from '../utils/checkHit'

// 文本元素类
export default class Note extends Text {
  constructor(opts = {}, app) {
    super(opts, app)
    this.type = 'note'

    this.width = 200
    this.height = 200
    this.text = opts.text || ''

    // this.style.fillStyle = opts.style?.fillStyle || this.app.style.strokeStyle || '#000'
    this.style.fillStyle = opts.style?.fillStyle || this.app.style.strokeStyle || '#000'
    this.style.fontSize = opts.style?.fontSize || this.app.style.fontSize || 18
    this.style.lineHeightRatio = opts.style?.lineHeightRatio || 1.5
    this.style.fontFamily = opts.style?.fontFamily || this.app.style.fontFamily || '微软雅黑, Microsoft YaHei'


    //重新渲染  
    this.mode = 'normal'
  }

  render() {
    drawNoteBG(this.app.ctx, this.x, this.y, this.width, this.height, '#ffe952')

    let { width, height } = this
    if(this.mode === 'editing'){
      return
    }else{
      console.log(this.type)
      this.warpRender(({ halfWidth, halfHeight }) => {
        // 画布中心点修改了，所以元素的坐标也要相应修改
        drawText(this.app.ctx, this, -halfWidth+10, -halfHeight+10, width, height)
      })
    }
  }

  // 渲染到画布
  updateSize(){
    let {width:w,height:h} = getTextElementSize(this)
    if(h > this.height){
      this.width = w
      this.height = h
    }
  }

}
