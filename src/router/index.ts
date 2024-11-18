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
          path:'/log',
          name:'log',
          component:()=>import('@/views/Log.vue')
        },
        //   嘉农相关路由在下面
        {
          // 公司系统
          path:'/enterprise',
          name:'enterprise',
          children:[
            {
              path:'productInfo',
              name:'EnterpriseProductInfo',
              component:()=>import('@/views/Enterprise/ProductInfo/index.vue')
            },
            {
              path: 'acquisition',
              name:'acquisition',
              component:()=>import('@/views/Enterprise/Acquisition/index.vue')
            },
            {
              path:'inOutBound',
              name:'inOutBound',
              component:()=>import('@/views/Enterprise/InOutBound/index.vue')
            },
            {
              path:'inventory',
              name:'EnterpriseInventory',
              component:()=>import('@/views/Enterprise/Inventory/index.vue')
            },
            {
              path:'sale',
              name:'EnterpriseSale',
              component:()=>import('@/views/Enterprise/Sale/index.vue')
            },
             {
              path:'planning',
              name:'EnterprisePlanning',
              component:()=>import('@/views/Enterprise/Planning/index.vue')
            }
          ]
        },
        {
          // 生产基地系统
          path:'/production',
          name:'production',
          children:[
              {
                path:'inventory',
                name:'ProductionInventory',
                component:()=>import('@/views/Production/Inventory/index.vue')
              },
              {
                path:'inStock',
                name:'ProductionInStock',
                component:()=>import('@/views/Production/InStock/index.vue')
              },
              {
                path:'planning',
                name:'ProductionPlanning',
                component:()=>import('@/views/Production/Planning/index.vue')
              }
          ]
        },
        {
          // 代购点系统
          path:'/purchasing',
          name:'purchasing',
          component:()=>import('@/views/Purchasing/index.vue')
        },
        {
          // 批发中心系统
          path: '/wholesale',
          name:'wholesale',
          children:[
              {
                path:'inventory',
                name:'WholesaleInventory',
                component:()=>import('@/views/Wholesale/Sale/index.vue')
              },
              {
                path:'inStock',
                name:'WholeSaleInStock',
                component:()=>import('@/views/Wholesale/InStock/index.vue')
              },
              {
                path:'customer',
                name:'customer',
                component:()=>import('@/views/Wholesale/Customer/index.vue')
              },
              {
                path:'inBound',
                name:'inBound',
                component:()=>import('@/views/Wholesale/InBound/index.vue')
              },
              {
                path:'sale',
                name:'WholeSalesale',
                component:()=>import('@/views/Wholesale/Sale/index.vue')
              },
              {
                path:'productInfo',
                name:'WholeSaleProductInfo',
                component:()=>import('@/views/Wholesale/ProductInfo/index.vue')
              }
          ]
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
