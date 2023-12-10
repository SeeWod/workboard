<template>
  <div class="container" ref="container">
    <div class="canvasBox" ref="box"></div>
    <Transition>
      <div>
        <div class="headerLeft bar bar_row" v-if="!readonly">
            <span class='btn' @click="btn"> <i class="bi bi-chevron-left"></i> </span>
            <img src='./assets/logo.png' width='30' style='padding:5px'>
            <span class='input_name' v-text="projectName" @blur="projectName=$event.target.innerHTML;" @keydown="(e)=>{if(e.key == 'enter'){e.preventDefault()}}"
            contenteditable="true"></span>
            <el-dropdown>
              <span class='btn' @click="btn"> <i class="bi bi-gear"></i> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-color-picker v-if="style" v-model="style.backgroundColor" size="large" :predefine="fillColorList"/>设置背景
                  </el-dropdown-item>

                  <el-dropdown-item @click="app.switchGrid()">开启网格</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown>
              <span class='btn' @click="btn"> <i class="bi bi-file-earmark-arrow-up"></i> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="app.importFile()">导入项目(.JSON)</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown>
              <span class='btn'> <i class="bi bi-file-earmark-arrow-down"></i> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="app.exportFile(projectName)">导出为JSON</el-dropdown-item>
                  <el-dropdown-item @click="app.exportPicture(projectName)">导出为图片</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
        </div>

        <div class="headerRight bar" v-if="!readonly">
          <!-- <span class='btn helpB'> <i class="bi bi-question-circle-fill"></i> </span> -->
          <el-popover placement="right" width="400" trigger="click">
            <template #reference>
              <span class='btn helpB'> <i class="bi bi-keyboard"></i> </span>
            </template>
            <!-- <div class="butt"><i class="bi bi-keyboard"></i> 快捷键</div>
            <div class="butt"><i class="bi bi-chat-dots"></i> 使用反馈</div>
            <div class="butt"><i class="bi bi-book"></i> 使用指南</div> -->
            <el-table
            :data="shortcuts"
            border
            style="width: 100%"
            height="500"
            >
              <el-table-column prop="name" label="功能" />
              <el-table-column prop="value" label="快捷键" />
            </el-table>
          </el-popover>
          <!-- <el-table
            :data="shortcuts"
            :span-method="arraySpanMethod"
            border
            style="width: 100%"
          >
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="value" sortable label="Amount 1" />
          </el-table> -->
        <div>

          </div>
        </div>

        <div class="propsbar bar" v-if="!readonly && activeElement">
            <i class="bi bi-grip-vertical"></i>
            <span class='btn disable-hover' v-html="eleIcons[activeElement.type]"></span>

            <span class='propsGroup'>
              <span class="separator"></span>
              <span class='btn' :style="{color:fillStyle}" v-show='!isPOINT_E'>
                <el-color-picker style='opacity:1' v-model="activeElement.style.fillStyle" size="large" :predefine="fillColorList"/>
                <i v-if="!isFillTransparent" class="bi bi-circle-fill"></i>
                <i v-else class="bi bi-x-circle" style="color: black"></i>
              </span>
              <span class='btn' :style="{color:strokeStyle}" v-show='!isTEXT_E'>
                <el-color-picker style='opacity:1' v-model="activeElement.style.strokeStyle" size="large" :predefine="fillColorList"/>
                <i v-if="!isStrokeTransparent" class="bi bi-record-circle-fill"></i> 
                <i v-else class="bi bi-x-circle" style="color: black"></i>
              </span>
            </span>

            <span class='propsGroup' v-show='isTEXT_E'>
              <span class="separator"></span>
              <el-dropdown>
                <span class='dropdown' style="background:transparent">
                  思源黑体
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item>Action 4</el-dropdown-item>
                    <el-dropdown-item>Action 5</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-dropdown>
                <span class='dropdown' style="background:transparent;min-width:40px">
                  <span>{{activeElement.style.fontSize}}</span><i class="bi bi-caret-down-fill"></i>
                </span>
                <template #dropdown>
                  <el-dropdown-menu style="width:260px">
                    <el-dropdown-item>
                      <el-slider v-model="activeElement.style.fontSize" size="small"/>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <span class="separator"></span>

              <span class='btn'>
                <el-popover
                  :width="300"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                >
                  <template #reference>
                    <i class="bi bi-text-center"></i>
                  </template>
                  <template #default>
                    <span class='btn'> <i class="bi bi-text-left"></i> </span>
                    <span class='btn'> <i class="bi bi-text-center"></i> </span>
                    <span class='btn'> <i class="bi bi-text-right"></i> </span>
                  </template>
                </el-popover> 
              </span>
              <span class='btn'> <i class="bi bi-type-bold"></i> </span>
              <span class='btn'> <i class="bi bi-type-italic"></i> </span>
            </span>

            <span class='propsGroup'>
              <span class="separator"></span>
              <el-dropdown v-show='!isTEXT_E'>
                <span class='dropdown'>
                  <span>{{lineDash}}</span><i class="bi bi-caret-down-fill"></i>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="setLineDash([0,0])">——</el-dropdown-item>
                    <el-dropdown-item @click="setLineDash([10,10])">— —</el-dropdown-item>
                    <el-dropdown-item @click="setLineDash([3,3])">- - - -</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-dropdown v-show='!isTEXT_E'>
                <span class='dropdown'>
                  <span v-text="activeElement.style.lineWidth + 'PX'"></span><i class="bi bi-caret-down-fill"></i>
                </span>
                <template #dropdown>
                  <el-dropdown-menu style="width:260px">
                    <el-dropdown-item>
                      <el-slider max=100 step=1 v-model="activeElement.style.lineWidth" size="small"/>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-dropdown placement='bottom-end'>
                <span class='dropdown'>
                  <span v-text="parseInt(activeElement.style.globalAlpha*100) + '%'"></span><i class="bi bi-caret-down-fill"></i>
                </span>
                <template #dropdown>
                  <el-dropdown-menu style="width:260px">
                    <el-dropdown-item>
                      <el-slider max=1 step=0.01 v-model="activeElement.style.globalAlpha" size="small"/>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>  
        </div>

        <div class="toolbar bar bar_column" v-if="!readonly">
          <span class='btn' @click="app.setWorkState('selection')" :class="{active:workState=='selection'}"> <i class="bi bi-cursor"></i> </span>
          <span class='btn' :key="key" v-for="(value, key) in eleIcons" @click="changeCreatingType(key)" v-html="value" :class="{active:creatingType==key}"></span>
        </div>

        <div class="footerLeft">
          <span class='no-cursor'>X:{{scroll.x}} Y:{{scroll.y}}</span>
          <span class='no-cursor'>{{scale}}%</span>
          <span class='no-cursor'>{{rotate}}</span><span style='margin:0px'><sup>o</sup></span>
        </div>

        <div class="footerRight bar">
          <span class='btn' @click='app.cooManager.changeScroll({scrollX:0,scrollY:0})'> <i class="bi bi-geo"></i> </span>
          <span class='btn' @click='app.setWorkState(readonly?"selection":"readonly")' :class="{active:workState=='readonly'}"> <i class="bi bi-eye"></i> </span>
          <span class='btn' @click='app.eleManager.deleteAllElements()'> <i class="bi bi-trash3"></i> </span>
          <span class='btn' @click='fullScreen()' ref="fullScreenB"> <i class="bi bi-fullscreen"></i> </span>
        </div>
      </div>
    </Transition>
    
  </div>
