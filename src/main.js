import {
    createApp
} from 'vue'
import App from './App.vue'

import router from "@/router"
import store from "@/store"

import plugin from "@/components/library"

// 样式重置库
import 'normalize.css'

// 自己公共样式库
import '@/assets/styles/common.less'

// mockjs
// import '@/Mock' //主要的原因是项目中使用mock.js，导致fs模块不能正常使用。

createApp(App).use(plugin).use(store).use(router).mount('#app')