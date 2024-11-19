<template>
  <div class="wrapper">
    <div class="inner">
        <div class="form-inner">
          <div class="title">嘉农管理系统</div>
          <a-form
              :model="formState"
              name="basic"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
              class="form-content"
          >
            <a-form-item
                label="账号"
                name="username"
                :rules="[{ required: true, message: '请输入账号' }]"
            >
              <a-input v-model:value="formState.username" placeholder="请输入账号" />
            </a-form-item>

            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '请输入密码' }]"
            >
              <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
            </a-form-item>

            <a-form-item style="width:60px;margin: 0 auto;">
              <a-button type="primary" html-type="submit" @click="handleClick">登录</a-button>
            </a-form-item>
          </a-form>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive} from 'vue';
import { useRouter } from "vue-router";
import {login} from "@/request/api";
import {message} from "ant-design-vue";
import {setToken} from "@/request/auth";
import {useUserInfoStore} from "@/stores/userInfo";

const userInfoStore = useUserInfoStore();
const router = useRouter();

interface FormState {
  username: string;
  password: string;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
});

const onFinish = () => {
  console.log('Success:');
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const handleClick = async () => {
  if(formState.username && formState.password){
    try{
      let res = await login(formState);
      if(res.data.code === 200){
        setToken(<string>res.data.data!.token,<string>res.data.data!.username);
        userInfoStore.isTokenExpired = false;
        await router.push('/');
        message.success('登录成功');
      }
    }catch (error: any){
      message.error(error.response.data.msg);
    }
  }
  return;
}

</script>

<style>
body{
  background: url("@/assets/background.png") center;
}
</style>

<style lang="scss" scoped>
    .wrapper {
      width: 800px;
      height: 600px;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      justify-self: center;

      .inner{
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(1.18);
        .form-inner{
          border-radius: 5px;
          box-shadow:10px 10px 5px rgba(0,0,0,.3);
          background-color: rgba(238, 238, 238, 0.6);
          width: 400px;
          height: 280px;
          .title{
            font-size: 28px;
            vertical-align: center;
            text-align: center;
            line-height: 28px;
            user-select: none;
            margin: 20px auto;
          }

          .form-content{
            width: 80%;
            margin: 50px auto;
          }
        }

      }
    }

</style>