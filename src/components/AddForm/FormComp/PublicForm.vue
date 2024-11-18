<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol" style="overflow: hidden">
    <a-col :span="12" style="float: left">
      <a-form-item label="生产线编号" v-bind="validateInfos.code">
        <a-input v-model:value="modelRef.code" />
      </a-form-item >
      <a-form-item label="生产线名称" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" />
      </a-form-item>
      <a-form-item label="线速" v-bind="validateInfos.speed">
        <a-input type="number" v-model:value="modelRef.speed" />
      </a-form-item>
    </a-col>

    <a-col :span="12" style="float: left;margin-left: 70px">
      <a-form-item label="生产线类型" v-bind="validateInfos.type" :wrapper-col="{span:14}">
        <a-select v-model:value="modelRef.type" placeholder="请选择生产线类型">
          <a-select-option value="车身">车身</a-select-option>
          <a-select-option value="涂装">涂装</a-select-option>
          <a-select-option value="总装">总装</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="生产线班次" v-bind="validateInfos.classes">
        <a-input type="number" v-model:value="modelRef.classes" />
      </a-form-item>
      <a-form-item label="运行效率" v-bind="validateInfos.efficiency">
        <a-input type="number" v-model:value="modelRef.efficiency" />
      </a-form-item>
    </a-col>

    <a-col :span="8" style="float: left;">
      <a-form-item label="生产线分组" v-bind="validateInfos.group" :label-col="{span:10}" :wrapper-col="{span:23,offset:0}">
        <a-input type="number" v-model:value="modelRef.group"  />
      </a-form-item>
    </a-col>

    <a-col :span="8" style="float: left">
      <a-form-item label="流向代码" v-bind="validateInfos.flow" :wrapper-col="{span:12,offset:0}" >
        <a-input type="number" v-model:value="modelRef.flow"  />
      </a-form-item>
    </a-col>

    <a-col :span="8" style="float: left;margin-left: -30px">
      <a-form-item label="生产线编号简称" v-bind="validateInfos.simple" :label-col="{span:12}" :wrapper-col="{span:28,offset:0}" >
        <a-input v-model:value="modelRef.simple"  />
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
import {reactive, toRaw, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {addPublicDetail} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";

const addFormStore = useAddFormStore();

const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  code: string;
  type: string;
  name: string;
  classes: number | null;
  speed: number | null;
  efficiency: number | null;
  group: number | null;
  flow: number | null;
  simple: string;
}

const modelRef = reactive<ModelRef>({
  classes:null,
  code: "",
  efficiency: null,
  flow: null,
  group: null,
  name: "",
  simple: "",
  speed: null,
  type: ""
});

const isInteger = (str:string) => {
  const num = parseInt(str, 10);
  return !Number.isNaN(num) && String(num) === str;
}

const rulesRef = reactive({
  code: [
    {
      validator: (rule:any, value:string) => {
        if (value==='') {
          return Promise.reject('请输入生产线编号');
        }
        return Promise.resolve();
      }
    }
  ],
  name: [
    {
      validator: (rule:any, value:string) => {
        if (value==='') {
          return Promise.reject('请输入生产线名称');
        }
        return Promise.resolve();
      }
    }
  ],
  type: [
    {
      validator: (rule:any, value:string) => {
        if (value==='') {
          return Promise.reject('请选择生产线类型');
        }
        return Promise.resolve();
      },
      trigger:'blur'
    }
  ],
  classes: [
    {
      validator: (rule:any, value:string | null) => {
        if (value==='' || value===null) {
          return Promise.reject('请输入生产线班次');
        }
        if(!isInteger(value) || Number(value)<=0){
          return Promise.reject('生产线班次必须为正整数');
        }
        return Promise.resolve();
      }
    },
  ],
  speed: [
    {
      validator: (rule:any, value:string | null) => {
        if (value==='' || value===null) {
          return Promise.reject('请输入线速');
        }
        if(!isInteger(value) || Number(value)<=0){
          return Promise.reject('线速必须为正整数');
        }
        return Promise.resolve();
      }
    },
  ],
  efficiency: [
    {
      validator: (rule:any, value:string | null) => {
        if (value==='' || value===null) {
          return Promise.reject('请输入运行效率');
        }
        if(Number(value)<0 || Number(value)>1){
          return Promise.reject('运行效率必须在0-1之间');
        }
        return Promise.resolve();
      }

    },
  ],
  group: [
    {
      validator: (rule:any, value:string | null) => {
        if (value==='' || value===null) {
          return Promise.reject('请输入生产线分组');
        }
        if(!isInteger(value) || Number(value)<=0){
          return Promise.reject('生产分组必须为正整数');
        }
        return Promise.resolve();
      }
    },
  ],
  flow: [
    {
      validator: (rule:any, value:string | null) => {
        if (value==='' || value===null) {
          return Promise.reject('请输入流向代码');
        }
        if(!isInteger(value) || Number(value)<=0){
          return Promise.reject('流向代码必须为正整数');
        }
        return Promise.resolve();
      }
    },
  ],
  simple: [
    {
      validator: (rule:any, value:string) => {
        if (value==='') {
          return Promise.reject('请输入生产线编号简称');
        }
        return Promise.resolve();
      }
    },
  ]
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => {
    // console.log(...args);
  }
});
const onSubmit = () => {
  validate()
      .then(async () => {
        let res = await addPublicDetail(toRaw(modelRef));
        if (res.data.code === 200){
          addFormStore.open = false;
          message.success('新增成功');
        }
      })
      .catch(err => {
        message.error(err.response.data.msg);
      });
};
watch(()=>addFormStore.open,(newVal,oldValue)=>{
  if (!newVal && oldValue){
    resetFields();
  }
})
</script>