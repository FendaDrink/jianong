<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">公司物资库存</h1>

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
          <a-input
              :label="column.dataIndex"
              v-if="editableData[record.key]"
              :type="inputType.get(column.dataIndex)"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0;"
              :disabled="column.dataIndex === 'wznumber'"
          />
          <div v-else style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
            {{ text?text:'/' }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a-popconfirm title="确认盘点?" @confirm="update(record.key)" cancel-text="取消" ok-text="保存">
              <a>保存</a>
            </a-popconfirm>
            <a-typography-link @click="cancel(record.key)">取消</a-typography-link>
          </span>
            <span v-else>
            <a @click="edit(record.key)">盘点</a>
          </span>
          </div>
        </template>
      </div>
    </template>
  </a-table >
  <Drawer/>
</template>
<script lang="ts" setup>
import {computed, type UnwrapRef} from 'vue';
import {onMounted, reactive, ref, watch} from 'vue';

import {message, Modal} from "ant-design-vue";
import Drawer from "@/components/CheckForm/CarDrawer.vue";
import {useDrawerStore} from "@/stores/drawer";
import {getInventory, updateInventory} from '@/request/enterprise'
import {useAddFormStore} from "@/stores/addForm";
import {cloneDeep} from "lodash-es";

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

const inputType = new Map([
  ['remain', 'number']
]);

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

type OrderId = string;

interface DataItem {
  key: string;
  wznumber: string;
  remain: number|number;
}

const drawerStore = useDrawerStore();

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = async  (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};

const cancel = (key: string) => {
  delete editableData[key];
};

const onSearch = () => {
  if(!searchContent.value){
    return message.warn('搜索不能为空');
  }
  loading.value = true;
  const keywords = searchContent.value.trim().toLowerCase()
  dataSource.value =  dataSourceCopy.value.filter(item => {
    return (
            (searchContent.value &&
            (item.wznumber.toLowerCase().includes(keywords) ||
            item.remain!.toString().toLowerCase().includes(keywords)
    )))
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
  let res = await getInventory();
  columns.value = [...res.data.data.title];
  dataIndexArr.value = columns.value.map(item=>item.dataIndex);
  columns.value = res.data.data.title.filter(item => item.dataIndex !== 'id' && item.dataIndex !== 'key');
  dataSource.value = dataSourceCopy.value = <DataItem[]>res.data.data.value
  loading.value = false;
}

const update= async (key:string) => {
  try{
    let res = await updateInventory(editableData[key]);
    if(editableData[key].remain < 0)
      return message.error('库存不能小于0');
    if(res.data.code === 200){
      message.success('盘点成功');
      await getData();
      delete editableData[key];
    }
  }catch (err:any){
    message.error(err.response.data.msg);
    return;
  }
}

const combinedWatch = computed(() => ({
  open: addFormStore.open,
  openInsert: addFormStore.openInsert,
}));


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