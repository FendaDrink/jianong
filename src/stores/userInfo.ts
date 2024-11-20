// 定义关于userInfo的store
import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserInfoStore = defineStore('userInfo', ()=>{
   const username = ref('');
   const isTokenExpired = ref<boolean>(false)
   const userInfo = ref<any>({})
   return {username,isTokenExpired,userInfo}
}, {
   persist: {
       enabled: true,
       strategies: [
           {
               key: 'userInfo',
               storage: localStorage,
           }
       ]
   }
})
