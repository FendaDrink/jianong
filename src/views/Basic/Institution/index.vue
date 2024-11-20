<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">机构信息表</h1>
  <span style="height: 32px;">
    <a-input v-model:value="searchContent" placeholder="请输入搜索内容" style="width: 300px"/>
    <a-button type="primary" @click="onSearch" style="margin-left: 10px">搜索</a-button>
    <a-button type="default" style="margin-left: 10px" @click="onReset">重置</a-button>
  </span>
  <a-table
      row-key="key"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      style="margin-top:5px"
      :locale="localeOption"
  >
    <template #bodyCell="{ column, text, record }">
      <div>
        <template v-if="dataIndexArr.includes(column.dataIndex)">
          <div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
            {{ text?text:'/' }}
          </div>
        </template>
      </div>
    </template>
  </a-table >
  <Drawer/>
</template>
<script lang="ts" setup>
import {computed, createVNode, type UnwrapRef} from 'vue';
import {onMounted, reactive, ref, watch} from 'vue';
import Dialogue from "@/components/AddForm/Dialogue.vue";
import {message, Modal} from "ant-design-vue";
import Drawer from "@/components/CheckForm/CarDrawer.vue";
import {useDrawerStore} from "@/stores/drawer";
import {getInstitution, updateInstitution, deleteInstitution} from "@/request/enterprise";
import {deleteOrderCarBatch} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
import {cloneDeep} from "lodash-es";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const confirmLoading = ref<boolean>(false);

const searchContent = ref<string>('');

const addFormStore = useAddFormStore();

const loading = ref<boolean>(false);

interface titleItem{
  title:string;
  dataIndex:string;
  width:number;
  fixed?:string;
  filters?:Array<Object>;
  onFilter?:Function;
  sorter?:Function;
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

const dataIndexArr = ref<string[]>([]);

const columns = ref<titleItem[]>([]);

interface DataItem {
  key:string;
  id: string;
  number: string;
  jgname: string;
  type: string;
  address: string;
}

const drawerStore = useDrawerStore();

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const onSearch = () => {
  if(!searchContent.value){
    return message.warn('搜索不能为空');
  }
  loading.value = true;
  const keywords = searchContent.value.trim().toLowerCase()
  dataSource.value =  dataSourceCopy.value.filter(item => {
   return (
    item.number.toLowerCase().includes(keywords) ||
    item.jgname.toLowerCase().includes(keywords) ||
    item.type.toLowerCase().includes(keywords) ||
    item.address.toLowerCase().includes(keywords)
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
  if(searchContent.value){
    searchContent.value = '';
    await getData();
  }
  message.success('重置成功');
}

// 获取订单车数据
const getData = async () => {
  loading.value = true;
  let res = await getInstitution();
  columns.value = [...res.data.data.title];
  dataIndexArr.value = columns.value.map(item=>item.dataIndex);
  columns.value = columns.value.filter(item=>item.dataIndex!=='key')
  dataSource.value = dataSourceCopy.value = <DataItem[]>res.data.data.value
  loading.value = false;
}

// 批量操作
const state = reactive<{
  selectedRowKeys: string[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false,
});

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: string[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

const update= async (key:string) => {
  for(let item of Object.keys(editableData[key])) {
    if(editableData[key][item] === ''){
      return message.error(`有部分字段未填写`);
    }
  }
  try{
    let res = await updateInstitution(editableData[key]);
    if(res.data.code === 200){
      message.success('修改成功');
      await getData();
      delete editableData[key];
    }
  }catch (err:any){
    message.error('修改失败，请检查后再试');
    return;
  }
}

const combinedWatch = computed(() => ({
  open: addFormStore.open,
  openInsert: addFormStore.openInsert,
}));

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
        let res = await deleteOrderCarBatch({orderIds:state.selectedRowKeys});
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

const selectHanlder = (value:any)=>{
  console.log(value.year());
}

watch(combinedWatch, async (newValue, oldValue) => {
  if ((oldValue.open && !newValue.open) || (oldValue.openInsert && !newValue.openInsert)) {
    await getData();
  }
});

watch(()=>drawerStore.open,async (newValue,oldValue)=>{
  if(oldValue && !newValue){
    await getData();
  }
})

onMounted(async () => {
  await getData();
})

</script>

<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
:global(.ant-table-body) {
  overflow-y: auto !important;
}
</style>