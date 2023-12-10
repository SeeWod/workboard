import EventEmitter from 'eventemitter3'
export default class TextEdit extends EventEmitter{
    constructor(eleManager){      
        super()
        this.eleManager = eleManager
        this.textDom = document.createElement('textarea')
        this.textDom.dir = 'auto'
        this.textDom.tabIndex = 0
        // this.textDom.wrap = 'off'
        this.textDom.className = 'textInput'
        this.textDom.autofocus = "autofocus"
        this.textDom.style.top = "0px"
        this.textDom.style.left = "0px"

        Object.assign(this.textDom.style, {
            position: 'fixed',
            display: 'block',
            visibility: 'hidden',
            minHeight: '1em',
            backfaceVisibility: 'hidden',

            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: 'none',
            background: '#0000',
            overflow: 'hidden',
            // whiteSpace: 'pre'
          })

        this.textDom.addEventListener('input', this.onInput.bind(this))
        this.textDom.addEventListener('blur', this.onBlur.bind(this)) 
        document.body.appendChild(this.textDom)

        this.editElement = null
    }

    startEdit(editElement){
        //调整位置 相对屏幕坐标
        let {x,y} = this.eleManager.app.cooManager.transformOverallReverse(editElement.x, editElement.y)
        this.textDom.style.top = y + "px"
        this.textDom.style.left = x + "px"
        this.textDom.style.fontFamily = editElement.style.fontFamily
        this.textDom.style.color = editElement.style.fillStyle
        this.textDom.style.fontSize = editElement.style.fontSize+"px"
        this.textDom.style.lineHeight = (editElement.style.lineHeightRatio * editElement.style.fontSize) +"px"

        this.textDom.style.width = editElement.width + "px"
        this.textDom.style.height = editElement.height + "px"
        this.textDom.style.minWidth = "100px"
        //调整字符串
        this.editElement = editElement
        this.editElement.mode = 'editing'
        this.textDom.value = this.editElement.text
        this.textDom.style.visibility = 'visible'
        //设置一下延迟 就可以聚焦了 具体原因未知
        setTimeout(() => {
            this.textDom.focus()
        })
    }

    onInput(e){
        this.editElement.text = this.textDom.value
        this.editElement.updateSize()
        if(this.editElement.type == "text"){
            this.textDom.style.width = this.editElement.width + "px"
            this.textDom.style.height = this.editElement.height + "px"
        }
        console.log(this.textDom.style.width)
    }

    onBlur(){
        //文本元素的mode由editing转为normal
        this.editElement.mode = 'normal'
        this.emit('editFinish',this.editElement)
        this.editElement = null
        this.textDom.style.visibility = 'hidden'
        this.textDom.value = ''
    }
}