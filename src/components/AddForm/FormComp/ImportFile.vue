<template>
  <div class="clearfix" style="float: right;margin-right: 10px">
    <a-button @click="showModal">导入</a-button>
    <a-modal ref="modalRef" v-model:open="addFormStore.openInsert" :wrap-style="{ overflow: 'hidden' }" @ok="handleOk">
      <a-upload
          :file-list="fileList"
          :maxCount="1"
          :before-upload="beforeUpload"
          :multiple="false"
          @remove="handleRemove">
        <a-button>
          <upload-outlined></upload-outlined>
          请选择上传文件
        </a-button>
      </a-upload>
      <a-button
          type="primary"
          :disabled="fileList!.length === 0"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
          v-if="uploadResult.length===0"
      >
        {{ uploading ? '上传中' : '开始上传' }}
      </a-button>
      <div v-if="uploadResult.length" style="margin: 16px auto;font-size: 16px">读取到<span style="color: red">{{` ${uploadResult.length} `}}</span>条数据</div>
<!--      <a-button-->
<!--          v-if="uploadResult.length"-->
<!--          type="primary"-->
<!--          :disabled="drawerStore.uploadProgress===100"-->
<!--          @click="startImport"-->
<!--      >-->
<!--        开始导入-->
<!--      </a-button>-->
      <div v-if="drawerStore.uploadProgress">
        <a-progress style="width: 300px" v-if="drawerStore.uploadProgress < 100" :percent="drawerStore.uploadProgress" status="active" />
        <a-progress style="width: 300px" v-if="drawerStore.uploadProgress === 100" :percent="drawerStore.uploadProgress" status="success" />
      </div>

      <ul v-if="drawerStore.uploadProgress===100">
        <li>成功导入<span style="color: red">{{` ${uploadResult.length - repeatImport.length} `}}</span>条数据，<span style="color: red">{{` ${repeatImport.length} `}}</span>条重复数据。<span v-if="repeatImport.length">订单编号如下：</span></li>
        <template v-if="repeatImport.length" class="repeat-data">
          <li v-for="(id,index) in repeatImport" :key="index">
            {{id}}
          </li>
        </template>
      </ul>
      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move;">文件导入</div>
      </template>
      <template #modalRender="{ originVNode }">
        <div :style="transformStyle">
          <component :is="originVNode" />
        </div>
      </template>
      <br>
       </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, CSSProperties, watch, watchEffect, onActivated} from 'vue';
import { useDraggable } from '@vueuse/core';

import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import {addOrderCar, uploadFile} from "@/request/api";
import {useDrawerStore} from "@/stores/drawer";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();
const drawerStore = useDrawerStore();

const modalTitleRef = ref<HTMLElement>(null);

const uploadResult = ref<[]>([]);

const repeatImport = ref<[]>([]);
const showModal = () => {
  fileList.value = [];
  repeatImport.value = [];
  uploadResult.value = [];
  addFormStore.openInsert = true;
};
const { x, y, isDragging } = useDraggable(modalTitleRef);
const handleOk = (e: MouseEvent) => {
  console.log(e);
  addFormStore.openInsert = false;
};
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });

watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});

watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
        preTransformX.value +
        Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
        startX.value;
    transformY.value =
        preTransformY.value +
        Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
        startY.value;
  }
});
const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});

const fileList = ref<UploadProps['fileList']>([]);

const uploading = ref<boolean>(false);
const handleRemove: UploadProps['onRemove'] = file => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  uploadResult.value = [];
  repeatImport.value = [];
  drawerStore.uploadProgress = 0;
  return false;
};

const handleUpload = async () => {
  const formData = new FormData();
  if(fileList?.value?.length === 0){
    message.error('请选择上传文件');
    fileList.value = [];
    return false;
  }
  if(fileList?.value[0].name.split('.')[1].indexOf('xls')===-1){
    message.error('请上传.xlsx或.xls格式的文件')
    fileList.value = [];
    return false;
  }
  formData.append('file',fileList?.value![0])
  uploading.value = true;
  try{
    let res = await uploadFile(formData)
    if(res.data.code === 200){
      fileList.value = [];
      uploadResult.value = res.data.data;
      await startImport();
    }
  }catch(err:any){
    uploading.value = false;
    message.error(err.response.data.msg);
  }
};

const addRecord = async (data:any[]) => {
  drawerStore.uploadProgress = 0;
  let uploadFinishCount = 0;
  let uploadSuccessCount = 0;
  for (const item of data) {
    try{
      let res = await addOrderCar(item);
      if(res.data.code === 200){
        uploadSuccessCount++;
      }
    }catch (err:any){
      repeatImport.value.push(`第${data.indexOf(item)+1}条记录：${item!.orderId}`);
    }finally {
      uploadFinishCount++;
      drawerStore.uploadProgress = Math.floor(((uploadFinishCount) * 100) / data.length);
    }
  }
    return uploadSuccessCount ? Promise.resolve({
      code:200,
      message:`导入成功，共导入${uploadSuccessCount}条数据`
    }) : Promise.resolve({
      code:201,
      message:`数据均已存在，请勿重复导入`
    })
}

const startImport = async () => {
  await addRecord(uploadResult.value).then(res=>{
    uploading.value = false;
    if(res.code === 200){
      message.success(res.message);
    }else if(res.code === 201){
      message.warning(res.message);
    }
  }).catch(err=>{
    message.error('导入失败')
  })
}

watch(()=>addFormStore.openInsert,()=>{
  drawerStore.uploadProgress = 0;
})


</script>

<style scoped>
.repeat-data{
  height: 100px;
  overflow: auto;
  font-size: 16px;
}
</style>