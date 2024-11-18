import { createRouter, createWebHistory } from 'vue-router'
import {getToken} from "@/request/auth";
import {message} from "ant-design-vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/public',
    },
    {
      path:'/',
      name:'home',
      component: ()=>import('@/views/Home.vue'),
      children:[
        {
          path:'/public',
          name:'public',
          component:()=>import('@/views/ProductionLine/MainContent.vue')
        },
        {
          path:'/color',
          name:'color',
          component:()=>import('@/views/ProductionLine/Color.vue')
        },
        {
          path:'/engine',
          name:'engine',
          component:()=>import('@/views/ProductionLine/Engine.vue')
        },
        {
          path:'/log',
          name:'log',
          component:()=>import('@/views/Log.vue')
        },
        {
          path:'/car',
          name:'car',
          component:()=>import('@/views/OrderCar/index.vue')
        },
        //   嘉农相关路由在下面
        {
          path:'/enterprise',
          name:'enterprise',
          component:()=>import('@/views/Enterprise/index.vue')
        },
        {
          path:'/production',
          name:'production',
          component:()=>import('@/views/Production/index.vue')
        },
        {
          path:'/purchasing',
          name:'purchasing',
          component:()=>import('@/views/Purchasing/index.vue')
        },
        {
          path: '/wholesale',
          name:'wholesale',
          component:()=>import('@/views/Wholesale/index.vue')
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component: ()=>import('@/views/Login/Login.vue')
    },
    {
      path:'/:pathMath(.*)*',
      component: ()=>import('@/views/404.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    next()
  }else{
    if(getToken()){
      next()
    }else{
      next('/login');
      message.error('请先登录');
    }
  }
})
export default router
