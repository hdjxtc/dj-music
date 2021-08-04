import axios from 'axios'
<<<<<<< HEAD
import store from '@/store'
// import router from '@/router'
import {Message} from 'element-ui'
import config from './config'
const {
	api_base_url
} = config

let api = axios.create({
	timeout: 1000 * 10,
	baseURL: api_base_url
})


// 跨域请求时是否携带凭据 cookie,视频、评论等接口需要用到cookie
api.defaults.withCredentials = true

=======
import router from '@/router'
import {Message} from 'element-ui'
import config from './config'
const {api_base_url} = config

let api = axios.create({
	timeout: 1000 * 8,
	baseURL: api_base_url
})

>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
// 请求拦截器
api.interceptors.request.use(
	config => {
		return config
	},
	error => {
<<<<<<< HEAD
		Message.error(error)
=======
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
		console.log(error)
	},
)

// 响应拦截器即异常处理
api.interceptors.response.use(response => {
	let data = response.data
	let status = response.status
<<<<<<< HEAD
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
=======
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
		message: '请求超时!'
	});
	console.log(error)
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
})

export default api
