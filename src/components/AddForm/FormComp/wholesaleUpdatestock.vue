<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="overflow: hidden"
  >
    <a-col :span="12" style="float: left">
      
      <a-form-item label="产品编号" v-bind="validateInfos.chpnumber">
        <a-input v-model:value="modelRef.chpnumber" />
      </a-form-item>
      <a-form-item label="产品库存" v-bind="validateInfos.remain">
        <a-input v-model:value="modelRef.remain" />
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
import { wholesaleOutstock } from "@/request/api";
import { useAddFormStore } from "@/stores/addForm";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  
  chpnumber: string;
  remain: string;
   
}

const modelRef = reactive<ModelRef>({
  
  chpnumber: "",
  remain: "",
  
});

const isInteger = (str: string) => {
  const num = parseInt(str, 10);
  return !Number.isNaN(num) && String(num) === str;
};

const rulesRef = reactive({
   
  chpnumber: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入产品编号");
        }
        return Promise.resolve();
      },
    },
  ],
  remain: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入产品名称");
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
      let res = await wholesaleOutstock(toRaw(modelRef));
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