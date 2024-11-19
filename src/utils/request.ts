import axios from 'axios';
import {getToken, removeToken} from "@/request/auth";
import {message} from "ant-design-vue";

// 拦截器哨兵
let hasShownNotification = false;

// 配置默认请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    baseURL: 'http://192.168.119.193:3000',
    timeout:10000,
});

service.interceptors.request.use(
    config => {
        const token = getToken()
        if (token){
            config.headers['Authorization'] = token;
            config.headers['Username'] = encodeURIComponent(<string>localStorage.getItem('planning-system-username'));
        }
        return config;

    },
    error => Promise.reject(error)
);

service.interceptors.response.use(
    res => {

        if(res.data.code === 200) return res;

        return Promise.reject(res.data);
    },
    async (err) => {
        if (err.response) {
            let timer:any;
            if(err.response.data.code === 405 && !hasShownNotification){
                message.error({
                    content: err.response.data.msg,
                    duration:1.5
                }).then(res=>{
                    removeToken()
                    window.location.pathname = '/login'
                })
                hasShownNotification = true;

                timer = setTimeout(()=>{
                    hasShownNotification = false;
                },1000)
                clearTimeout(timer);
            }
        } else {
            message.error('网络错误或服务器异常');
        }
        return Promise.reject(err);
    }
);

export default service;