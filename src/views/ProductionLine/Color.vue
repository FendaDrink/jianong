<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">计划用颜色配置</h1>
  <Dialogue/>
  <span style="height: 32px;">
    <a-input v-model:value="searchContent" placeholder="请输入搜索内容" style="margin-right: 15px;width: 300px"/>
    <a-button type="primary" @click="onSearch">搜索</a-button>
    <a-button type="default" style="margin-left: 10px" @click="onReset">重置</a-button>
    <a-button type="dashed"  :disabled="!hasSelected" style="margin-left: 10px" @click="showDeleteConfirm">批量删除</a-button>
  </span>
  <a-table
      row-key="key"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :scroll="{ y: 500 }"
      :locale="localeOption"
      style="margin-top: 5px"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange}"
  >
    <template #bodyCell="{ column, text, record }" >
      <template v-if="['code', 'name'].includes(column.dataIndex)">
        <div>
          <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              :type="column.dataIndex==='code'?'number':'text'"
              style="margin: -5px 0"
          />
          <template v-else>
            <span> {{ text }}</span>
          </template>
        </div>
      </template>
      <template v-else-if="['color'].includes(column.dataIndex)">
        <div>
          <a-input
              v-if="editableData[record.key]"
              type="color"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
          />
          <template v-else>
            <span v-if="column.dataIndex !== 'color'"> {{ text }}</span>
            <div :style="{backgroundColor:record.color,width:'300px',height:'16px',borderRadius:'5px'}" v-else></div>
          </template>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a-popconfirm title="确认修改?" @confirm="save(record.key)" cancel-text="取消" ok-text="确认">
              <a>保存</a>
            </a-popconfirm>
              <a @click="cancel(record.key)">取消</a>
          </span>
          <span v-else>
            <a @click="edit(record.key)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="deleteItem(record.key)" cancel-text="取消" ok-text="确认">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </template>
  </a-table >
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import {onMounted, reactive, createVNode, ref, watch, computed} from 'vue';
import type { UnwrapRef } from 'vue';
import Dialogue from "@/components/AddForm/Dialogue.vue";
import {message,Modal} from "ant-design-vue";
import {deleteColor, deleteColorBatch, getColor, updateColor} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import moment from "moment/moment";
const confirmLoading = ref<boolean>(false);

const addFormStore = useAddFormStore();

const searchContent = ref<string>('');

const loading = ref<boolean>(false);
interface Column{
  title:string;
  dataIndex:string;
  width:string;
  sorter?:Function;
}


const columns = ref<Column[]>([]);

interface DataItem {
  key: string;
  code: number;
  name: string;
  color: string;
}

const localeOption = {
  emptyText: '暂无数据',
  cancelText: '取消',
  okText: '确认',
  filterConfirm: '确认',
  filterReset: '重置',
  selectAll: '全选',
  selectInvert: '反选',
  selectNone: '清空',
  selectionAll: '全选',
  sortTitle: '排序',
  triggerAsc: '升序',
  triggerDesc: '降序',
  cancelSort: '取消排序',
  cancelFilter: '取消筛选',
  clearFilter: '清空筛选',
}

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = async (key: string) => {
  try{
    let res = await updateColor(editableData[key]);
    if(res.data.code === 200){
      message.success('修改成功');
      await getData();
      delete editableData[key];
    }
  }catch (err:any){
    message.error(err.response.data.msg);
  }
};
const cancel = (key: string) => {
  delete editableData[key];
};

const deleteItem = async (key:string) => {
  try{
    let res = await deleteColor(key);
    if(res.data.code === 200){
      message.success('删除成功');
    }
  }catch (err:any){
    message.error(err.response.data.msg);
  }finally {
    await getData();
  }
}

const onSearch = () => {
  if(!searchContent.value){
    return message.warn('搜索不能为空');
  }
  loading.value = true;
  dataSource.value =  dataSourceCopy.value.filter(item => {
    return (item.color.includes(searchContent.value) ||
        item.name.includes(searchContent.value) ||
        item.code.toString().includes(searchContent.value)
    )
  });
  if(dataSource.value.length>0){
    message.success('搜索成功')
  }else{
    message.info('搜索结果为空')
  }
  loading.value = false;
}

const onReset = async () => {
  searchContent.value = '';
  await getData();
  message.success('重置成功');
}

type Key = string;

// 批量操作
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false,
});

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

// 显示删除确认框
const showDeleteConfirm = () => {
  Modal.confirm({
    title: `确认要删除${state.selectedRowKeys.length}项吗？`,
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    async onOk(){
      try{
        confirmLoading.value = true;
        let res = await deleteColorBatch({keys:state.selectedRowKeys});
        if(res.data.code === 200){
          confirmLoading.value = false;

        }
      }catch (err:any){
        message.error(err.response.data.msg);
      }

    },
    onCancel() {
      console.log('Cancel');
    },
    async afterClose(){
      message.success('删除成功');
      state.selectedRowKeys = [];
      try{
        await getData();
      }catch (err){
        console.log(err)
      }
    }
  });
};

const getData = async ()=>{
  loading.value = true;
  let res = await getColor();
  columns.value = [...res.data.data.title];
  columns.value.map(item=>{
   if(item.dataIndex === 'code') item.sorter = (a:DataItem,b:DataItem)=>a[item.dataIndex] - b[item.dataIndex]
  })
  columns.value.push({
    title: '操作',
    dataIndex: 'operation',
    width:'20%'
  })
  res.data.data.value.forEach(item=>{
    item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
  })
  dataSource.value =  dataSourceCopy.value = <DataItem[]>res.data.data.value
  loading.value = false;
}

watch( ()=>addFormStore.open,async (newValue,oldValue)=>{
  if(oldValue && !newValue){
    await getData();
  }
})


onMounted(async ()=>{
  await getData();
})


</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>