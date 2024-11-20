<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="overflow: hidden"
  >
    <a-col :span="12" style="float: left">
      <a-form-item label="农户名称" v-bind="validateInfos.nhname">
        <a-input v-model:value="modelRef.nhname" />
      </a-form-item>
      <a-form-item label="产品名称" v-bind="validateInfos.pzhname">
        <a-input v-model:value="modelRef.pzhname" />
      </a-form-item>
    </a-col>
    <a-col :span="12" style="float:left;margin-left: 70px">
      <a-form-item label="播种面积" v-bind="validateInfos.area">
        <a-input type="number" v-model:value="modelRef.area" />
      </a-form-item>
      <a-form-item label="播种日期" v-bind="validateInfos.date">
        <a-input type="number" v-model:value="modelRef.date" />
      </a-form-item>
    </a-col>
    <template style="clear: both"></template>
    <a-col style="float: left; width: 240px; margin: 30px 250px 0 250px">
      <a-form-item>
        <a-button type="primary" @click.prevent="onSubmit">新增</a-button>
        <a-button style="margin-left: 20px" @click="resetFields">重置</a-button>
      </a-form-item>
    </a-col>
  </a-form>
</template>
    <script lang="ts" setup>
import { reactive, toRaw, watch } from "vue";
import { Form, message } from "ant-design-vue";
import { purchasingInstock } from "@/request/api";
import { useAddFormStore } from "@/stores/addForm";
import {addProductionPlan} from "@/request/enterprise";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  nhname: string;
  pzhname: string;
  area: number | null;
  date: string;
}

const modelRef = reactive<ModelRef>({
  nhname: "",
  pzhname: "",
  area: null,
  date: ""
});

const isInteger = (str: string) => {
  const num = parseInt(str, 10);
  return !Number.isNaN(num) && String(num) === str;
};

const rulesRef = reactive({
  nhname: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入农户名称");
        }
        return Promise.resolve();
      },
    },
  ],
  pzhname: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入产品名称");
        }
        return Promise.resolve();
      },
    },
  ],
  area: [
    {
      validator: (rule: any, value: number | null) => {
        if (value === null) {
          return Promise.reject("请输入播种面积");
        }
        return Promise.resolve();
      },
    },
  ],
  date: [
    {
      validator: (rule: any, value: string) => {
        if (value === null) {
          return Promise.reject("请输入播种日期");
        }
        return Promise.resolve();
      },
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => {
    // console.log(...args);
  },
});
const onSubmit = () => {
  validate()
    .then(async () => {
      let res = await addProductionPlan(toRaw(modelRef));
      if (res.data.code === 200) {
        addFormStore.open = false;
        message.success("新增成功");
      }
    })
    .catch((err) => {
      message.error(err);
    });
};
watch(
  () => addFormStore.open,
  (newVal, oldValue) => {
    if (!newVal && oldValue) {
      resetFields();
    }
  }
);
</script>