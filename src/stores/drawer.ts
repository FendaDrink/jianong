// 定义关于drawer的store
import {defineStore} from "pinia";
import {ref} from "vue";

export const useDrawerStore = defineStore('drawer', ()=>{
    /* 变量 */
    const open = ref<boolean>(false);
    const key = ref<string>('');
    const orderId = ref<string>('');
    const uploadProgress = ref<number>(0);
    /* 方法 */
    const changeOpen = () => {
        open.value = !open.value
    }

    const changeKey = (userKey:string) => {
        key.value = userKey;
    }
    return {open, key , orderId, uploadProgress,changeOpen , changeKey}
})
