import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
<<<<<<< HEAD
import Ranking from '../views/ranking.vue'
import Playlist from '../views/playlist.vue'
import Singer from '../views/singer.vue'
import Video from '../views/video.vue'
import Mv from '../views/mv.vue'
import Err from '../views/404.vue'
import Searchpage from '../views/searchpage.vue'
import Login from '../views/login.vue'
import Personalpage from '../views/personalpage.vue'
import Singerdetail from '../views/singerdetail.vue'
import Albumdetail from '../views/albumdetail.vue'
import Videodetail from '../views/videodetail.vue'
import Mvdetail from '../views/mvdetail.vue'
import Playlistdetail from '../views/playlistdetail.vue'
=======
import Paihang from '../views/paihang.vue'
import Gedan from '../views/gedan.vue'
import Geshou from '../views/geshou.vue'
import Shiping from '../views/shiping.vue'
import Mv from '../views/mv.vue'
import Err from '../views/404.vue'
import Searchlist from '../views/searchlist.vue'
import Login from '../views/login.vue'
import Personal from '../views/personal.vue'
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de

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
<<<<<<< HEAD
		component: Home,
		// 懒加载
		// component: () => import('@/views/home')
		// component: resolve => require(['@/views/home'], resolve)
	},
	// 排行
	{
		path: '/ranking',
		name: 'ranking',
		// component: () => import('@/views/ranking')
		component: Ranking,
	},
	// 歌单
	{
		path: '/playlist',
		name: 'playlist',
		// component: () => import('@/views/playlist')
		component: Playlist,
	},
	// 歌手
	{
		path: '/singer',
		name: 'singer',
		// component: () => import('@/views/singer')
		component: Singer,
	},
	// 视频
	{
		path: '/video',
		name: 'video',
		// component: () => import('@/views/video')
		component: Video,
=======
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
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	},
	// mv
	{
		path: '/mv',
		name: 'mv',
<<<<<<< HEAD
		// component: () => import('@/views/mv')
		component: Mv,
=======
		component: Mv
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	},
	// 搜索
	{
		path: '/search',
		name: 'search',
<<<<<<< HEAD
		// component: () => import('@/views/searchpage')
		component: Searchpage,
=======
		component: Searchlist
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	},
	// 登录
	{
		path: '/login',
		name: 'login',
		meta: {
			isLogin: true
		},
<<<<<<< HEAD
		// component: () => import('@/views/login')
		component: Login,
	},
	// 个人主页
	{
		path: '/personalpage',
		name: 'personalpage',
		// component: () => import('@/views/personalpage')
		component: Personalpage,
	},
	// 歌手个人详情页
	{
		path: '/singerdetail',
		name: 'singerdetail',
		// component: () => import('@/views/singerdetail')
		component: Singerdetail,
	},
	// 专辑详情页
	{
		path: '/albumdetail',
		name: 'albumdetail',
		// component: () => import('@/views/albumdetail')
		component: Albumdetail,
	},
	// 视频详情页
	{
		path: '/videodetail',
		name: 'videodetail',
		// component: () => import('@/views/videodetail')
		component: Videodetail,
	},
	// mv详情页
	{
		path: '/mvdetail',
		name: 'mvdetail',
		// component: () => import('@/views/mvdetail')
		component: Mvdetail,
	},
	// 歌单详情页
	{
		path: '/playlistdetail',
		name: 'playlistdetail',
		// component: () => import('@/views/playlistdetail')
		component: Playlistdetail,
=======
		component: Login
	},
	// 个人主页
	{
		path: '/personal',
		name: 'personal',
		component: Personal
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	},
	// 匹配错误页
	{
		path: '*',
		name: '404',
<<<<<<< HEAD
		// component: () => import('@/views/404')
		component: Err,
=======
		component: Err
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	},
]

const router = new VueRouter({
	// mode: 'history',
	routes,
})

export default router