</template>

<script setup>

import { onMounted, ref , reactive, computed,watch} from 'vue'
import WorkBoard from 'workboard'
import ColorPicker from './components/ColorPicker.vue'
import {isEqualArray} from './utils'
import {
  eleIcons,
  shortcuts,
  BASE_ELEMENTS,
  POINT_ELEMENTS,
  TEXT_ELEMENTS,
  fillColorList
} from './constants.js'


import {} from './constants'
//canvas容器的DOM节点
const container = ref(null)
const box = ref(null)
let app = null
const style = ref(null)
const projectName = ref('未命名')

const workState = ref('selection')
const readonly = computed(() => workState.value === 'readonly')
const creatingType = ref(null)

const fullScreenB = ref(null)
//白板 属性
const scroll = reactive({
  x: 0,
  y: 0
})
const scale = ref(100)
const rotate = ref(100)

//元素 属性
//工作状态变化
const activeElement = ref(null)
const isPOINT_E = computed(() => {
  if(activeElement.value){
    return POINT_ELEMENTS.includes(activeElement.value.type)
  }
})
const isTEXT_E = computed(() => {
  if(activeElement.value){
    return TEXT_ELEMENTS.includes(activeElement.value.type)
  }
})
const isBASE_E = computed(() => {
  if(activeElement.value){
    return BASE_ELEMENTS.includes(activeElement.value.type)
  }
})

