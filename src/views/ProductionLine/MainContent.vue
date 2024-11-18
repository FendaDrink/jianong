<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">生产线信息</h1>
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
      :scroll="{ y: 480,x:1500 }"
      style="margin-top:5px"
      :locale="localeOption"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange}"
  >
    <template #bodyCell="{ column, text, record }">
      <div>
        <template v-if="column.dataIndex === 'type'">
          <a-select
              v-if="editableData[record.key]"
              ref="select"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="width: 120px"
          >
            <a-select-option value="车身">车身</a-select-option>
            <a-select-option value="涂装">涂装</a-select-option>
            <a-select-option value="总装">总装</a-select-option>
          </a-select>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="dataIndexArr.includes(column.dataIndex)">
            <a-input
                v-if="editableData[record.key] && column.dataIndex !== 'user' && column.dataIndex!=='time'"
                :type="typeof editableData[record.key][column.dataIndex] === 'number' ? 'number':'type'"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0;"
            />
            <template v-else>
              {{ text }}
            </template>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a-popconfirm title="确认修改?" @confirm="updatePublic(record.key)" cancel-text="取消" ok-text="保存">
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
import {message,Modal} from "ant-design-vue";
import Drawer from "@/components/CheckForm/Drawer.vue";
import {useDrawerStore} from "@/stores/drawer";
import {
  deletePublicDetail,
  deletePublicDetailBatch,
  getPublicDetail,
  getPublicTitle,
  updatePublicDetail
} from "@/request/api";
import {useAddFormStore} from "@/stores/addForm";
import {cloneDeep} from "lodash-es";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import moment from 'moment'
const confirmLoading = ref<boolean>(false);

const searchContent = ref<string>('');

const addFormStore = useAddFormStore();

const loading = ref<boolean>(false);

interface titleItem{
  title:string;
  dataIndex:string;
  width:number;
  filters?:Array<Object>;
  onFilter?:Function;
  sorter?:Function;
  fixed?:string;
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
  key: string;
  code: string;
  type: string;
  name: string;
  classes: number;
  speed: number;
  efficiency: number;
  group: number;
  flow:number;
  simple:string;
}

const drawerStore = useDrawerStore();

const {changeKey} = drawerStore;

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const check =  async (key:string) => {
  drawerStore.changeOpen();
  changeKey(key);
}

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};

const cancel = (key: string) => {
  delete editableData[key];
};

const deleteItem = async (key:string) => {
  let res = await deletePublicDetail(key);
  if(res.data.code === 200){
    message.success('删除成功');
    await publicDetailHandle();
  }else{
    message.error('删除失败');
  }
}

const onSearch = () => {
  if(!searchContent.value){
    return message.warn('搜索不能为空');
  }
  loading.value = true;
  dataSource.value =  dataSourceCopy.value.filter(item => {
    return (item.code.includes(searchContent.value) ||
    item.type.includes(searchContent.value) ||
    item.name.includes(searchContent.value) ||
    item.classes.toString().includes(searchContent.value) ||
    item.speed.toString().includes(searchContent.value) ||
    item.efficiency.toString().includes(searchContent.value) ||
    item.group.toString().includes(searchContent.value) ||
    item.flow.toString().includes(searchContent.value) ||
    item.simple.includes(searchContent.value) ||
    item.user.includes(searchContent.value)||
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
  await publicDetailHandle();
  message.success('重置成功');
}

const publicTitleHandle = async () => {
  let res =  await getPublicTitle();
  columns.value = [...res.data.data];
  columns.value[0].fixed = 'left'
  dataIndexArr.value = columns.value.map(item=>item.dataIndex);
  columns.value.forEach(item=>{
    if('type'===item.dataIndex){
      item.filters = [
        {
          text:'总装',
          value:'总装'
        },
        {
          text:'涂装',
          value:'涂装'
        },
        {
          text:'车身',
          value:'车身'
        }
      ]
      item.onFilter = (value:string, record:DataItem) => {
        return record.type.startsWith(value);
      }
    }

    if(['classes','speed','efficiency','group','flow'].includes(item.dataIndex)){
      item.sorter = (a:DataItem,b:DataItem)=> a[item.dataIndex]-b[item.dataIndex];
    }
  })
  columns.value.push({
    title:'操作',
    dataIndex:'operation',
    width:150,
    fixed:'right'
  })

}

const publicDetailHandle = async () => {
  loading.value = true;
  let res =  await getPublicDetail();
  res.data.data.forEach((item:DataItem)=>{
    item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
  })
  dataSource.value =  dataSourceCopy.value = res.data.data;
  loading.value = false;
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
        let res = await deletePublicDetailBatch({keys:state.selectedRowKeys});
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
        await publicDetailHandle();
      }catch (err){
        console.log(err)
      }
    }
  });
};

const updatePublic= async (key:string) => {
  try{
    let res = await updatePublicDetail(editableData[key]);
    if(res.data.code === 200){
      message.success('修改成功');
      await publicDetailHandle();
      delete editableData[key];
    }
  }catch (err:any){
    message.error(err.response.data.msg);
    return;
  }
  // Object.assign(dataSource.value.filter(item => key === item.key.toString())[0], editableData[key]);
  // delete editableData[key];
}

watch( ()=>addFormStore.open,async (newValue,oldValue)=>{
  if(oldValue && !newValue){
    await Promise.allSettled([publicTitleHandle(), publicDetailHandle()]);
  }
})

watch(()=>drawerStore.open,async (newValue,oldValue)=>{
  if(oldValue && !newValue){
    await Promise.allSettled([publicTitleHandle(), publicDetailHandle()]);
  }
})

onMounted(async () => {
  await Promise.allSettled([publicTitleHandle(), publicDetailHandle()]);
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