import { createApp } from 'vue'
import "./styles/tailwind.css"
import App from './App.vue'
import './samples/node-api'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "./styles/style.scss"
import 'highlight.js/styles/atom-one-dark.css'

const app=createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
