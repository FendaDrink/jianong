<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="overflow: hidden"
  >
    <a-col :span="12" style="float: left">
      <a-form-item label="物资编号" v-bind="validateInfos.wznumber">
        <a-input v-model:value="modelRef.wznumber" />
      </a-form-item>
      <a-form-item label="物资名称" v-bind="validateInfos.mch">
        <a-input v-model:value="modelRef.mch" />
      </a-form-item>
      <a-form-item label="进价" v-bind="validateInfos.inprice">
        <a-input type="number" v-model:value="modelRef.inprice" />
      </a-form-item>
    </a-col>
    <a-col :span="12" style="float:left;margin-left: 70px">
       <a-form-item label="总数" v-bind="validateInfos.total">
        <a-input type="number" v-model:value="modelRef.total" />
      </a-form-item>
      <a-form-item label="入库时间" v-bind="validateInfos.time">
        <a-date-picker v-model:value="modelRef.time" show-time/>
      </a-form-item>
      <a-form-item label="机构编号" v-bind="validateInfos.jigou">
        <a-input v-model:value="modelRef.jigou" />
      </a-form-item>
    </a-col>
    <template style="clear: both"></template>
    <a-col style="float: left; width: 240px; margin: 0px 250px 0 250px">
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
import { purchasingInInventory } from "@/request/api";
import { useAddFormStore } from "@/stores/addForm";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  wznumber: string;
  mch: string;
  inprice: number | null;
  total: number | null;
  time: number | null;
  jigou: string;
}

const modelRef = reactive<ModelRef>({
  wznumber: "",
  mch: "",
  inprice: null,
  total: null,
  jigou: "",
  time: null,
});

const rulesRef = reactive({
  wznumber: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入物资编号");
        }
        return Promise.resolve();
      },
    },
  ],
  mch: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入物资名称");
        }
        return Promise.resolve();
      },
    },
  ],
  inprice: [
    {
      validator: (rule: any, value: string) => {
        if (value === null) {
          return Promise.reject("请输入进价");
        }
        return Promise.resolve();
      },
    },
  ],
  total: [
    {
      validator: (rule: any, value: string) => {
        if (value === null) {
          return Promise.reject("请输入总数");
        }
        return Promise.resolve();
      },
    },
  ],
  jigou: [
    {
      validator: (rule: any, value: string) => {
        if (value === "") {
          return Promise.reject("请输入机构编号");
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
  ]
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => {
    // console.log(...args);
  },
});
const onSubmit = () => {
  validate()
    .then(async () => {
      let res = await purchasingInInventory({...toRaw(modelRef),time: modelRef.time.valueOf()});
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