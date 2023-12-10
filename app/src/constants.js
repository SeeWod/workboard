// 描边颜色
export const strokeColorList = [
  '#000000',
  '#343a40',
  '#495057',
  '#c92a2a',
  '#a61e4d',
  '#862e9c',
  '#5f3dc4',
  '#364fc7',
  '#1864ab',
  '#0b7285',
  '#087f5b',
  '#2b8a3e',
  '#5c940d',
  '#e67700',
  '#d9480f'
]

// 填充颜色 --element-plus不支持   'transparent', 必须切换到  // 'rgba(0,0,0,0)',  所以加了一个设置的
export const fillColorList = [
  '#ced4da',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14'
]

// 背景颜色
export const backgroundColorList = [
  'rgb(255, 255, 255)',
  'rgb(248, 249, 250)',
  'rgb(241, 243, 245)',
  'rgb(255, 245, 245)',
  'rgb(255, 240, 246)',
  'rgb(248, 240, 252)',
  'rgb(243, 240, 255)',
  'rgb(237, 242, 255)',
  'rgb(231, 245, 255)',
  'rgb(227, 250, 252)',
  'rgb(230, 252, 245)',
  'rgb(235, 251, 238)',
  'rgb(244, 252, 227)',
  'rgb(255, 249, 219)',
  'rgb(255, 244, 230)'
]

// 字体列表
export const fontFamilyList = [
  {
    name: '微软雅黑',
    value: '微软雅黑, Microsoft YaHei'
  },
  {
    name: '宋体',
    value: '宋体, SimSun, Songti SC'
  },
  {
    name: '楷体',
    value: '楷体, 楷体_GB2312, SimKai, STKaiti'
  },
  {
    name: '黑体',
    value: '黑体, SimHei, Heiti SC'
  },
  {
    name: '隶书',
    value: '隶书, SimLi'
  },
  {
    name: 'Andale Mono',
    value: 'andale mono'
  },
  {
    name: 'Arial',
    value: 'arial, helvetica, sans-serif'
  },
  {
    name: 'arialBlack',
    value: 'arial black, avant garde'
  },
  {
    name: 'Comic Sans Ms',
    value: 'comic sans ms'
  },
  {
    name: 'Impact',
    value: 'impact, chicago'
  },
  {
    name: 'Times New Roman',
    value: 'times new roman'
  },
  {
    name: 'Sans-Serif',
    value: 'sans-serif'
  },
  {
    name: 'serif',
    value: 'serif'
  }
]

// 字号
export const fontSizeList = [10, 12, 16, 18, 24, 32, 48].map(item => {
  return {
    name: item,
    value: item
  }
})

export const theme = {
  
}

export const eleIcons = {
  rectangle: '<i class="bi bi-square"></i>',
  diamond: '<i class="bi bi-diamond"></i>',
  triangle: '<i class="bi bi-triangle"></i>',
  circle: '<i class="bi bi-circle"></i>',
  line: '<i class="bi bi-slash-lg"></i>',
  arrow: '<i class="bi bi-arrow-up-right"></i>',
  text: '<i class="bi bi-fonts"></i>',
  image: '<i class="bi bi-card-image"></i>'
}
export const shortcuts = [
  {name:'删除元素',value:'激活元素+delete键'},
  {name:'聚焦元素',value:'激活元素+F键'},
  {name:'拖动画布',value:'🖱️中键'},
  {name:'缩放画布',value:'ctrl+🖱️滚轮'},
  {name:'缩放画布',value:'阅览模式+🖱️滚轮'},
  {name:'旋转画布',value:'shift+🖱️滚轮'},
  {name:'拖动画布',value:'阅览模式+🖱️移动'},
]

export const BASE_ELEMENTS = ['rectangle','triangle','diamond','circle']
export const POINT_ELEMENTS = ['line','arrow']
export const TEXT_ELEMENTS = ['text','note']