const fillStyle = computed(() => {
  return activeElement.value?.style.fillStyle
})
const isFillTransparent = computed(() => {
  return (activeElement.value?.style.fillStyle  === 'transparent') || (/rgba\(\d*, \d*, \d*, 0\)/.test(activeElement.value?.style.fillStyle))
})

const strokeStyle = computed(() => {
  return activeElement.value?.style.strokeStyle
})
const isStrokeTransparent = computed(() => {
  return (activeElement.value?.style.strokeStyle  === 'transparent') || (/rgba\(\d*, \d*, \d*, 0\)/.test(activeElement.value?.style.strokeStyle))
})

const lineDash = computed(() => {
  if(activeElement.value){
    if(isEqualArray(activeElement.value.style.lineDash,[0,0])){
      return '——'
    }else if(isEqualArray(activeElement.value.style.lineDash,[3,3])){
      return '- - -'
    }else if(isEqualArray(activeElement.value.style.lineDash,[10,10])){
      return '— —'
    }
  }
})

function fullScreen(){
  if(document.fullscreenElement){
    document.exitFullscreen()
    fullScreenB.value.innerHTML = '<i class="bi bi-fullscreen"></i>'
  }else{
    container.value.requestFullscreen()
    fullScreenB.value.innerHTML = '<i class="bi bi-fullscreen-exit"></i>'
  }
}
function changeCreatingType(type){
  creatingType.value = type
  app.setWorkState('creating',{creatingType:creatingType.value})
}
function setLineDash(arr){
  activeElement.value.style.lineDash = arr;
  // lineDash = 
}
//处理透明色
watch(
  fillStyle, 
  () => {
    if(fillStyle.value === null){
      //clear 为设置颜色为透明
      activeElement.value.style.fillStyle = 'transparent'
    }
  }
)
watch(
  strokeStyle, 
  () => {
    if(strokeStyle.value === null){
      //clear 为设置颜色为透明
      activeElement.value.style.strokeStyle = 'transparent'
    }
  }
)

onMounted(() => {
  //创建实例
  app = new WorkBoard({
    container: box.value
  })
  style.value = app.style

  app.on('scrollChange', (x ,y)=>{
    scroll.x = parseInt(x),
    scroll.y = parseInt(y)
  })
  app.on('rotateChange', (r)=>{
    rotate.value = r
  })
  app.on('scaleChange', (s)=>{
    scale.value = parseInt(s*100)
  })

  app.on('workStateChange', (type)=>{
    if(type != 'creating'){
      creatingType.value = null
    }
    workState.value = type
  })
  app.on('activeEChange', (ele)=>{
    activeElement.value = ele;
  })

})
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.butt{
     padding:0px 0px 0px 10px;
      font-size: 15px;
      width:115px;
      height:30px;
      line-height: 30px;
      text-align: left;
      border-radius: 5px;
}
.butt:hover{
  background:#eeee;
}
.btn{
  width:40px;
  height:40px;
  font: 20px '微软雅黑';
  line-height:40px;
  text-align: center;
  caret-color: transparent;
  outline:none;
  border:none;
}
.btn:hover{
  background:#eeee;
  border-radius: 2.5px;
}
.bar_column{
  padding:5px 5px 10px 5px;
}
.span__inner{
  border:none !important; 
  font-size: 25px !important;
}

