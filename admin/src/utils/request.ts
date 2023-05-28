import axios from 'axios'
import { ElNotification } from 'element-plus'
import { Session } from './storage'
import { router } from '~/modules/router'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/blog',
  timeout: 10000,
  withCredentials: true,
  validateStatus: status => status >= 200 && status <= 500,
})

// 请求拦截
request.interceptors.request.use(
  (config) => {
    // 让每个请求携带token
    const token = Session.get('user')?.userInfo?.access_token
    if (token) config.headers!.Authorization = `bearer ${token}`
    return config
  },
  error => Promise.reject(error),
)

// 响应 拦截
request.interceptors.response.use(
  (response) => {
    // 获取状态码
    const status = response.data.status || response.status

    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
      // 获取错误信息
      const describe = response.data.describe
      let message = ''
      if (describe) {
        if (typeof describe === 'string') {
          message = describe
        }
        else if (typeof describe.message === 'string') {
          message = describe.message
        }
        else {
          message = `${status}: ${describe.message.join(',')}` || `${status}: ${response.statusText}` || '未知错误'
        }
      }
      else {
        message = `${status}: ${response.data.message}`
      }

      // 401 则跳转到401页面
      if (status === 401) router.replace('/401')
      else ElNotification.error(message)
      return Promise.reject(message)
    }
    return response
  },
  (error) => {
    if (error.message.includes('timeout')) ElNotification.error('网络超时！')
    else if (error.message.includes('Network Error')) ElNotification.error('网络连接错误！')
    else ElNotification.error(error.message)
    return Promise.reject(error)
  },
)

export default request
