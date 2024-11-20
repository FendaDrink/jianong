<template>
  <a-spin tip="备份中，请稍后..." spinning="spinning" size="large" v-if="loading" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <a-form
    v-else
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="overflow: hidden;margin-left: 20px"
  >

    <h2 style="font-size: 14px;font-weight: bold" v-if="options.length">请选择备份的SQL文件:</h2>
    <h2 style="font-size: 14px;font-weight: bold" v-else>当前无备份文件</h2>
    <div>
      <ul style="max-height: 200px;overflow: auto;font-size: 18px;margin: 5px 0">
        <li v-for="option in options" :key="option.value">
          <label style="cursor: pointer;" class="labelItem">
            <input
              style="cursor: pointer;"
              type="radio"
              :value="option.value"
              v-model="selectedOption"
            />
            {{ option.label }}
          </label>
        </li>
      </ul>
      <p v-if="selectedOption" style="font-size: 15px"><span style="font-weight: bold">当前选中的文件:&nbsp;</span> {{ selectedOption }}</p>
    </div>

    <template style="clear: both"></template>
    <a-col style="width: 240px; margin: 30px 250px 0 220px">
      <a-form-item>
        <a-button type="primary" :disabled="!selectedOption" @click.prevent="onSubmit">恢复</a-button>
        <a-button style="margin-left: 20px" @click="onBackup">备份</a-button>
      </a-form-item>
    </a-col>
  </a-form>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref, toRaw, watch} from "vue";
import { Form, message } from "ant-design-vue";
import {getBackupList, backup, restore} from "@/request/enterprise";
import { useAddFormStore } from "@/stores/addForm";

const loading = ref(false);
const addFormStore = useAddFormStore();

const options = ref([])

const selectedOption = ref('');
const useForm = Form.useForm;

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };

interface ModelRef {
  chpnumber: string;
  mch: string;
  gknumber: string;
  price: number | null;
  total: number | null;
  person: string;
  time: number | null;
}

const modelRef = reactive<ModelRef>({
  chpnumber: "",
  mch: "",
  gknumber: "",
  price: null,
  total: null,
  person: "",
  time: null,
});

const rulesRef = reactive({});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => {
    // console.log(...args);
  },
});
const onSubmit = async () => {
  loading.value = true;
  try{
    let res = await restore({
      backupFile: selectedOption.value
    });
    if (res.data.code === 200) {
      message.success('恢复成功，'+selectedOption.value).then(() => window.location.reload());

    }
  }
  catch (err:any){
    message.error(err.response.data.data);
  }
  finally {
    loading.value = false;
  }
}

const getData = async () => {
  let res = await getBackupList();
  options.value = res.data.data.map((item: any) => {
    return {
      label: item,
      value: item
    }
  }).reverse()
}

const onBackup = async () => {
  loading.value = true;
  selectedOption.value = '';
  try{
    let res = await backup();
    if (res.data.code === 200) {
      message.success('备份成功，文件名为：'+res.data.data);
      getData();
    }
  }
  catch (err:any){
    message.error(err.response.data.msg);
  }
  finally {
    loading.value = false;
  }
}
watch(
  () => addFormStore.backupOpen,
  (newVal, oldValue) => {
    if (!newVal && oldValue) {
      selectedOption.value = '';
    }
  }
);

onMounted( () => {
  getData()
})
</script>

<style scoped>
.labelItem {
  border-radius: 5px;
  margin:5px 0;
  padding:5px
}
.labelItem:hover {
  background-color: #f2f2f2;
}
</style>