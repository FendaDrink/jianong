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
      <a-form-item label="产品名称" v-bind="validateInfos.mch">
        <a-input v-model:value="modelRef.mch" />
      </a-form-item>
      <a-form-item label="单价" v-bind="validateInfos.price">
        <a-input type="number"  v-model:value="modelRef.price" />
      </a-form-item>
      <a-form-item label="总斤数" v-bind="validateInfos.total">
        <a-input type="number"  v-model:value="modelRef.total" />
      </a-form-item>
      </a-col>
      <a-col :span="12" style="float:left;margin-left: 70px">
        <a-form-item label="经手人" v-bind="validateInfos.person">
          <a-input  v-model:value="modelRef.person" />
        </a-form-item>
        <a-form-item label="出库时间" v-bind="validateInfos.time">
          <a-date-picker v-model:value="modelRef.time" show-time/>
        </a-form-item>
        <a-form-item label="片名" v-bind="validateInfos.pianming">
          <a-input  v-model:value="modelRef.pianming" />
        </a-form-item>
        <a-form-item label="机构编号" v-bind="validateInfos.shouhuo">
          <a-input  v-model:value="modelRef.shouhuo" />
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
import {productionOutstock} from '@/request/production'
import { useAddFormStore } from "@/stores/addForm";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  chpnumber: string;
  mch: string;
  price: number | null;
  total: number | null;
  person: string;
  time: number | null;
  pianming: string;
  shouhuo: string;
}

const modelRef = reactive<ModelRef>({
  chpnumber: "",
  mch: "",
  price:null,
  total: null,
  person: "",
  time: null,
  pianming: "",
  shouhuo: "",
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
  number: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入入库单号");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
  mch: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入产品名称");
        }
        return Promise.resolve();
      },
    },
  ],
  price: [
    {
      validator: (rule: any, value: number | null) => {
        if (value === null) {
          return Promise.reject("请输入产品进价");
        }
        return Promise.resolve();
      },
    },
  ],
  total: [
    {
      validator: (rule: any, value: number | null) => {
        if (value === null) {
          return Promise.reject("请输入总斤数");
        }
        return Promise.resolve();
      },
    },
  ],
  person: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入经手人");
        }
        return Promise.resolve();
      },
    },
  ],
  time: [
    {
      validator: (rule: any, value: number) => {
        if (value === null) {
          return Promise.reject("请选择入库时间");
        }
        return Promise.resolve();
      },
    },
  ],
  pianming: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入片名");
        }
        return Promise.resolve();
      },
    },
  ],
  shouhuo: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入机构编号");
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
      let res = await productionOutstock({...toRaw(modelRef),time: modelRef.time.valueOf()});
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