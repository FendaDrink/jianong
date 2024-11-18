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

const currentComponent = () => {
  switch (path) {
    case "/color":
      return ColorForm;
    case "/engine":
      return EngineForm;
    case '/car':
      return CarForm;
    default:
      return PublicForm;
  }
};
</script>