<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">物资出库</h1>
  <Dialogue/>
  <span style="height: 32px;">
    <a-input v-model:value="searchContent" placeholder="请输入搜索内容" style="width: 300px"/>
    <a-button type="primary" @click="onSearch" style="margin-left: 10px">搜索</a-button>
    <a-button type="default" style="margin-left: 10px" @click="onReset">重置</a-button>
  </span>
  <a-table
      row-key="orderId"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :scroll="{  x: 1500 }"
      style="margin-top:5px"
      :locale="localeOption"
  >
    <template #bodyCell="{ column, text, record }">
      <div>
        <template v-if="dataIndexArr.includes(column.dataIndex)">
          <div v-if="column.dataIndex !== 'time'" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
            {{ text?text:'/' }}
          </div>
          <div v-else style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
            {{ text?moment(text).format('YYYY-MM-DD HH:mm:ss'):'/'}}
          </div>
        </template>
      </div>
    </template>
  </a-table >
  <Drawer/>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { onMounted, reactive, ref, watch } from "vue";
import Dialogue from "@/components/AddForm/Dialogue.vue";
import { message } from "ant-design-vue";
import Drawer from "@/components/CheckForm/CarDrawer.vue";
import { useDrawerStore } from "@/stores/drawer";
import { getOutInventory } from "@/request/enterprise";
import { useAddFormStore } from "@/stores/addForm";
import moment from "moment";
import type { Dayjs } from "dayjs";

const confirmLoading = ref<boolean>(false);

const searchContent = ref<string>("");

const addFormStore = useAddFormStore();

const loading = ref<boolean>(false);

const selectedYear = ref<Dayjs>();
interface titleItem {
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

type OrderId = string;

interface DataItem {
  key: string;
  id: string;
  wznumber: string;
  number: string;
  mch: string;
  ourprice: number | null;
  total: number | null;
  sum: number | null;
  nhname: string;
  nhnumber: string;
  time: string;
}

const drawerStore = useDrawerStore();

const dataSource = ref<DataItem[]>([]);

const dataSourceCopy = ref<DataItem[]>([]);



const onSearch = () => {
  if (!searchContent.value) {
    return message.warn("搜索不能为空");
  }
  loading.value = true;

  const keywords = searchContent.value.trim().toLowerCase()
  dataSource.value =  dataSourceCopy.value.filter(item => {
    return (
            (searchContent.value &&
            (item.number.includes(searchContent.value) ||
              item.wznumber.toLowerCase().includes(keywords) ||
              item.mch.toLowerCase().includes(keywords) ||
              item.ourprice?.toString().toLowerCase().includes(keywords) ||
              item.total?.toString().toLowerCase().includes(keywords) ||
              item.sum?.toString().toLowerCase().includes(keywords) ||
              item.nhname.toLowerCase().includes(keywords) ||
              item.nhnumber.toLowerCase().includes(keywords)
            ))
    )
  });
  if (dataSource.value.length > 0) {
    message.success("搜索成功");
  } else {
    message.info("搜索结果为空");
  }
  loading.value = false;
};

const onReset = async () => {
  if (searchContent.value) {
    searchContent.value = "";
    await getData();
  }
  message.success("重置成功");
};

// 获取出库数据
const getData = async () => {
  loading.value = true;
  let res = await getOutInventory();
  columns.value = res.data.data.title.filter(item => item.dataIndex !== 'id' && item.dataIndex !== 'key');
  dataIndexArr.value = columns.value.map((item) => item.dataIndex);
  columns.value[0].fixed = "left";

  dataSource.value = dataSourceCopy.value = <DataItem[]>res.data.data.value
  loading.value = false;
};

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
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};


const combinedWatch = computed(() => ({
  open: addFormStore.open,
  openInsert: addFormStore.openInsert,
}));


watch(combinedWatch, async (newValue, oldValue) => {
  if ((oldValue.open && !newValue.open) || (oldValue.openInsert && !newValue.openInsert)) {
    await getData();
  }
});

watch(
  () => drawerStore.open,
  async (newValue, oldValue) => {
    if (oldValue && !newValue) {
      await getData();
    }
  }
);

onMounted(async () => {
  await getData();
});
</script>

<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
:global(.ant-table-body) {
  overflow-y: auto !important;
}
</style>