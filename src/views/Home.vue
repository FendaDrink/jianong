<template>
  <a-layout style="height: 100vh;width: auto">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <span v-if="!collapsed" style="white-space:nowrap;">嘉农管理系统</span>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="handleClick">
        <a-menu-item key="/public">
          <BarsOutlined />
          <span>生产线信息</span>
        </a-menu-item>
        <a-menu-item key="/enterprise">
          <video-camera-outlined />
          <span>公司系统</span>
        </a-menu-item>
        <a-menu-item key="/production">
          <BgColorsOutlined />
          <span>生产基地系统</span>
        </a-menu-item>
        <a-menu-item key="/wholesale">
          <CarOutlined />
          <span>批发中心系统</span>
        </a-menu-item>
        <a-menu-item key="/purchasing">
          <FileOutlined />
          <span>代购点系统</span>
        </a-menu-item>
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
import {useUserInfoStore} from "@/stores/userInfo";
import {removeToken} from "@/request/auth";
import {message} from "ant-design-vue";
const userInfoStore = useUserInfoStore();
const username = localStorage.getItem('planning-system-username');
const handleClick = async (e : any) => {
  selectedKeys.value = [e.key];
  await router.push(e.key);
};

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