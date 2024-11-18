<template>
  <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="handleFinish"
  >
    <a-form-item has-feedback label="特殊发动机代码" name="code">
      <a-input v-model:value="formState.code" style="width: 380px"/>
    </a-form-item>
    <a-form-item has-feedback label="发动机档位" name="stall">
      <a-input type="number" v-model:value="formState.stall" style="width: 380px"/>
    </a-form-item>
    <a-form-item has-feedback label="发动机名称" name="name">
      <a-input v-model:value="formState.name"  style="width: 380px"/>
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
import {addSpecialEngine} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();

interface FormState {
  code: string;
  stall: number | null;
  name: string ;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  code: '',
  stall: null,
  name: '',
});

// 对档位字段的检查
const checkStall = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入档位');
  }
  if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
    return Promise.reject('档位必须为正整数');
  }
    return Promise.resolve();
};
// 对特殊发动机代码字段的检查
const validateCode = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入特殊发动机代码');
  }
    return Promise.resolve();
};
// 对特殊发动机名称字段的检查
const validateName = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入特殊发动机名称');
  }
    return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
  code: [{ validator: validateCode, trigger: 'blur' }],
  stall: [{ validator: checkStall, trigger: 'blur' }],
  name: [{ validator: validateName, trigger: 'blur' }],
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
    let res = await addSpecialEngine(toRaw(formState));
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

</script>