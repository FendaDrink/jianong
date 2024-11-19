<template>
  <component :is="currentComponent()"></component>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";

const {path} = useRoute();


import PublicForm from "@/components/AddForm/FormComp/PublicForm.vue";
import ColorForm from "@/components/AddForm/FormComp/ColorForm.vue";
import EngineForm from "@/components/AddForm/FormComp/EngineForm.vue";
import CarForm from "@/components/AddForm/FormComp/CarForm.vue";
import ProductInfoForm from "@/components/AddForm/FormComp/ProductInfoForm.vue"
const currentComponent = () => {
  switch (path) {
    case "/color":
      return ColorForm;
    case "/engine":
      return EngineForm;
    case '/car':
      return CarForm;
    case '/enterprise/productInfo':
      return ProductInfoForm
    default:
      return PublicForm;
  }
};
</script>