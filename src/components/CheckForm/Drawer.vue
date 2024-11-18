<template>
  <a-drawer
      v-model:open="drawerStore.open"
      class="custom-class"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      style="color: red;"
      width="650"
      title="生产线信息查看"
      placement="right"
  >
    <a-card :loading="loadingDetail" title="公共信息">
      <a-descriptions>
        <a-descriptions-item
            v-for="item in publicInfo"
            :key="item.title"
            :label="item.title"
            :labelStyle="{fontWeight:'bold'}"
        >{{ item.value }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <br>
    <div style="border: 1px solid #f0f0f0;width: 95%;transform:scaleY(0.5);margin: 0 auto"></div>
    <br>
    <a-card :loading="loading" title="特殊信息">
      <a-descriptions>
        <a-descriptions-item :label="specialInfo!.label" :labelStyle="{fontWeight:'bold',lineHeight:'32px'}">
          <a-input style="width: 70%" v-if="showInput" v-model:value="specialInfo!.value"></a-input>
          <span style="line-height: 32px;vertical-align: middle" v-else>{{ specialInfo!.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
      <a-button type="primary" @click="save">{{showInput?'保存' : '修改' }}</a-button>
      <a-button type="default" @click="onCancel" v-if="showInput" style="margin-left: 15px">取消</a-button>
    </a-card>
  </a-drawer>
</template>
<script lang="ts" setup>
import {useDrawerStore} from "@/stores/drawer";
import {reactive, ref, watch} from 'vue';
import {getPublicDetailByKey, getPublicDetailByKeySpecial, updatePublicDetailByKeySpecial} from "@/request/api";
import {message} from "ant-design-vue";
import moment from "moment"
const drawerStore = useDrawerStore();

const loading = ref(false);

const loadingDetail = ref(false);
interface PublicInfo{
  title:string;
  value:string;
}

interface SpecialInfo{
  label:string;
  value:string;
}
const publicInfo = ref<PublicInfo[]>();

const specialInfo = ref<SpecialInfo>()

const showInput = ref<boolean>();

const specialValueTemp = ref<string>('');

const save = async ()=>{
  // 如果是按修改，先保存
  if(!showInput.value) specialValueTemp.value = specialInfo.value!.value;
  else {
    if(specialInfo.value!.label === '白车身码' && specialInfo.value!.value.length !== 3) return message.warn('白车身码必须是三位')
    if(specialInfo.value!.label === '颜色码' && specialInfo.value!.value.length !== 2) return message.warn('颜色码必须是两位')
    if(specialValueTemp.value === specialInfo.value!.value){
      message.success('您未做出修改');
      showInput.value = !showInput.value;
      return;
    }
    try{
      let res = await updatePublicDetailByKeySpecial({key:drawerStore.key,value:specialInfo.value!.value});
      if(res.data.code === 200) {
        await searchInfoDetail();
        message.success('修改成功')
      }
    }catch (err:any){
      message.error(err.response.data.msg)
      return;
    }
  }
  showInput.value = !showInput.value;
}

const searchInfoDetail = async () => {
  loadingDetail.value = true;
  let res = await getPublicDetailByKey(drawerStore.key);
  res.data.data.forEach(item=>{
    if(item.title === '操作时间'){
      item.value = moment(item.value).format('YYYY-MM-DD HH:mm:ss');
    }
  })
  publicInfo.value = res.data.data;
  loadingDetail.value = false;
}

const searchInfo = async ()=>{
  loading.value = loadingDetail.value = true;
  let res = await getPublicDetailByKey(drawerStore.key);
  res.data.data.forEach(item=>{
    if(item.title === '操作时间'){
      item.value = moment(item.value).format('YYYY-MM-DD HH:mm:ss');
    }
  })
  let res2 = await getPublicDetailByKeySpecial(drawerStore.key);
  if(res.data.code === 200 && res2.data.code === 200){
    publicInfo.value = res.data.data;
    specialInfo.value = res2.data.data[0];
    specialInfo.value.value === ''? showInput.value = true : showInput.value = false;
    loading.value = loadingDetail.value = false;
    message.success('查询成功')
  }else{
    message.error('查询失败');
  }
}

const onCancel = async ()=>{
  loading.value = true;
  showInput.value = !showInput.value;
  let res = await getPublicDetailByKeySpecial(drawerStore.key);
  if(res.data.code === 200){
    specialInfo.value = res.data.data[0];
    specialInfo.value.value === ''? showInput.value = true : showInput.value = false;
    loading.value = false;
  }

}

watch(()=>drawerStore.open, async (newVal, oldVal) => {
  if(newVal && !oldVal){
    await searchInfo();
  }
})

</script>