import { degToRad, radToDeg, getFontString, splitTextLines } from './'
import { HIT_DISTANCE } from '../constants'

// 图形绘制工具方法

// 绘制公共操作
export const drawWrap = (ctx, fn) => {
  ctx.beginPath()
  fn()
  ctx.stroke()
  ctx.fill()
}

// 绘制矩形
export const drawRect = (ctx, x, y, width, height) => {
  drawWrap(ctx, () => {
    ctx.rect(x, y, width, height)
  })
}

// 绘制菱形
export const drawDiamond = (ctx, x, y, width, height) => {
  console.log( x, y, width, height)
  drawWrap(ctx,() => {
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height / 2)
      ctx.lineTo(x + width / 2, y + height)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
    }
  )
}

// 绘制三角形
export const drawTriangle = (ctx, x, y, width, height) => {
  drawWrap(ctx,() => {
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x, y + height)
      ctx.closePath()
    }
  )
}

// 绘制圆形
export const drawCircle = (ctx, x, y, r) => {
  drawWrap(
    ctx,
    () => {
      ctx.arc(x, y, r, 0, 2 * Math.PI)
    }
  )
}

// 绘制折线
export const drawLine = (ctx, points) => {
  drawWrap(ctx, () => {
    let first = true
    points.forEach(point => {
      if (first) {
        first = false
        ctx.moveTo(point[0], point[1])
      } else {
        ctx.lineTo(point[0], point[1])
      }
    })
  })
}

// 绘制箭头
export const drawArrow = (ctx, points) => {
  //绘制线段部分
  drawLine(ctx,points)
  //绘制箭头部分
  let len = 30
  let deg = 30

  let length = points.length
  let lastx = points[length-1][0]
  let lasty = points[length-1][1]
  let lineDeg = radToDeg(Math.atan2(lasty - points[length-2][1], lastx - points[length-2][0]))
  drawWrap(ctx,() => {
      let plusDeg = deg - lineDeg
      let _x = lastx - len * Math.cos(degToRad(plusDeg))
      let _y = lasty + len * Math.sin(degToRad(plusDeg))
      ctx.moveTo(_x, _y)
      ctx.lineTo(lastx, lasty)
  })
  drawWrap(ctx, () => {
    let plusDeg = 90 - lineDeg - deg
    let _x = lastx - len * Math.sin(degToRad(plusDeg))
    let _y = lasty - len * Math.cos(degToRad(plusDeg))
    ctx.moveTo(_x, _y)
    ctx.lineTo(lastx, lasty)
  })
}

// 转换自由线段的点
const transformFreeLinePoint = (point, opt) => {
  // 屏幕坐标在左上角，画布坐标在中心，所以屏幕坐标要先转成画布坐标
  let { x, y } = opt.app.coordinate.transform(point[0], point[1])
  // 绘制前原点又由屏幕中心移动到了元素中心，所以还需要再转一次
  return [x - opt.cx, y - opt.cy, ...point.slice(2)]
}

// 绘制自由线段
export const drawFreeLine = (ctx, points, opt) => {
  for (let i = 0; i < points.length - 1; i++) {
    drawWrap(
      ctx,
      () => {
        // 在这里转换可以减少一次额外的遍历
        let point = transformFreeLinePoint(points[i], opt)
        let nextPoint = transformFreeLinePoint(points[i + 1], opt)
        drawLineSegment(
          ctx,
          point[0],
          point[1],
          nextPoint[0],
          nextPoint[1],
          nextPoint[2],
          true
        )
      },
      true
    )
  }
}

// 绘制线段
export const drawLineSegment = (ctx, mx, my, tx, ty, lineWidth = 0) => {
  drawWrap(ctx, () => {
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth
    }
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  })
}

// 绘制文字
export const drawText = (ctx, textObj, x, y, width, height) => {
  let { text, style } = textObj
  let lineHeight = style.fontSize * style.lineHeightRatio
  drawWrap(ctx, () => {
    ctx.font = getFontString(style.fontSize, style.fontFamily)
    ctx.textBaseline = 'top'
    let textArr = splitTextLines(text)
    textArr.forEach((textRow, index) => {
      ctx.fillText(textRow, x, y + (index * lineHeight + lineHeight / 4))
    })
  })
  // drawRect(ctx, x, y, width, height)   //测试 点击边框
}

// 绘制便签
export const drawNote = (ctx, textObj, x, y, width, height) => {
  let { text, style } = textObj
  let lineHeight = style.fontSize * style.lineHeightRatio

  drawWrap(ctx, () => {
    ctx.font = getFontString(style.fontSize, style.fontFamily)
    ctx.textBaseline = 'middle'
    let textArr = splitTextLines(text)
    textArr.forEach((textRow, index) => {
      ctx.fillText(textRow, x, y + (index * lineHeight + lineHeight / 2))
    })
  })
}

