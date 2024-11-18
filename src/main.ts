import 'reset-css/reset.css'
import '@/assets/base.css'
import { createApp } from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'

import router from './router'

const app = createApp(App)

// 创建pinia实例
const pinia = createPinia();

app.use(pinia)

app.use(router)

app.mount('#app')
