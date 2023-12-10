// 元素的四个角
export const CORNERS = {
  TOP_LEFT: 'topLeft', // 左上角
  TOP_RIGHT: 'topRight', // 右上角
  BOTTOM_RIGHT: 'bottomRight', // 右下角
  BOTTOM_LEFT: 'bottomLeft' // 左下角
}

// 拖拽元素的部位
export const DRAG_ELEMENT_PARTS = {
  BODY: 'body',
  ROTATE: 'rotate',
  TOP_LEFT_BTN: 'topLeftBtn',
  TOP_RIGHT_BTN: 'topRightBtn',
  BOTTOM_RIGHT_BTN: 'bottomRightBtn',
  BOTTOM_LEFT_BTN: 'bottomLeftBtn'
}

// 距离10像素内都认为点击到了目标(相对)
export const HIT_DISTANCE = 10

//元素类型集合
export const BASE_ELEMENTS = ['rectangle','triangle','diamond','circle']
export const POINT_ELEMENTS = ['line','arrow']
export const TEXT_ELEMENTS = ['text','note']

//样式主题
export const DEFAULT_THEAME = {

}