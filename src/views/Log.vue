<template>
  <a-spin tip="加载中，请稍后..." spinning="spinning" size="large" v-if="0" style="display: flex;justify-content: center;align-items: center">
  </a-spin>
  <h1 style="font-size: 28px;margin-bottom: 20px">操作日志</h1>
  <a-table :columns="columns" :data-source="dataSource" :loading="loading" :scroll="{ y:  500 }" :locale="localeOption">
    <template #bodyCell="{ column, text, record }">
      <template v-if="!['timestamp', 'user', 'method', 'url','requestBody','status'].includes(column.dataIndex)">
        <div style="font-size: 30px">
          <template>
            {{ text }}
          </template>
        </div>
      </template>
    </template>
  </a-table >
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {getLog} from "@/request/api";
const columns = [
  {
    title: '操作时间',
    dataIndex: 'timestamp',
  },

  {
    title: '操作者',
    dataIndex: 'user',
  },
  {
    title:'操作方式',
    dataIndex:'method',
    filters:[
        {
          text:'GET',
          value:'GET'
        },
        {
          text:'POST',
          value:'POST'
        },
        {
          text:'PATCH',
          value:'PATCH'
        },
        {
          text:'DELETE',
          value:'DELETE'
        }
    ],
    onFilter: (value: string, record:DataItem) => record.method.startsWith(value)
  },
  {
    title:'请求路径',
    dataIndex:'url'
  },
  {
    title:'请求参数',
    dataIndex:'requestBody'
  },
  {
    title:'状态',
    dataIndex:'status',
    filters:[
        {
          text:'成功',
          value:'成功'
        },
        {
          text:'失败',
          value:'失败'
        }
    ],
    onFilter: (value: string, record:DataItem) => record.status.startsWith(value)
  },
];
interface DataItem {
  timestamp: any;
  user: string;
  method: string;
  url: string;
  requestBody:string;
  status: string;
}
const data: DataItem[] = [];

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

const loading = ref(false);

onMounted(async ()=>{
  loading.value = true
  let res = await getLog();
  if(res.data.code === 200){
    dataSource.value = res.data.data;
    dataSource.value.map(item=>{
      if(item.user==='undefined') item.user = '未知用户';
      if(item.requestBody==='{}') item.requestBody = '/';
    })
    loading.value = false;
  }
})
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>