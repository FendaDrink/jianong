<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">特殊发动机</h1>
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
    <template #bodyCell="{ column, text, record }">
      <template v-if="dataIndexArr.includes(column.dataIndex)">
        <div>
          <a-input
              v-if="editableData[record.key] && ['code','stall','name'].includes(column.dataIndex)"
              :type="typeof editableData[record.key][column.dataIndex] === 'number' ? 'number':'type'"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
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
import {computed, createVNode, onMounted, reactive, ref, watch} from 'vue';
import type { UnwrapRef } from 'vue';
import Dialogue from "@/components/AddForm/Dialogue.vue";
import {message, Modal} from "ant-design-vue";
import {
  deleteSpecialEngine,
  deleteSpecialEngineBatch,
  getSpecialEngine,
  updateSpecialEngine
} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import moment from "moment";
const confirmLoading = ref<boolean>(false);

const addFormStore = useAddFormStore();

const loading = ref<boolean>(false);

// 表格标题接口
interface Columns {
  title: string;
  dataIndex: string;
  width: string;
  sorter?:Function;
}

// 表格数据接口
interface DataItem {
  key: string;
  code: string;
  stall: number;
  name: string;
  user:string;
  time:string;
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

const columns = ref<Columns[]>([]);

const dataIndexArr = ref<string[]>([]);

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);

const searchContent = ref<string>('');

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = async (key: string) => {
  try{
   let res = await updateSpecialEngine(editableData[key]);
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
    let res = await deleteSpecialEngine(key);
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
    return (item.code.includes(searchContent.value) ||
        item.name.includes(searchContent.value) ||
        item.stall.toString().includes(searchContent.value) ||
        item.user.includes(searchContent.value) ||
        item.time.includes(searchContent.value)
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
        let res = await deleteSpecialEngineBatch({keys:state.selectedRowKeys});
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

// 获取特殊发动机数据
const getData = async () => {
  loading.value = true;
  let res = await getSpecialEngine();
  columns.value = [...res.data.data.title];
  dataIndexArr.value = columns.value.map(item=>item.dataIndex);
  columns.value.map(item=>{
    if(item.dataIndex === 'stall') item.sorter = (a:DataItem,b:DataItem)=>a[item.dataIndex] - b[item.dataIndex];
  })
  columns.value.push({
    title: '操作',
    dataIndex: 'operation',
    width:'20%'
  })
  res.data.data.value.forEach(item=>{
    item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
  })
  dataSource.value = dataSourceCopy.value = <DataItem[]>res.data.data.value;
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