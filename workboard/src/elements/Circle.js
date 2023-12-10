import BaseElement from './BaseElement'
import { drawCircle } from '../utils/draw'
// import DragElement from './DragElement'
import { transformPointOnElement } from '../utils'
import { getCircleRadius, checkIsAtCircleEdge } from '../utils/checkHit'

// 正圆元素类
export default class Circle extends BaseElement {
  constructor(...args) {
    super(...args)
    this.type = 'circle'
    this.radius = getCircleRadius(this.width, this.height);
  }

  // 渲染到画布
  render(){
    let { width, height } = this
    this.warpRender(({ halfWidth, halfHeight }) => {
      // 画布中心点修改了，所以元素的坐标也要相应修改
      drawCircle(this.app.ctx, 0, 0, getCircleRadius(width, height))
    })
  }

  //方法覆盖（不能改变宽高比）
  updateSize(width,height){
    let size = Math.max(width,height)
    this.width = size
    this.height = size
  }
}
