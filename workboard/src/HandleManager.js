// import { getTowPointDistance } from './utils'
import EventEmitter from 'eventemitter3'

// 手柄 管理类
export default class HandleManager extends EventEmitter {
    constructor(app) {
      super()
      this.app = app
      
      this.isMousedown = false  //鼠标是否按下
      this.mousedownInfo = {    //鼠标按下时信息（位置、哪个键）
        x: 0,
        y: 0,
        button:0,
      }
      this.mousemoveInfo = {     //鼠标移动信息 (位置、相对鼠标按下的偏移)
        posX:0,
        posY:0,
        offsetX: 0,
        offsetY: 0,
      }
    }

    // 鼠标按下信息处理
    mousedownDeal(e) {
      let {x ,y} = this.app.cooManager.transformOverall(e.clientX, e.clientY)

      this.isMousedown = true
      this.mousedownInfo.x = x
      this.mousedownInfo.y = y
      this.mousedownInfo.button = e.button
    }
  
    // 鼠标移动信息处理
    mousemoveDeal(e) {
      let {x ,y} = this.app.cooManager.transformOverall(e.clientX, e.clientY)
      // 鼠标按下状态
      if (this.isMousedown) {
        this.mousemoveInfo.offsetX = x - this.mousedownInfo.x
        this.mousemoveInfo.offsetY = y - this.mousedownInfo.y
      }
      this.mousemoveInfo.posX = x
      this.mousemoveInfo.posY = y
    }
  
    mouseupDeal(e) {
      this.isMousedown = false
      // 复位
      this.mousedownInfo.x = 0
      this.mousedownInfo.y = 0
      this.mousemoveInfo.offsetX = 0
      this.mousemoveInfo.offsetY = 0
      this.mousemoveInfo.posX = 0
      this.mousemoveInfo.posY = 0
    }
  
    // 双击事件
    // onDblclick(e) {
    //   e = this.transformEvent(e)
    //   this.emit('dblclick', e, this)
    // }
  
    // 右键菜单事件
    // onContextmenu(e) {
    //   e.stopPropagation()
    //   e.preventDefault()
    //   e = this.transformEvent(e)
    //   this.emit('contextmenu', e, this)
    // }
  
    //处理光标样式
    //由于 图片引用位置会出错，暂不设置
    setCursor(style = 'default') {
      switch(style) {
        // case 'default':
        //   style = 'url(src/assets/selection.svg),default'
        //   break
        case 'eraser':
          style = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAARRJREFUOE/dlDFLxEAQhd+BVouFZ3vlQuwSyI+5a7PBRkk6k9KzTOwStJFsWv0xgaQzkNLWszim0kL2OOFc9oKRYHFTz37Lm/dmJhi5JiPzcBjAOYDz7WheADz3jalP8oIxds85P3Zd90RBqqpad133SUSXAJ5M4H3AhWVZd1EUzYQQP96VZYkkSV7btr02QY1Axtgqz/NTz/OM6qSUCMNwRURneoMJOLdt+7Gu643MfeU4zrppmgt9pibgjRBiWRRFb0R934eUcgngdrfxX4CjSwZj7C3Lsqnu8Lc05XQQBO9ENP2NKapnE5s4jme608rhNE2HxWb7qwr2A+f8SAv2BxFdDQ32rpLRVu9Pl+0wztcg6V/VPW4Vw1FsawAAAABJRU5ErkJggg==) 10 10, auto`
          break
      }
      this.app.canvas.style.cursor = style
    }
  }
  