// 绘制图片
export const drawImage = (ctx, imgData, x, y, width, height) => {
  drawWrap(ctx, () => {
    ctx.rect(x, y, width, height)
    ctx.drawImage(imgData, x, y, width, height)
  })
}



//辅助图形绘制：
//操作边框（resize）
export const drawFrame = (ctx, x, y, width, height,scale) => {
  let sdistance = parseInt(HIT_DISTANCE/2/scale)  //半个点击距离（屏幕像素点）
  drawWrap(ctx, () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = 'transparent'
    ctx.setLineDash([4/scale, 4/scale]); //4个屏幕像素点
    ctx.rect(x-sdistance, y-sdistance, width+2*sdistance, height+2*sdistance)
  })

  // drawWrap(ctx, () => {
  //   ctx.setLineDash([0, 0]);
    // ctx.rect(x-sdistance-sdistance, y-sdistance-sdistance, sdistance, sdistance)
    // ctx.rect(width+x+sdistance, y-sdistance-sdistance, sdistance, sdistance)
    // ctx.rect(x-sdistance-sdistance, height+y+sdistance, sdistance, sdistance)
    // ctx.rect(width+x+sdistance, height+y+sdistance, sdistance, sdistance)
  // }) 
  ctx.setLineDash([0, 0]);

  drawWrap(ctx, () => {
    ctx.lineWidth = 3
    ctx.fillStyle = '#ffffff'
    ctx.arc(x-sdistance,y-sdistance,sdistance,0,2*Math.PI);
  })

  drawWrap(ctx, () => {
    ctx.lineWidth = 3
    ctx.fillStyle = '#ffffff'
    ctx.arc(width+x+sdistance,y-sdistance,sdistance,0,2*Math.PI);
  })

  drawWrap(ctx, () => {
    ctx.lineWidth = 3
    ctx.fillStyle = '#ffffff'
    ctx.arc(x-sdistance,height+y+sdistance,sdistance,0,2*Math.PI);
  })

  drawWrap(ctx, () => {
    ctx.lineWidth = 3
    ctx.fillStyle = '#ffffff'
    ctx.arc(width+x+sdistance,height+y+sdistance,sdistance,0,2*Math.PI);
  })

  drawWrap(ctx, () => {
    ctx.lineWidth = 1
    ctx. strokeStyle = '#000000'
    ctx.fillStyle = 'transparent'
    ctx.arc(width+x+6*sdistance,y-2*sdistance,1.3*sdistance,Math.PI,0.75*Math.PI);
    ctx.arc(width+x+6*sdistance,y-1.5*sdistance,0*sdistance,Math.PI,0.75*Math.PI);
  }) 
}

export const drawPointsFrame = (ctx, points,scale) => {
  let sdistance = parseInt(HIT_DISTANCE/2 / scale) 
  points.forEach((point) => {
    drawWrap(ctx, () => {
      ctx.lineWidth = 3
      ctx.fillStyle = '#ffffff'
      ctx.arc(point[0],point[1],sdistance,0,2*Math.PI);
    })
  })
  
}

//
export const drawGrid = (ctx,x,y,width,height,distance,stroke)  => {
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = '#eeee'
  ctx.lineWidth = stroke

  ctx.arc(0,0,5,0,2*Math.PI);
  ctx.fill()
  for(let i =0;i<(y+height/2);i+=distance){
    ctx.moveTo(x-width/2 , i)
    ctx.lineTo(x+width/2, i)
  }
  for(let i =0;i>(y-height/2);i-=distance){
    ctx.moveTo(x-width/2 , i)
    ctx.lineTo(x+width/2, i)
  }
  for(let i =0;i<x+width/2;i+=distance){
    ctx.moveTo(i, y-height/2)
    ctx.lineTo(i,  y+height/2)
  }
  for(let i =0;i>x-width/2;i-=distance){
    ctx.moveTo(i,  y-height/2)
    ctx.lineTo(i,  y+height/2)
  }

  // this.ctx.moveTo(-this.containerWidth/2 , -100)
  // this.ctx.lineTo(this.containerWidth/2, -100)

  // this.ctx.moveTo(-this.containerWidth/2 , -200)
  // this.ctx.lineTo(this.containerWidth/2, -200)
  ctx.stroke()
  ctx.restore()
}


export const drawBackground = (ctx,x,y,width,height,color)  => {
  ctx.save()
  ctx.fillStyle = color
  ctx.fillRect(ctx,x,y,width,height)
  ctx.restore() 
}

export const drawNoteBG = (ctx,x,y,width,height,color)  => {
  ctx.save()
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.strokeStyle = "transparent"
  ctx.shadowBlur = 5
  ctx.shadowColor = "rgba(0,0,0,0.2)"
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 5
  drawRect(ctx,x,y,width,height)
  ctx.restore() 
}


