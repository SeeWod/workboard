import {
  checkIsAtSegment,
  getTowPointDistance,
  checkPointIsInRectangle
} from './'
import { HIT_DISTANCE } from '../constants'

// 检测是否点击到折线上
export const checkIsAtMultiSegment = (points, rp) => {
  let res = false
  for(let i = 0; i<points.length-1; i++){
    if (res) return
    if (checkIsAtSegment(rp.x, rp.y, ...points[i], ...points[i+1], HIT_DISTANCE)){
      res = true
    }
  }
  return res
}

// 检测是否点击到矩形边缘
export const checkIsAtRectangleEdge = (element, rp) => {
  let { x, y, width, height } = element
  let segments = [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y]
  ]
  return checkIsAtMultiSegment(segments, rp) ? element : null
}

// 检测是否点击到矩形内部
export const checkIsAtRectangleInner = (element, rp) => {
  return checkPointIsInRectangle(rp.x, rp.y, element) ? element : null
}

// 根据宽高计算圆的半径 ---放到 其他地方
export const getCircleRadius = (width, height) => {
  return Math.min(Math.abs(width), Math.abs(height)) / 2
}

// 检测是否点击到圆的边缘
export const checkIsAtCircleEdge = (element, rp) => {
  let { width, height, x, y } = element
  let radius = getCircleRadius(width, height)
  let dis = getTowPointDistance(rp.x, rp.y, x + radius, y + radius)
  let onCircle = dis >= radius - HIT_DISTANCE && dis <= radius + HIT_DISTANCE
  return onCircle ? element : null
}

// 检测是否点击到圆的内部
export const checkIsAtCircleInner = (element, rp) => {
  let { width, height, x, y } = element

  return onCircle ? element : null
}

// 检测是否点击到线段边缘
export const checkIsAtLineEdge = (element, rp) => {
  let segments = []
  let len = element.pointArr.length
  let arr = element.pointArr
  for (let i = 0; i < len - 1; i++) {
    segments.push([...arr[i], ...arr[i + 1]])
  }
  return checkIsAtMultiSegment(segments, rp) ? element : null
}

// 检测是否点击到自由线段边缘
export const checkIsAtFreedrawLineEdge = (element, rp) => {
  let res = null
  element.pointArr.forEach(point => {
    if (res) return
    let dis = getTowPointDistance(rp.x, rp.y, point[0], point[1])
    if (dis <= HIT_DISTANCE) {
      res = element
    }
  })
  return res
}

// 检测是否点击到菱形边缘
export const checkIsAtDiamondEdge = (element, rp) => {
  let { x, y, width, height } = element
  let segments = [
    [x + width / 2, y, x + width, y + height / 2],
    [x + width, y + height / 2, x + width / 2, y + height],
    [x + width / 2, y + height, x, y + height / 2],
    [x, y + height / 2, x + width / 2, y]
  ]
  return checkIsAtMultiSegment(segments, rp) ? element : null
}

// 检测是否点击到三角形边缘
export const checkIsAtTriangleEdge = (element, rp) => {
  let { x, y, width, height } = element
  let segments = [
    [x + width / 2, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x + width / 2, y]
  ]
  return checkIsAtMultiSegment(segments, rp) ? element : null
}

// 检测是否点击到箭头边缘
export const checkIsAtArrowEdge = (element, rp) => {
  let pointArr = element.pointArr
  let x = pointArr[0][0]
  let y = pointArr[0][1]
  let tx = pointArr[pointArr.length - 1][0]
  let ty = pointArr[pointArr.length - 1][1]
  let segments = [[x, y, tx, ty]]
  return checkIsAtMultiSegment(segments, rp) ? element : null
}


//激活 操作框
//判断点击到操作框的哪里
export const checkIsAtFrameWhere = (element,rp,scale) => {
  let sdistance = HIT_DISTANCE/element.app.cooManager.scale
  //判断位置 sdistance 为屏幕参考系
  if(checkPointIsInRectangle(rp.x, rp.y, element.x, element.y, element.width, element.height)){
    console.log("inner")
    return 'inner'
  }
  //top-border
  if(checkPointIsInRectangle(rp.x, rp.y, element.x, element.y-sdistance, element.width, sdistance)){
    console.log("top-border")
    return 'top-border'
  }
  //bottom-border
  if(checkPointIsInRectangle(rp.x, rp.y, element.x, element.y+element.height, element.width, sdistance)){
    console.log("bottom-border")
    return 'bottom-border'
  }
  //left-border
  if(checkPointIsInRectangle(rp.x, rp.y, element.x-sdistance, element.y, sdistance, element.height)){
    console.log('left-border')
    return 'left-border'
  }
  //right-border
  if(checkPointIsInRectangle(rp.x, rp.y, element.x+element.width, element.y, sdistance, element.height)){
    console.log('right-border')
    return 'right-border'
  }
  //left-up-corner
  if(checkPointIsInRectangle(rp.x, rp.y, element.x-sdistance, element.y-sdistance, sdistance, sdistance)){
    console.log('left-up-corner')
    return 'left-up-corner'
  }  
  //right-up-corner
  if(checkPointIsInRectangle(rp.x, rp.y, element.x+element.width, element.y-sdistance, sdistance, sdistance)){
    console.log('right-up-corner')
    return 'right-up-corner'
  }
  //left-bottom-corner
  if(checkPointIsInRectangle(rp.x, rp.y, element.x-sdistance, element.y+element.height, sdistance, sdistance)){
    console.log('left-bottom-corner')
    return 'left-bottom-corner'
  }
  //right-bottom-corner
  if(checkPointIsInRectangle(rp.x, rp.y, element.x+element.width, element.y+element.height, sdistance, sdistance)){
    console.log('right-bottom-corner')
    return 'right-bottom-corner'
  }
  if(getTowPointDistance(element.width+element.x+3*sdistance,element.y-sdistance,rp.x,rp.y) < sdistance){
    console.log("rotating")
    return 'rotating'
  }

  return 'none'
}

export const checkIsAtWherePoint = (points,rp) => {
  for(let i = 0;i<points.length;i++){
    if(getTowPointDistance(points[i][0],points[i][1],rp.x,rp.y) < HIT_DISTANCE){
      return i
    }
  }
  return 'none'
}


