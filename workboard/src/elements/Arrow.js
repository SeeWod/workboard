import BaseMultiPointElement from './BaseMultiPointElement'
import { drawArrow } from '../utils/draw'
// import { transformPointOnElement } from '../utils'
// import { checkIsAtArrowEdge } from '../utils/checkHit'

// 箭头元素类
export default class Arrow extends BaseMultiPointElement {
  constructor(...args) {
    super(...args)

    this.type =  'arrow'
    // 拖拽元素实例
    // this.dragElement = new DragElement(this, this.app)
  }

  // 渲染到画布
  render() {
    let { points } = this
    this.warpRender(() => {
      // 加上鼠标当前实时位置
      // let realtimePoint = []
      // if (pointArr.length > 0 && this.isCreating) {
      //   let { x: fx, y: fy } = this.app.cooManager.transformOverall(
      //     fictitiousPoint.x - cx,
      //     fictitiousPoint.y - cy
      //   )
      //   realtimePoint = [[fx, fy]]
      // }
      // console.log(points)
      drawArrow(
        this.app.ctx,
        points
      )
    })
    // 激活时显示拖拽框
    // this.renderDragElement()
  }
}
