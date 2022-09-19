//axios的二次封装
import axios, { AxiosInstance } from "axios"
const request: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
    withCredentials: true
});
//请求拦截器
request.interceptors.request.use((config) => {
    return config;
}, err => {
    return Promise.reject(new Error(err));
});
//响应拦截器
request.interceptors.response.use(res => {
    return res.data;
}, err => {
    return Promise.reject(new Error(err));
})

export default request;