.propsGroup{
  height:40px;
  font-size: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.dropdown{
  min-width:80px;
  height:25px;
  font: 15px '微软雅黑';
  line-height:40px;
  text-align: center;
  background:#eeee;
  outline:none;
  border-radius: 2.5px;
  display:flex;
  align-items: center;
  justify-content: center;
  margin:0px 5px;
  .no-cursor();

  span:first-child{
    height:20px;
    line-height: 20px;
    margin:0px 5px
  }
}
.no-cursor{
  caret-color: transparent;
}
.active{
  color:#409EFF;
}
.separator{
  height:25px;
  width:1px;
  border-left: 1px solid rgba(0,0,0,0.1);
  margin:0px 5px;
}
.disable-hover { pointer-events: none; }
.el-color-picker{
  position:absolute;
  opacity:0;
  border:none !important;
  border-radius: 20px !important;
}
</style>

<style lang="less" scoped>
.container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color:#000000;

  // .border{
  //     margin:0px 5px;
  //     border-left: 1px solid rgba(0,0,0,0.1);
  //     border-right: 1px solid rgba(0,0,0,0.1);
  //   }
  .bar{
    background: #ffff;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 2;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  }
  .headerLeft{
    padding:5px 15px 5px 5px;
    position: absolute;
    left: 15px;
    top: 15px;
    z-index: 2;
    display: flex;
    justify-content: flex-start;

    .input_name{
      display:flex;
      margin:0px 5px;
      padding:0px 10px;
      height:25px;
      min-width: 100px;
      outline: none;
      text-align: left;
      // border-left: 1px solid rgba(0,0,0,0.1);
      border-right: 1px solid rgba(0,0,0,0.1);
      font-size:20px;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .headerRight{
    position: absolute;
    right: 20px;
    top: 20px;
    .helpB{
      position:absolute;
      top:0px;
      right:0px;
      border:1px solid #5555;
      background:#ffff;
      border-radius: 20px;
    }
    .helpB:hover{
      background:#eeee;
    }
  }
  .toolbar {
    font-size: 50px;
    position: absolute;
    left: 20px;
    top: 100px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .propsbar {
    font-size: 25px;
    position: absolute;
    padding:5px 5px 5px 5px; 
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    display: flex;
    justify-content: flex-start;
  }
  
  .canvasBox {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .sidebar {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 250px;
    background-color: #fff;

    .elementStyle {
      padding: 10px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;

      .styleBlock {
        margin-bottom: 10px;

        .styleBlockTitle {
          color: #343a40;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .styleBlockContent {
          display: flex;

          .lineWidthItem {
            display: flex;
            width: 30px;
            height: 10px;
            align-items: center;

            .bar {
              width: 100%;
              background-color: #212529;
            }

            &.small {
              .bar {
                height: 2px;
              }
            }

            &.middle {
              .bar {
                height: 4px;
              }
            }

            &.large {
              .bar {
                height: 6px;
              }
            }
          }

          /deep/ .el-radio-group {
            .span {
              &.is-active {
                .lineWidthItem {
                  .bar {
                    background-color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .footerLeft {
    position: absolute;
    left: 10px;
    bottom: 10px;
    height: 40px;
    display: flex;
    align-items: center;

    span{
      color:rgba(0,0,0,1);
      margin:0px 0px 0px 10px;
    }
  }
  .footerRight {
    position: absolute;
    right: 20px;
    bottom: 20px;
    height: 40px;
    padding:5px 5px 5px 10px;
    display: flex;
    align-items: center;
  }
}

</style>