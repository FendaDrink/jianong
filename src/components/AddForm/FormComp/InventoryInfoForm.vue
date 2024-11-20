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
       <a-form-item has-feedback label="物资编号" name="number">
        <a-input v-model:value="formState.number" />
      </a-form-item>
      <a-form-item has-feedback label="物资名称" name="wzname">
        <a-input v-model:value="formState.wzname" />
      </a-form-item>
      <a-form-item has-feedback label="单位" name="danwei">
        <a-input v-model:value="formState.danwei" />
      </a-form-item>
    </a-col>
    <a-col :span="12" style="float:left;margin-left: 70px">
     <a-form-item has-feedback label="物资进价" name="inprice">
        <a-input type="number" v-model:value="formState.inprice"  />
      </a-form-item>
      <a-form-item has-feedback label="物资出价" name="outprice">
        <a-input type="number" v-model:value="formState.outprice"  />
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
import {type FormInstance, message} from 'ant-design-vue';
import {addInventoryInfo} from "@/request/enterprise";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();

interface FormState {
  number: string
  wzname: string
  danwei: string
  inprice: number | null
  outprice: number | null
}
const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  number: '',
  wzname: '',
  danwei: '',
  inprice: null,
  outprice: null,
});

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const resetForm = () => {
  formRef.value!.resetFields();
};

const onSubmit = async () => {
  try{
    let res = await addInventoryInfo(toRaw(formState));
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