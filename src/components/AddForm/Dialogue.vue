<template>
  <a-button
    type="primary"
    @click="showModal"
    style="float: right; margin-right: 30px"
    >新增</a-button
  >
  <a-modal
    ref="modalRef"
    v-model:open="addFormStore.open"
    :wrap-style="{ overflow: 'hidden' }"
    :footer="null"
    @ok="handleOk"
    cancel-text="取消"
    ok-text="提交"
  >
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">
        {{ title }}
      </div>
    </template>
    <AddForm />
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import AddForm from '@/components/AddForm/FormItem.vue'
import { ref, computed, CSSProperties, watch, watchEffect } from 'vue';
import { useDraggable } from '@vueuse/core';
import {useRoute} from "vue-router";
import {useAddFormStore} from "@/stores/addForm";
const {path} = useRoute();
const addFormStore = useAddFormStore();
const modalTitleRef = ref<HTMLElement>(null);
const title = computed(() => {
  switch(path){
    case '/enterprise/productInfo':
      return '产品信息录入';
    case '/enterprise/institute':
      return '机构信息录入';
    case '/purchasing/farmerInfo':
      return '农户信息录入';
    case '/enterprise/inBound':
      return '物资入库'
    case '/enterprise/outBound':
      return '物资入库'
    case '/purchasing/accessProduct':
      return '代购点产品出库';
    case '/purchasing/acquireProduct':
      return '代购点产品收购'
    case '/purchasing/accessInventory':
      return '代购点物资入库'
    case '/purchasing/accessOutInventory':
      return '代购点物资出库'
    case '/wholesale/customer':
      return '顾客信息录入';
    case '/wholesale/inBound':
      return "批发中心产品入库";
    case '/wholesale/sale':
      return "批发中心产品销售录入"
    case '/wholesale/inventory':
      return "批发中心产品盘点入库"
    default:
      return '基础数据录入';
  }
});

const showModal = () => {
  addFormStore.open = true;
};
const { x, y, isDragging } = useDraggable(modalTitleRef);
const handleOk = (e: MouseEvent) => {
  addFormStore.open = false;
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
    width:'700px',
    transform: `translate(${transformX.value}px, ${path!=='/car'?transformY.value:transformY.value-50}px)`,
  };
});
</script>