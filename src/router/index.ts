import { createRouter, createWebHistory } from 'vue-router'
import {getToken} from "@/request/auth";
import {message} from "ant-design-vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/basic/productInfo',
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
          // 基本信息
          path:'/basic',
          name:'basic',
          children:[
              {
                path:'productInfo',
                name:'BasicProductInfo',
                component:()=>import('@/views/Basic/ProductInfo/index.vue')
              },
            {
              path:'inventoryInfo',
              name:'BasicInventoryInfo',
              component:()=>import('@/views/Basic/InventoryInfo/index.vue')
            },
            {
              path:'institute',
              name:'BasicInstitute',
              component:()=>import('@/views/Basic/Institution/index.vue')
            },
            {
              path:'farmerInfo',
              name:'BasicFarmerInfo',
              component:()=>import('@/views/Basic/FarmerInfo/index.vue')
            },
            {
              path:'customer',
              name:'BasicCustomer',
              component:()=>import('@/views/Basic/Customer/index.vue')
            },
          ]
        },
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
              path:'inventoryInfo',
              name:'EnterpriseInventoryInfo',
              component:()=>import('@/views/Enterprise/InventoryInfo/index.vue')
            },
            {
              path: 'acquisition',
              name:'acquisition',
              component:()=>import('@/views/Enterprise/Acquisition/index.vue')
            },
            {
              path:'inBound',
              name:'enterpriseInBound',
              component:()=>import('@/views/Enterprise/InOutBound/in.vue')
            },
            {
              path:'outBound',
              name:'enterpriseOutBound',
              component:()=>import('@/views/Enterprise/InOutBound/out.vue')
            },
            {
              path:'inventory',
              name:'EnterpriseInventory',
              component:()=>import('@/views/Enterprise/Inventory/index.vue')
            },
            {
              path:'inventoryStock',
              name:'EnterpriseInventoryStock',
              component:()=>import('@/views/Enterprise/InventoryStock/index.vue')
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
            },
            {
              path: 'institute',
              name: 'institute',
              component:()=>import('@/views/Enterprise/Institution/index.vue')
            },
          ]
        },
        {
          // 生产基地系统
          path:'/production',
          name:'production',
          children:[
              {
                path:'inventory',
                name:'Inventory',
                component:()=>import('@/views/Production/Inventory/index.vue')
              },
              {
                path:'inStock',
                name:'InStock',
                component:()=>import('@/views/Production/InStock/index.vue')
              },
              {
                path:'planning',
                name:'Planning',
                component:()=>import('@/views/Production/Planning/index.vue')
              },
              {
                path:'accessInProduct',
                name:'ProductionInAccessProduct',
                component:()=>import('@/views/Production/AccessProduct/in.vue')
              },
              {
                path:'accessOutProduct',
                name:'ProductionOutAccessProduct',
                component:()=>import('@/views/Production/AccessProduct/out.vue')
              },
              {
                path:'accessInInventory',
                name:'ProductionInAccessInventory',
                component:()=>import('@/views/Production/AccessInventory/in.vue')
              },
              {
                path:'accessOutInventory',
                name:'ProductionOutAccessInventory',
                component:()=>import('@/views/Production/AccessInventory/out.vue')
              },
              {
                path:'checkInventory',
                name:'ProductionCheckInventory',
                component:()=>import('@/views/Production/CheckInventory/index.vue')
              },
              {
                path:'takeStock',
                name:'ProductionTakeStock',
                component:()=>import('@/views/Production/TakeStock/index.vue')
              },
              {
                path: 'productInventory',
                name:'ProductInventory',
                component:()=>import('@/views/Production/ProductInventory/index.vue')
              },
          ]
        },
        {
          // 代购点系统
          path:'purchasing',
          name:'purchasing',
          children:[
            {
              path:'farmerInfo',
              name:'FarmerInfo',
              component:()=>import('@/views/Purchasing/FarmerInfo/index.vue')
            },
            {
              path:'accessProduct',
              name:'AccessProduct',
              component:()=>import('@/views/Purchasing/AccessProduct/index.vue')
            },
            {
              path:'acquireProduct',
              name:'AcquireProduct',
              component:()=>import('@/views/Purchasing/AcquireProduct/index.vue')
            },

            {
              path:'queryProduct',
              name:'QueryProduct',
              component:()=>import('@/views/Purchasing/QueryProduct/index.vue')
            },

            {
              path:'inventoryConsign',
              name:'InventoryConsign',
              component:()=>import('@/views/Purchasing/IventoryConsign/index.vue')
            },
            {
              path:'accessInventory',
              name:'AccessInventory',
              component:()=>import('@/views/Purchasing/AccessInventory/in.vue')
            },
              {
              path:'accessOutInventory',
              name:'AccessOutInventory',
              component:()=>import('@/views/Purchasing/AccessInventory/out.vue')
            },
            {
              path:'checkInventory',
              name:'CheckInventory',
              component:()=>import('@/views/Purchasing/CheckInventory/index.vue')
            },
            {
              path:'takeStock',
              name:'TakeStock',
              component:()=>import('@/views/Purchasing/TakeStock/index.vue')
            },
            {
              path:'project',
              name:'Project',
              component:()=>import('@/views/Purchasing/Project/index.vue')
            },

          ]

        },
        {
          // 批发中心系统
          path: '/wholesale',
          name:'wholesale',
          children:[
              {
                path:'inventory',
                name:'WholesaleInventory',
                component:()=>import('@/views/Wholesale/Inventory/index.vue')
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
