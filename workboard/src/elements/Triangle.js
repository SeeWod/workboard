import BaseElement from './BaseElement'
import { drawTriangle } from '../utils/draw'
// import DragElement from './DragElement'
import {
  transformPointOnElement,
  getElementCenterPoint,
  getRotatedPoint
} from '../utils'
// import { checkIsAtTriangleEdge } from '../utils/checkHit'

// 三角形元素类
export default class Triangle extends BaseElement {
  constructor(...args) {
    super(...args)
    this.type = 'triangle'
    // 拖拽元素实例
    // this.dragElement = new DragElement(this, this.app)
  }

  // 渲染到画布
  render() {
    let { width, height } = this
    this.warpRender(({ halfWidth, halfHeight }) => {
      // 画布中心点修改了，所以元素的坐标也要相应修改
      drawTriangle(this.app.ctx, -halfWidth, -halfHeight, width, height, true)
    })
  }
}
