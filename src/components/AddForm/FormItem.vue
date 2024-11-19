<template>
  <component :is="currentComponent()"></component>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";

const { path } = useRoute();

import PublicForm from "@/components/AddForm/FormComp/PublicForm.vue";
import ColorForm from "@/components/AddForm/FormComp/ColorForm.vue";
import EngineForm from "@/components/AddForm/FormComp/EngineForm.vue";
import CarForm from "@/components/AddForm/FormComp/CarForm.vue";
import ProductInfoForm from "@/components/AddForm/FormComp/ProductInfoForm.vue"
import AddFarmerInfo from "@/components/AddForm/FormComp/addFarmerInfo.vue";
import purchasOutStock from "@/components/AddForm/FormComp/purchasOutStock.vue";
import purchasInStock from "./FormComp/purchasInStock.vue";
import InstitutionForm from "@/components/AddForm/FormComp/InstitutionForm.vue"
import { purchasingOutstock } from "@/request/api";

const currentComponent = () => {
  switch (path) {
    case "/color":
      return ColorForm;
    case "/engine":
      return EngineForm;
    case "/car":
      return CarForm;
    case "/purchasing/farmerInfo":
      return AddFarmerInfo;
    case "/purchasing/accessProduct":
      return purchasOutStock;
    case "/purchasing/acquireProduct":
      return purchasInStock;
    case "/enterprise/productInfo":
      return ProductInfoForm;
    case "/enterprise/institute":
      return InstitutionForm;
    default:
      return PublicForm;
  }
};
</script>