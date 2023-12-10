import BaseElement from './BaseElement'
import { drawDiamond } from '../utils/draw'

// 菱形元素类
export default class Diamond extends BaseElement {
  constructor(...args) {
    super(...args)
    // 拖拽元素实例
    // this.dragElement = new DragElement(this, this.app)
    this.type = 'diamond'
  }

  // 渲染到画布
  render(){
    let { width, height } = this
    this.warpRender(({ halfWidth, halfHeight }) => {
      // 画布中心点修改了，所以元素的坐标也要相应修改
      drawDiamond(this.app.ctx, -halfWidth, -halfHeight, width, height)
    })
  }

}
