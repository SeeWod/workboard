import EventEmitter from 'eventemitter3'

export default class PictureLoader extends EventEmitter{
    constructor(){
        super()
        this.imageData = null
        this.imageBase64 = null
        this.imageDom = null
        this.imagecanvas = null
        this.size = {}
        //宽高比-调整大小宽高比不变
        this.ratio

        this.onImageSelectChange = this.onImageSelectChange.bind(this)
    }
    loadNewPicture(){
        let fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/*'
        fileInput.style.visibility = "hidden"
    
        fileInput.addEventListener('change', this.onImageSelectChange)
        fileInput.click()
    }

    async onImageSelectChange(e) {
        this.imageBase64 = await this.getImageUrl(e.target.files[0])

        let { imageObj, size, ratio } = await this.getImageSize(this.imageBase64)
        this.imageDom = imageObj
        this.size = size
        this.ratio = ratio

        let c = document.createElement("canvas");
        c.width = this.size.width
        c.height = this.size.height
        let ctx=c.getContext("2d");
        ctx.drawImage(this.imageDom,0,0,this.size.width,this.size.height);
        this.imagecanvas = c
        this.imageData = ctx.getImageData(0,0,this.size.width,this.size.height);

        this.emit('imageloaded',this.imageDom,this.imageBase64,this.ratio)
    }

    // 获取图片url
    async getImageUrl(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onload = () => {
            resolve(reader.result)
            }
            reader.onerror = () => {
            reject()
            }
            reader.readAsDataURL(file)
        })
    } 

    // 获取图片宽高
    async getImageSize(url) {
        return new Promise((resolve, reject) => {
        let img = new Image()
        // img.setAttribute('crossOrigin', 'anonymous')
        img.onload = () => {
            let width = img.width
            let height = img.height
            // 图片过大，缩小宽高
            let ratio = img.width / img.height
            resolve({
            imageObj: img,
            size: {
                width: width,
                height: height
            },
            ratio
            })
        }
        
        img.onerror = () => {
            reject()
        }
        img.src = url
        })
    }
}