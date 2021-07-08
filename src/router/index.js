import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import Paihang from '../views/paihang.vue'
import Gedan from '../views/gedan.vue'
import Geshou from '../views/geshou.vue'
import Shiping from '../views/shiping.vue'
import Mv from '../views/mv.vue'
import Err from '../views/404.vue'
import Searchlist from '../views/searchlist.vue'
import Login from '../views/login.vue'
import Personal from '../views/personal.vue'

Vue.use(VueRouter)

const routes = [
	// 主页
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'home',
		component: Home
	},
	// 排行
	{
		path: '/paihang',
		name: 'paihang',
		component: Paihang
	},
	// 歌单
	{
		path: '/gedan',
		name: 'gedan',
		component: Gedan
	},
	// 歌手
	{
		path: '/geshou',
		name: 'geshou',
		component: Geshou
	},
	// 视频
	{
		path: '/shiping',
		name: 'shiping',
		component: Shiping
	},
	// mv
	{
		path: '/mv',
		name: 'mv',
		component: Mv
	},
	// 搜索
	{
		path: '/search',
		name: 'search',
		component: Searchlist
	},
	// 登录
	{
		path: '/login',
		name: 'login',
		meta: {
			isLogin: true
		},
		component: Login
	},
	// 个人主页
	{
		path: '/personal',
		name: 'personal',
		component: Personal
	},
	// 匹配错误页
	{
		path: '*',
		name: '404',
		component: Err
	},
]

const router = new VueRouter({
	// mode: 'history',
	routes,
})

export default router
