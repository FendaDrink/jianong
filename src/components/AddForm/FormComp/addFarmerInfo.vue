<template>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" style="overflow: hidden">
      <a-col :span="12" style="float: left">
        <a-form-item label="农户编号" v-bind="validateInfos.number">
          <a-input v-model:value="modelRef.number" />
        </a-form-item >
        <a-form-item label="农户名称" v-bind="validateInfos.nhname">
          <a-input v-model:value="modelRef.nhname" />
        </a-form-item>
        <a-form-item label="农户地址" v-bind="validateInfos.address">
          <a-input v-model:value="modelRef.address" />
        </a-form-item >
      </a-col>
        <a-col>
        <a-form-item label="电话" v-bind="validateInfos.tel">
          <a-input v-model:value="modelRef.tel" />
        </a-form-item>
        <a-form-item label="播种面积" v-bind="validateInfos.area">
          <a-input v-model:value="modelRef.area" />
        </a-form-item>
         </a-col>
      <template style="clear: both"></template>
      <a-col style="float: left;width: 240px;margin: 30px 250px 0 250px">
        <a-form-item >
          <a-button type="primary" @click.prevent="onSubmit">新增</a-button>
          <a-button style="margin-left: 20px" @click="resetFields">重置</a-button>
        </a-form-item>
      </a-col>
    </a-form>
  </template>
  <script lang="ts" setup>
import { reactive, toRaw, watch } from "vue";
import { Form, message } from "ant-design-vue";
import { addFarmerInfo } from "@/request/api";
import { useAddFormStore } from "@/stores/addForm";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  number: number | null;
  nhname: string;
  address: string;
  tel: string;
  area: string;
}

const modelRef = reactive<ModelRef>({
  number: null,
  nhname: "",
  address: "",
  tel: '',
  area: "",
});

const isInteger = (str: string) => {
  const num = parseInt(str, 10);
  return !Number.isNaN(num) && String(num) === str;
};

const rulesRef = reactive({
  number: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入农户编号");
        }
        return Promise.resolve();
      },
    },
  ],
  农户名称: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入农户名称");
        }
        return Promise.resolve();
      },
    },
  ],
  农户地址: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入农户地址");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
  tel: [
    {
      validator: (rule: any, value: string | null) => {
        if (value === "" || value === null) {
          return Promise.reject("请输入农户电话");
        }
        const phoneRegex = /^(\+?\d{1,4}[- ]?)?\d{7,15}$/;
        if (!phoneRegex.test(value)) {
          return Promise.reject(
            "请输入有效的电话号码，例如 12345678901 或 +8612345678901"
          );
        }
        return Promise.resolve();
      },
    },
  ],

  area: [
    {
      validator: (rule: any, value: string | null) => {
        if (value === "" || value === null) {
          return Promise.reject("请输入播种面积");
        }
        if (!isInteger(value) || Number(value) <= 0) {
          return Promise.reject("面积必须为正整数");
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
      let res = await addFarmerInfo(toRaw(modelRef));
      if (res.data.code === 200) {
        addFormStore.open = false;
        message.success("新增成功");
      }
    })
    .catch((err) => {
      message.error(err.response.data.msg);
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