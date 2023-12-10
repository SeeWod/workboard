// 通用工具方法

// 创建canvas元素
export const createCanvas = (
    width,
    height,
    opt = { noStyle: false, className: '' }
  ) => {
    let canvas = document.createElement('canvas')
    if (!opt.noStyle) {
      canvas.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
      `
    }
    if (opt.className) {
      canvas.className = opt.className
    }
    // 获取绘图上下文
    let ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    return {
      canvas,
      ctx
    }
}
// 计算两点之间的距离
export const getTowPointDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

// 计算点到直线的距离
export const getPointToLineDistance = (x, y, x1, y1, x2, y2) => {
  // 直线垂直于x轴
  if (x1 === x2) {
    return Math.abs(x - x1)
  } else {
    let B = 1
    let A, C
    A = (y1 - y2) / (x2 - x1)
    C = 0 - B * y1 - A * x1
    return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B))
  }
}

// 检查是否点击到了一条线段
export const checkIsAtSegment = (x, y, x1, y1, x2, y2, dis = 10) => {
  if (getPointToLineDistance(x, y, x1, y1, x2, y2) > dis) {
    return false
  }
  let dis1 = getTowPointDistance(x, y, x1, y1)
  let dis2 = getTowPointDistance(x, y, x2, y2)
  let dis3 = getTowPointDistance(x1, y1, x2, y2)
  let max = Math.sqrt(dis * dis + dis3 * dis3)
  if (dis1 <= max && dis2 <= max) {
    return true
  }
  return false
}
  // 节流函数
export function throttle(fn, wait = 100){
  let timer = null
  return (...args) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      // 类实例方法
      fn.call(this,...args)
      timer = null
    }, wait)
  }
}

// 弧度转角度
export const radToDeg = rad => {
  return rad * (180 / Math.PI)
}

// 角度转弧度
export const degToRad = deg => {
  return deg * (Math.PI / 180)
}


export const transformPointReverseRotate = (x, y, cx, cy, rotate) => {
  if (rotate !== 0) {
    let rp = getRotatedPoint(x, y, cx, cy, -rotate)
    x = rp.x
    y = rp.y
  }
  return {
    x,
    y
  }
}

// 根据元素是否旋转了处理鼠标坐标，如果元素旋转了，那么鼠标坐标要反向旋转回去
export const transformPointOnElement = (x, y, element) => {
  let center = getElementCenterPoint(element)
  return transformPointReverseRotate(x, y, center.x, center.y, element.rotate)
}

// 获取元素的中心点坐标
export const getElementCenterPoint = element => {
  let { x, y, width, height } = element
  return {
    x: x + width / 2,
    y: y + height / 2
  }
}

// ------------------------------------------------------元素位置判断相关--------------------------
// 判断一个坐标是否在一个矩形内
// 第三个参数可以直接传一个带有x、y、width、height的元素对象
export const checkPointIsInRectangle = (x, y, rx, ry, rw, rh) => {
  if (typeof rx === 'object') {
    let element = rx
    rx = element.x
    ry = element.y
    rw = element.width
    rh = element.height
  }
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh
}


//----------------------------------------------------------文本 相关----------------------------------------------------------
// 拼接文字字体字号字符串
export const getFontString = (fontSize, fontFamily) => {
  return `${fontSize}px ${fontFamily}`
}

// 文本切割成行
export const splitTextLines = text => {
  return text.replace(/\r\n?/g, '\n').split('\n')
}

// 计算文本的实际渲染宽度
let textCheckEl = null
export const getTextActWidth = (text, style) => {
  if (!textCheckEl) {
    textCheckEl = document.createElement('div')
    textCheckEl.style.position = 'fixed'
    textCheckEl.style.left = '-99999px'
    document.body.appendChild(textCheckEl)
  }
  let { fontSize, fontFamily } = style
  textCheckEl.innerText = text
  textCheckEl.style.fontSize = fontSize + 'px'
  textCheckEl.style.fontFamily = fontFamily
  let { width } = textCheckEl.getBoundingClientRect()
  return width
}

// 计算固定宽度内能放下所有文字的最大字号
export const getMaxFontSizeInWidth = (text, width, style) => {
  let fontSize = 12
  while (
    getTextActWidth(text, {
      ...style,
      fontSize: fontSize + 1
    }) < width
  ) {
    fontSize++
  }
  return fontSize
}

// 计算换行文本的实际宽度
export const getWrapTextActWidth = element => {
  let { text } = element
  let textArr = splitTextLines(text)
  let maxWidth = -Infinity
  textArr.forEach(textRow => {
    let width = getTextActWidth(textRow, element.style)
    if (width > maxWidth) {
      maxWidth = width
    }
  })
  return maxWidth
}

// 计算换行文本的最长一行的文字数量
export const getWrapTextMaxRowTextNumber = text => {
  let textArr = splitTextLines(text)
  let maxNumber = -Infinity
  textArr.forEach(textRow => {
    if (textRow.length > maxNumber) {
      maxNumber = textRow.length
    }
  })
  return maxNumber
}

// 计算一个文本元素的宽高
export const getTextElementSize = element => {
  let { text, style } = element
  let width = getWrapTextActWidth(element)
  const lines = Math.max(splitTextLines(text).length, 1)
  let lineHeight = style.fontSize * style.lineHeightRatio
  let height = lines * lineHeight

  return {
    width,
    height
  }
}


// 计算中心点相同的两个坐标相差的角度
export const getTowPointRotate = (cx, cy, tx, ty, fx, fy) => {
  console.log(cx, cy, tx, ty, fx, fy)
  return radToDeg(Math.atan2(ty - cy, tx - cx) - Math.atan2(fy - cy, fx - cx))
}
// 获取坐标经指定中心点旋转指定角度的坐标，顺时针还是逆时针rotate传正负即可---角度法
export const getRotatedPoint = (x, y, cx, cy, rotate) => {
  let deg = radToDeg(Math.atan2(y - cy, x - cx))
  let del = deg + rotate
  let dis = getTowPointDistance(x, y, cx, cy)
  return {
    x: Math.cos(degToRad(del)) * dis + cx,
    y: Math.sin(degToRad(del)) * dis + cy
  }
}

export const isEqualArray = (arr1,arr2)=>{
  return arr1.toString() === arr2.toString()
}
