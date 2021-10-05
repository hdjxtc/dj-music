import axios from 'axios'
import store from '@/store'
// import router from '@/router'
import {Message} from 'element-ui'
import config from './config'
const {api_base_url} = config

let api = axios.create({
	timeout: 1000 * 10,
	baseURL: api_base_url
})

// 跨域请求时是否携带凭据 cookie,视频、评论等接口需要用到cookie
api.defaults.withCredentials = true

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
	if (status === 200) {
		return data
	}
}, error => {
	console.log(error)
	// console.log(error.response)
	if (error.response.status) {
		let status = error.response.status
		if (status === 301) {
			if (store.state.loginstatu == null) {
				Message.warning({
					message: '请先登录！',
					duration: 2000
				})
			} else {
				Message.warning({
					message: '授权已过期，请重新登录！',
					duration: 2000
				})
				// 清除登录信息，重新登录
				window.localStorage.clear()
				this.handle.clearCookie()
				this.$store.commit('upStatu', false)
				this.$store.commit('upUserinfo', null)
			}
			// router.replace({
			// 	path: '/login'
			// })
			return
		} else if (status === 444) {
			Message.error({
				message: '该资源不允许评论！',
				duration: 2000
			})
			return
		}
	}
	// else {
	// 	Message.error({
	// 		message: '请求错误!',
	// 		duration: 2000
	// 	})
	// 	return
	// }
})

export default api
