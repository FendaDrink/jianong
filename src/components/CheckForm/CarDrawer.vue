<template>
  <a-drawer
      v-model:open="drawerStore.open"
      class="custom-class"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      style="color: red;"
      width="650"
      title="查看"
      placement="right"
  >
    <a-card :loading="loading" title="订单车信息">
      <a-descriptions column="3">
        <a-descriptions-item
            v-for="item in publicInfo.slice(0,14)"
            :key="item.title"
            :label="item.title"
            :labelStyle="{fontWeight:'bold'}"
        >{{ item.value }}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions column="1">
        <a-descriptions-item
            v-for="item in publicInfo.slice(14,18)"
            :key="item.title"
            :label="item.title"
            :labelStyle="{fontWeight:'bold'}"
            :span="24"
        >{{ item.value?item.value:'/' }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <br>
  </a-drawer>
</template>
<script lang="ts" setup>
import {useDrawerStore} from "@/stores/drawer";
import { ref, watch} from 'vue';
import {getOrderCarByOrderId} from "@/request/api";
import {message} from "ant-design-vue";
import moment from "moment";

const drawerStore = useDrawerStore();

const loading = ref(false);

interface PublicInfo{
  title:string;
  value:string;
}

const publicInfo = ref<PublicInfo[]>();

const searchInfo = async ()=>{
  loading.value = true;
  let res = await getOrderCarByOrderId(drawerStore.orderId);
  if(res.data.code === 200){
    res.data.data.forEach((item:any)=>{
      if(item.title==='入库时间'){
        item.value = moment(item.value).format('YYYY-MM-DD');
      }
      if(item.title==='操作时间'){
        item.value = moment(item.value).format('YYYY-MM-DD HH:mm:ss');
      }
    })
    publicInfo.value = res.data.data;
    loading.value = false;
    message.success('查询成功')
  }else{
    message.error('查询失败');
  }
}

watch(()=>drawerStore.open, async (newVal, oldVal) => {
  if(newVal && !oldVal){
    await searchInfo();
  }
})

</script>