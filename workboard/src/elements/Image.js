import BaseElement from './BaseElement'
import { drawImage } from '../utils/draw'
// import DragElement from './DragElement'
import { transformPointOnElement } from '../utils'
import { checkIsAtRectangleInner } from '../utils/checkHit'
import PictureLoader from '../utils/PictureLoader'

// 图片元素类
export default class Image extends BaseElement {
  constructor(opts = {}, app) {
    super(opts, app)
    this.type = 'image'
    //宽高比
    this.style.strokeStyle = 'transparent'
    this.ratio = opts.ratio || 0
    this.imageBase64 = opts.imageBase64 || 0
    this.imageData = opts.imageDom || 0
    this.height = this.app.containerHeight / 3
    this.width = this.height * this.ratio
    //调整初始位置
    this.x = this.x - this.width / 2
    this.y = this.y - this.height / 2
  }
    serialize() {
      let base = super.serialize()
      return {
        ...base,
        imageBase64: this.imageBase64,
        ratio: this.ratio
      }
    }

  //方法覆盖（不能改变宽高比）
  updateSize(width,height){
    this.width = width
    this.height = width / this.ratio
  }

  // 渲染到画布
  render() {
    let { width, height } = this
    this.warpRender(({ halfWidth, halfHeight }) => {
      drawImage(this.app.ctx, this.imageData, -halfWidth, -halfHeight, width, height)
    })
  }
}
