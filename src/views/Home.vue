<template>
  <a-layout style="height: 800px;overfolow: auto;width: auto">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <span v-if="!collapsed" style="white-space:nowrap;">嘉农管理系统</span>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" :openKeys="openKeys" theme="dark" mode="inline" :inline-collapsed="collapsed" @click="handleClick" @openChange="handleOpenChange">
        <a-sub-menu key="/enterprise">
          <template #title><span><BarsOutlined /><span>公司系统</span></span></template>
          <a-menu-item key="/enterprise/productInfo">
            产品信息
          </a-menu-item>
          <a-menu-item key="/enterprise/acquisition">
            产品收购
          </a-menu-item>
          <a-menu-item key="/enterprise/sale">
            产品销售
          </a-menu-item>
          <a-menu-item key="/enterprise/inOutBound">
            物资出/入库
          </a-menu-item>
          <a-menu-item key="/enterprise/inventory">
            公司物资盘点
          </a-menu-item>
          <a-menu-item key="/enterprise/planning">
            生产计划制定
          </a-menu-item>
        </a-sub-menu>

         <a-sub-menu key="/wholesale">
          <template #title><span><CarOutlined /><span>批发中心系统</span></span></template>
           <a-menu-item key="/wholesale/customer">
             顾客信息
            </a-menu-item>
           <a-menu-item key="/wholesale/inBound">
            批发中心产品入库
          </a-menu-item>
            <a-menu-item key="/wholesale/productInfo">
            批发中心产品信息
          </a-menu-item>
           <a-menu-item key="/wholesale/sale">
            批发中心产品销售
          </a-menu-item>
           <a-menu-item key="/wholesale/inStock">
            批发中心产品库存
          </a-menu-item>
           <a-menu-item key="/wholesale/inventory">
            批发中心产品盘点
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="/production">
          <template #title><span><BgColorsOutlined /><span>生产基地系统</span></span></template>
           <a-menu-item key="/production/planning">
            生产计划查询
          </a-menu-item>
          <a-menu-item key="/production/inStock">
            生产基地产品库存
          </a-menu-item>
           <a-menu-item key="/production/productInventory">
            生产基地产品盘点
          </a-menu-item>
          <a-menu-item key="/production/accessProduct">
            生产基地产品出/入库
          </a-menu-item>
          <a-menu-item key="/production/accessInventory">
            生产基地物资出/入库
          </a-menu-item>
          <a-menu-item key="/production/checkInventory">
            生产基地物资库存查询
          </a-menu-item>
          <a-menu-item key="/production/takeStock">
            生产基地物资盘点
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="/purchasing" titleClick="handleTitleClick">
          <template #title><span><BgColorsOutlined /><span>代购点系统</span></span></template>
           <a-menu-item key="/purchasing/farmerInfo">
            农户信息
          </a-menu-item>
          <a-menu-item key="/purchasing/accessProduct">
            产品出库
          </a-menu-item>
           <a-menu-item key="/purchasing/acquireProduct">
            产品收购
          </a-menu-item>
           <a-menu-item key="/purchasing/queryProduct">
            产品库存查询
          </a-menu-item>
          <a-menu-item key="/purchasing/inventoryConsign">
            代购点产品盘点
          </a-menu-item>
           <a-menu-item key="/purchasing/accessInventory">
            代购点物资出/入库
          </a-menu-item>
           <a-menu-item key="/purchasing/checkInventory">
            代购点物资库存查询
          </a-menu-item>
          <a-menu-item key="/purchasing/takeStock">
            代购点物资盘点
          </a-menu-item>
          <a-menu-item key="/purchasing/project">
            生产计划查询
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="/log">
          <FileOutlined />
          <span>操作日志</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding-left: 20px">
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <a-button type="primary" danger ghost style="float: right;margin: 16px 40px;" @click="confirm">退出系统</a-button>
        <span style="float: right;font-size: 18px">{{ username }}，你好</span>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view ></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {ref, createVNode, watch} from 'vue';
import {
  BarsOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  CarOutlined,
  BgColorsOutlined
} from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const route = useRoute();
const currentPath = ref<string>(route.path);
const selectedKeys = ref<string[]>([currentPath.value]);
const isLoginOutOpen = ref<boolean>(false);
const collapsed = ref<boolean>(false);
const openKeys = ref<string[]>(['/'+currentPath.value.split('/')[1]])
import {useUserInfoStore} from "@/stores/userInfo";
import {removeToken} from "@/request/auth";
import {message} from "ant-design-vue";
const userInfoStore = useUserInfoStore();
const username = localStorage.getItem('planning-system-username');
const handleClick = async ({key, keyPath}: any) => {
  selectedKeys.value = [key];
  await router.push(key);
  openKeys.value = [keyPath[0]]
};

const handleOpenChange = (keys: string []) => {
  openKeys.value = [keys.pop() as any]
}
const confirm = () => {
  Modal.confirm({
    title: '退出',
    icon: createVNode(ExclamationCircleOutlined),
    content: '是否确认退出系统',
    okText: '确认',
    cancelText: '取消',
    onOk:()=>exitLogin()
  })
};

const exitLogin = async ()=> {
  removeToken();
  userInfoStore.username = '';
  isLoginOutOpen.value = false;
  await router.push('/login').then(res=>{
    message.success('退出成功')
  });
}

</script>
<style scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  margin: 16px;
  span{
    font-size: 24px;
    color:white;
  }
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>