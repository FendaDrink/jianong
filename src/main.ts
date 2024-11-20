import 'reset-css/reset.css'
import '@/assets/base.css'
import { createApp } from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import router from './router'

const app = createApp(App)

// 创建pinia实例
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)

app.use(router)

app.mount('#app')
