import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// import 'bootstrap/dist/css/bootstrap.css'



const app = createApp(App)
app.use(ElementPlus).mount('#app')
