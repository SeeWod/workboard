import BaseMultiPointElement from './BaseMultiPointElement'
import { drawLine } from '../utils/draw'
// import DragElement from './DragElement'
// import { transformPointOnElement } from '../utils'
// import { checkIsAtLineEdge } from '../utils/checkHit'

// 线段/折线元素类
export default class Line extends BaseMultiPointElement {
  constructor(opts = {}, app) {
    super(opts, app)
    this.type =  'line'
  }

  // 渲染到画布
  render() {
    let { points } = this
    this.warpRender(() => {
      drawLine(this.app.ctx,points)
    })
    // 激活时显示拖拽框
    // this.renderDragElement()
  }
}
