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
import '@/Mock'

createApp(App).use(plugin).use(store).use(router).mount('#app')