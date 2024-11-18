<template>
  <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="handleFinish"
  >
    <a-form-item has-feedback label="颜色码" name="code">
      <a-input v-model:value="formState.code" style="width: 380px"/>
    </a-form-item>
    <a-form-item has-feedback label="颜色名称" name="name">
      <a-input v-model:value="formState.name" style="width: 380px"/>
    </a-form-item>
    <a-form-item  label="计划用颜色" name="color">
      <a-input type="color" v-model:value="formState.color"  style="width: 380px"/>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
      <a-button type="primary" html-type="submit">新增</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import {reactive, ref, toRaw, watch} from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import {type FormInstance, message} from 'ant-design-vue';
import {addColor} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();

interface FormState {
  code: string;
  name: string;
  color: string ;
}

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  code: '',
  name: '',
  color:''
});

// 对颜色码字段的检查
const validateCode = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入颜色码');
  }
  if(!Number.isInteger(Number(value)) || value.length !== 2 || Number(value)<0){
    return Promise.reject('颜色码必须为两位正整数');
  }
  return Promise.resolve();
};
// 对颜色名称字段的检查
const validateName = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入颜色名称');
  }
  return Promise.resolve();
};
// 对计划用颜色字段的检查
const validateColor = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入计划用颜色');
  }
  return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
  code: [{ validator: validateCode, trigger: 'blur' }],
  name: [{ validator: validateName, trigger: 'blur' }],
  color: [{ validator: validateColor, trigger: 'blur' }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const resetForm = () => {
  formRef.value!.resetFields();
};

const onSubmit = async () => {
  try{
    let res = await addColor(toRaw(formState));
    if(res.data.code === 200){
      addFormStore.open = false;
      message.success('增加成功');
    }
  }catch (err:any){
    message.error(err.response.data.data);
  }
}

const handleFinish = async () => {
  await onSubmit();
};

watch(()=>addFormStore.open,(newVal,oldValue)=>{
  if (!newVal && oldValue){
    resetForm();
  }
})

watch(()=>formState.color,(newVal,oldValue)=>{
  console.log(newVal);
})

</script>