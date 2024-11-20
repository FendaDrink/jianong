<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">农户信息表</h1>
  <Dialogue/>
  <span style="height: 32px;">
    <a-input v-model:value="searchContent" placeholder="请输入搜索内容" style="width: 300px"/>
    <a-button type="primary" @click="onSearch" style="margin-left: 10px">搜索</a-button>
    <a-button type="default" style="margin-left: 10px" @click="onReset">重置</a-button>
    <a-button type="dashed"  :disabled="!hasSelected" style="margin-left: 10px" @click="showDeleteConfirm">批量删除</a-button>
    <!-- <Test/> -->
  </span>
  <a-table
      row-key="orderId"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :scroll="{  x: 1000 }"
      style="margin-top:5px"
      :locale="localeOption"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, columnWidth: 5}"
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
          />
          <div v-else style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
            {{ text?text:'/' }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a-popconfirm title="确认修改?" @confirm="update(record.key)" cancel-text="取消" ok-text="保存">
              <a>保存</a>
            </a-popconfirm>
            <a-typography-link @click="cancel(record.key)">取消</a-typography-link>
          </span>
            <span v-else>
            <a @click.capture="check(record.key)">查看</a>
            <a @click="edit(record.key)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="deleteItem(record.key)" cancel-text="取消" ok-text="确认">
              <a>删除</a>
            </a-popconfirm>
          </span>
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
import Test from '@/components/AddForm/FormComp/ImportFile.vue'
import {message, Modal} from "ant-design-vue";
import Drawer from "@/components/CheckForm/CarDrawer.vue";
import {useDrawerStore} from "@/stores/drawer";
import { deleteFarmerInfo, getFarmerInfo, updateFarmerInfo} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
import {cloneDeep} from "lodash-es";
import moment from 'moment'
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import type { Dayjs } from 'dayjs';

const confirmLoading = ref<boolean>(false);

const searchContent = ref<string>('');

const addFormStore = useAddFormStore();

const loading = ref<boolean>(false);

const selectedYear = ref<Dayjs>();
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
  ['key','text'],
  ['number','text'],
  ['nhname','text'],
  ['address','text'],
  ['tel','number'],
  ['area','text'],
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
  key:OrderId; 
  number:string;
  nhname:string;
  address:string;
  tel:number|null;
  area:string;
}

const drawerStore = useDrawerStore();

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const check =  async (orderId:string) => {
  drawerStore.changeOpen();
  drawerStore.orderId = orderId;
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};

const cancel = (key: string) => {
  delete editableData[key];
};
// 删除农户信息
const deleteItem = async (key:string) => {
  let res = await deleteFarmerInfo(key);
  if(res.data.code === 200){
    message.success('删除成功');
    await getFarmerInfoDetail();
  }else{
    message.error('删除失败');
  }
}

const onSearch = () => {
  if(!searchContent.value){
    return message.warn('搜索不能为空');
  }
  loading.value = true;
  const keywords = searchContent.value.trim().toLowerCase()
  dataSource.value =  dataSourceCopy.value.filter(item => {
    return (
            (searchContent.value &&
            (item.key.includes(searchContent.value) ||
              item.number.toLowerCase().includes(keywords) ||
              item.nhname.toLowerCase().includes(keywords) ||
              item.address?.toString().toLowerCase().includes(keywords) ||
              item.tel?.toString().toLowerCase().includes(keywords) ||
              item.area?.toString().toLowerCase().includes(keywords) 
               
            ))
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
  if(searchContent.value || selectedYear.value){
    searchContent.value = '';
    selectedYear.value = undefined;
    await getFarmerInfoDetail();
  }
  message.success('重置成功');
}

// 获取农户信息
const getFarmerInfoDetail = async () => {
  loading.value = true;
  let res = await getFarmerInfo();

  columns.value = res.data.data.title.filter(item => item.dataIndex !== 'id' && item.dataIndex !== 'key');

  dataIndexArr.value = columns.value.map(item=>item.dataIndex);
  columns.value[0].fixed = 'left';
  columns.value[0].width = 20
  columns.value.push({
    title: '操作',
    dataIndex: 'operation',
    width:45,
    fixed:'right'
  })
  dataSource.value = dataSourceCopy.value = <DataItem[]>res.data.data.value.map(item=>{
    return {
      ...item,
      inTime:moment(item.inTime).format('YYYY-MM-DD'),
      time: moment(item.time).format('YYYY-MM-DD HH:mm:ss')
    }
  });
  loading.value = false;
}

// 批量操作
const state = reactive<{
  selectedRowKeys: OrderId[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false,
});

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: OrderId[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};
// 农户信息修改
const update= async (key:string) => {
  try{
    let res = await updateFarmerInfo(editableData[key]);

    if(res.data.code === 200){
      message.success('修改成功');
      await getFarmerInfoDetail();
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
        let res = await deleteFarmerInfo({orderIds:state.selectedRowKeys});
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
        await getFarmerInfoDetail();
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
    await getFarmerInfoDetail();
  }
});

watch(()=>drawerStore.open,async (newValue,oldValue)=>{
  if(oldValue && !newValue){
    await getFarmerInfoDetail();
  }
})

onMounted(async () => {
  await getFarmerInfoDetail();
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