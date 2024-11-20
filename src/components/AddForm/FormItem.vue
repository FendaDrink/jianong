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
import InInventoryForm from "@/components/AddForm/FormComp/InInventoryForm.vue";
import OutInventoryForm from "@/components/AddForm/FormComp/OutInventoryForm.vue";
import EnterpriseInInventoryForm from "@/components/AddForm/FormComp/EnterpriseInInventoryForm.vue";
import EnterpriseOutInventoryForm from "@/components/AddForm/FormComp/EnterpriseOutInventoryForm.vue";
import PlanningForm from "@/components/AddForm/FormComp/PlanningForm.vue";
import ProductionInStock from "@/components/AddForm/FormComp/ProductionInStock.vue";
import ProductionOutStock from "@/components/AddForm/FormComp/ProductionOutStock.vue";
import ProductionInInventoryForm from "@/components/AddForm/FormComp/ProductionInInventoryForm.vue";
import ProductionOutInventoryForm from "@/components/AddForm/FormComp/ProductionOutInventoryForm.vue";
import addCustomerInfo from "@/components/AddForm/FormComp/addCustomerInfo.vue"
import addProductInfo from "@/components/AddForm/FormComp/addProductStock.vue"
import addSaleFrom from "@/components/AddForm/FormComp/addSale.vue"
import updateStock from "@/components/AddForm/FormComp/wholesaleUpdatestock.vue"
import InventoryInfoForm from "@/components/AddForm/FormComp/InventoryInfoForm.vue";

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
    case '/enterprise/inventoryInfo':
      return InventoryInfoForm;
    case "/enterprise/institute":
      return InstitutionForm;
    case '/enterprise/inBound':
      return EnterpriseInInventoryForm;
    case '/enterprise/outBound':
      return EnterpriseOutInventoryForm;
    case '/enterprise/planning':
      return PlanningForm;
    case '/production/accessInProduct':
      return ProductionInStock;
    case '/production/accessOutProduct':
      return ProductionOutStock;
    case '/production/accessInInventory':
      return ProductionInInventoryForm;
    case '/production/accessOutInventory':
      return ProductionOutInventoryForm;
    case "/purchasing/accessInventory":
      return InInventoryForm;
    case "/purchasing/accessOutInventory":
      return OutInventoryForm;
    case '/wholesale/customer':
      return addCustomerInfo;
    case '/wholesale/inBound':
      return addProductInfo;
    case '/wholesale/sale':
      return addSaleFrom;
    case 'wholesale/inventory':
      return updateStock;
    default:
      return PublicForm;
  }
};
</script>