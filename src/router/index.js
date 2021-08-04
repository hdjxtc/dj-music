import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
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
	},
	// mv
	{
		path: '/mv',
		name: 'mv',
		// component: () => import('@/views/mv')
		component: Mv,
	},
	// 搜索
	{
		path: '/search',
		name: 'search',
		// component: () => import('@/views/searchpage')
		component: Searchpage,
	},
	// 登录
	{
		path: '/login',
		name: 'login',
		meta: {
			isLogin: true
		},
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
	},
	// 匹配错误页
	{
		path: '*',
		name: '404',
		// component: () => import('@/views/404')
		component: Err,
	},
]

const router = new VueRouter({
	// mode: 'history',
	routes,
})

export default router
