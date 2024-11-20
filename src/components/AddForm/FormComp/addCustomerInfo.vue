<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="overflow: hidden"
  >
    <a-col :span="12" style="float: left">
      <a-form-item label="顾客编号" v-bind="validateInfos.number">
        <a-input v-model:value="modelRef.number" />
      </a-form-item> 
      <a-form-item label="顾客名称" v-bind="validateInfos.gkname">
        <a-input v-model:value="modelRef.gkname" />
      </a-form-item>
   </a-col>
   <a-col :span="12"  style="float: left;margin-left: 70px">
      <a-form-item label="顾客地址" v-bind="validateInfos.address">
        <a-input v-model:value="modelRef.address" />
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
import { addcustomerInfo } from "@/request/api";
import { useAddFormStore } from "@/stores/addForm";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  number: string;
  gkname: string;
  address: string;
 
}

const modelRef = reactive<ModelRef>({
  number: "",
  gkname: "",
  address: "",
 
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
          return Promise.reject("请输入顾客编号");
        }
        return Promise.resolve();
      },
    },
  ],
  gkname: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入顾客名称");
        }
        return Promise.resolve();
      },
    },
  ],
  address: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入客户地址");
        }
        return Promise.resolve();
      },
      trigger: "blur",
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
      let res = await addcustomerInfo(toRaw(modelRef));
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