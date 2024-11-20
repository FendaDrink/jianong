<template>
  <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="handleFinish"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      style="overflow: hidden"
  >
    <a-col :span="12" style="float: left">
      <a-form-item has-feedback label="机构编号" name="mch">
        <a-input v-model:value="formState.number" />
      </a-form-item>
      <a-form-item has-feedback label="机构名称" name="class">
        <a-input v-model:value="formState.jgname" />
      </a-form-item>
    </a-col>
    <a-col :span="12" style="float:left;margin-left: 70px">
      <a-form-item has-feedback label="机构类型" name="address">
        <a-select
          ref="select"
          v-model:value="formState.type"
        >
          <a-select-option value="生产基地">生产基地</a-select-option>
          <a-select-option value="批发中心">批发中心</a-select-option>
          <a-select-option value="代购点">代购点</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item has-feedback label="机构地址" name="jdname">
        <a-input v-model:value="formState.address"  />
      </a-form-item>
    </a-col>
    <template style="clear: both"></template>
    <a-col style="float: left;width: 240px;margin: 0px 250px 0 250px">
      <a-form-item >
        <a-button type="primary" @click.prevent="onSubmit">新增</a-button>
        <a-button style="margin-left: 20px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-col>
  </a-form>
</template>
<script lang="ts" setup>
import {reactive, ref, toRaw, watch} from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import {type FormInstance, message} from 'ant-design-vue';
import {addInstitution} from "@/request/enterprise";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();
const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
interface FormState {
  number: string
  jgname: string
  type: string
  address: string
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  number: '',
  jgname: '',
  type: '',
  address: ''
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
  // code: [{ validator: validateCode, trigger: 'blur' }],
  // stall: [{ validator: checkStall, trigger: 'blur' }],
  // name: [{ validator: validateName, trigger: 'blur' }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const resetForm = () => {
  formRef.value!.resetFields();
  formState.type = '';
};

const onSubmit = async () => {
  try{
    let res = await addInstitution(toRaw(formState));
    if(res.data.code === 200){
      addFormStore.open = false;
      message.success('增加成功');
    }
  }catch (err:any){
      message.error(err.response.data.msg);
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