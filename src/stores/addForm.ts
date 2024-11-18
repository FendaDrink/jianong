// 定义关于addForm的store
import {defineStore} from "pinia";
import {ref} from "vue";

export const useAddFormStore = defineStore('addForm', ()=>{
    const open = ref<boolean>(false);
    const openInsert = ref<boolean>(false);
    return {open,openInsert}
})
