import axios from 'axios'
import router from '@/router'
import {Message} from 'element-ui'
import config from './config'
const {api_base_url} = config

let api = axios.create({
	timeout: 1000 * 8,
	baseURL: api_base_url
})

// 请求拦截器
api.interceptors.request.use(
	config => {
		return config
	},
	error => {
		Message.error(error)
		console.log(error)
	},
)

// 响应拦截器即异常处理
api.interceptors.response.use(response => {
	let data = response.data
	let status = response.status
	// console.log('响应拦截器',status)
	if (status === 200) {
		return data
	} else if (status === 301) {
		Message.warning({
			message: '请先登录!',
			duration: 2000
		})
		router.replace({
			path: '/login'
		})
		return
	} else {
		Message.error({
			message: '请求错误!',
			duration: 2000
		})
		router.replace({
			path: '/err'
		})
		return
	}
}, error => {
	Message.error({
		message: '当前网络不佳，请重试!'
	});
	// console.log(error)
})

export default api
