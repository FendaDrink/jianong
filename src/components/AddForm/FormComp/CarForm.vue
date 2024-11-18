<template>
  <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @change="handleInput"
  >
    <a-col :span="10" style="display: inline-block">
      <template v-for="item in formItem.slice(0,7)" :key="item.label" >
        <a-form-item
            has-feedback
            :label="item.label"
            :name="item.value"
            :label-col="{span:8}"
            :wrapper-col="{span:23,offset:0}"
        >
          <a-input
              v-if="item.value !== 'inTime'"
              :type="inputType.get(item.value)"
              :disabled="item.value === 'orderId'"
              v-model:value="formState[item.value]"
              style="width: 220px;margin-right: 50px"/>
          <a-date-picker
              v-else
              v-model:value="formState[item.value]"
              format="YYYY-MM-DD"
              placeholder="请选择入库日期"
              style="width: 220px;margin-right: 50px"
          />
        </a-form-item>
      </template>
    </a-col>
    <a-col :span="12" style="display: inline-block;margin-left: 30px">
      <template v-for="item in formItem.slice(7,14)" :key="item.label" >
        <a-form-item has-feedback :label="item.label" :type="inputType.get(item.value)" :name="item.value" :label-col="{span:9}" :wrapper-col="{span:23,offset:0}">
          <a-input :type="inputType.get(item.value)" v-model:value="formState[item.value]" style="width: 220px;margin-right: 50px"/>
        </a-form-item>
      </template>
    </a-col>
    <template v-for="item in formItem.slice(14,16)" :key="item.label">
      <a-form-item has-feedback :label="item.label" :name="item.value" :label-col="{span:3}" :wrapper-col="{span:23,offset:0}">
        <a-textarea  v-model:value="formState[item.value]" style="width: 550px;height: 60px;margin-left:5px;resize: none"/>
      </a-form-item>
    </template>


    <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
      <a-button type="primary" @click="onSubmit">新增</a-button>
      <a-button style="margin-left: 20px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref, toRaw, watch} from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import {type FormInstance, message} from 'ant-design-vue';
import { addOrderCar, getOrderCar} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
const addFormStore = useAddFormStore();
import moment from 'moment';
interface FormState {
  orderId:string;
  year:number|null;
  inTime:any;
  type:string;
  airCode:string;
  colorCode:number|null;
  batchNum:string;
  carNum:number|null;
  varietyCode:string;
  carCode:string;
  stall:number|null;
  engineCode:string;
  customer:string;
  orderBatchNum:string;
  requirements:string;
  remark:string;
}

const formRef = ref<FormInstance>();


const formItem = ref<{
  label:string;
  value:string;
}[]>([]);

const formState = reactive<FormState>({
  orderId:'',
  year:null,
  inTime:'',
  type:'',
  airCode:'',
  colorCode:null,
  batchNum:'',
  carNum:null,
  varietyCode:'',
  carCode:'',
  stall:null,
  engineCode:'',
  customer:'',
  orderBatchNum:'',
  requirements:'',
  remark:'',
});

const inputType = new Map([
    ['orderId','text'],
    ['year','number'],
    ['inTime','date'],
    ['type','text'],
    ['airCode','text'],
    ['colorCode','number'],
    ['batchNum','text'],
    ['carNum','number'],
    ['varietyCode','text'],
    ['carCode','text'],
    ['stall','number'],
    ['engineCode','text'],
    ['customer','text'],
    ['orderBatchNum','text'],
    ['requirements','text'],
    ['remark','text'],
]);


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

// 对年份字段的检查
const validateYearCode = async (_rule: Rule, value: string) => {
  if(Number(value)>2100 || Number(value)<1900){
    return Promise.reject('请输入正确的年份');
  }
  return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
  orderId:[{ required: true, message: '订单编号尚未完善' }],
  year:[{ required: true, message: '请输入年度' },{ validator: validateYearCode, trigger: 'blur'}],
  inTime:[{ required: true, message: '请选择入库日期' }],
  type:[{ required: true, message: '请输入类型' }],
  airCode:[{ required: true, message: '请输入空调代码' }],
  colorCode:[{ required: true, message: '请输入颜色代码' }],
  batchNum:[{ required: true, message: '请输入批次号' }],
  carNum:[{ required: true, message: '请输入车辆数量' }],
  varietyCode:[{ required: true, message: '请输入品种代码' }],
  carCode:[{ required: true, message: '请输入白车身码' }],
  stall:[{ required: true, message: '请输入档位' }],
  engineCode:[{ required: true, message: '请输入发动机代码' }],
  customer:[{ required: true, message: '请输入订货单位' }],
  orderBatchNum:[{ required: true, message: '请输入订单批次号' }],
};

const resetForm = () => {
  formRef.value!.resetFields();
};

const onSubmit = async () => {
  try{
    const time = moment(formState.inTime).format('YYYY-MM-DD');
    const newFormState = Object.assign({},toRaw(formState),{inTime:time});
    let res = await addOrderCar(newFormState);
    if(res.data.code === 200){
      message.success('增加成功');
      addFormStore.open = false;
    }
  }catch (err:any){
    message.error(err.response.data.msg);
  }
}

// const handleFinish = async () => {
//   await onSubmit();
// };

const handleInput = async (e:InputEvent) => {
  if(formState.year && formState.batchNum){
    formState.orderId = "0" + formState.year + formState.batchNum;
  }else{
    formState.orderId = '';
  }
}

const getData = async () => {
  let res = await getOrderCar();
  if(res.data.code === 200){
    res.data.data['title'].forEach(item=>{
      formItem.value.push(
        {
        label:item.title,
        value:item.dataIndex
      })
    });
  }
}

onMounted(async ()=>{
  await getData();
})

// watch(()=>addFormStore.open,(newVal,oldValue)=>{
//   if (!newVal && oldValue){
//     resetForm();
//   }
// })


</script>