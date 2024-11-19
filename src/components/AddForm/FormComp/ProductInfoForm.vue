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
      <a-form-item has-feedback label="产品名称" name="mch">
      <a-input v-model:value="formState.mch" />
    </a-form-item>
      <a-form-item has-feedback label="产品等级" name="class">
        <a-input v-model:value="formState.class" />
      </a-form-item>
      <a-form-item has-feedback label="产地" name="address">
        <a-input v-model:value="formState.address"  />
      </a-form-item>
      <a-form-item has-feedback label="基地编码" name="jdname">
        <a-input v-model:value="formState.jdnumber"  />
      </a-form-item>
    </a-col>
    <a-col :span="12" style="float:left;margin-left: 70px">
      <a-form-item has-feedback label="品种名称" name="pzname">
        <a-input v-model:value="formState.pzname"  />
      </a-form-item>
      <a-form-item has-feedback label="进价" name="price">
        <a-input type="number" v-model:value="formState.price"  />
      </a-form-item>
      <a-form-item has-feedback label="包装袋" name="package">
        <a-input v-model:value="formState.package"  />
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
import {addProductInfo} from "@/request/enterprise";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();

interface FormState {
  mch: string
  class: string
  address: string
  jdnumber: string
  pzname: string
  price: number | null
  package: string
}
const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  mch: '',
  class: '',
  address: '',
  jdnumber: '',
  pzname: '',
  price: null,
  package: ''
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
};

const onSubmit = async () => {
  try{
    let res = await addProductInfo(toRaw(formState));
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