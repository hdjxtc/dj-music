import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 登录状态
		loginstatu: false,
		// 用户信息
		userinfo: null,
		// 播放列表
		playlist: [],
		// 播放索引
		currentindex: -1,
		// 播放状态
		playing: false,
	},
	getters: {
		// 获取登录状态
		loginStatu(state){
			return state.loginstatu || JSON.parse(window.localStorage.getItem('loginStatu'))
		},
		// 获取登录用户信息
		userInfo(state){
			return state.userinfo ||  JSON.parse(window.localStorage.getItem('userInfo'))
		},
		// 获取播放列表
		playList(state) {
			// console.log('播放列表',state.playlist)
			return state.playlist
		},
		// 获取前播放歌曲
		currentSong(state) {
			// console.log('当前播放',state.playlist[state.currentindex])
			return state.playlist[state.currentindex] || {}
		},
		// 获取当前播放歌曲索引
		currentIndex(state) {
			return state.currentindex
		},
		// 获取播放状态
		currentPlaying(state){
			return state.playing
		}

	},
	mutations: {
		// 更改登录状态
		upStatu(state,statu){
			state.loginstatu = statu
		},
		// 更改登录用户信息
		upUserinfo(state,info){
			state.userinfo = info
		},
		// 更改歌曲信息
		upplayList(state, list) {
			state.playlist = list
		},
		// 更改播放索引
		upcurrentIndex(state, index) {
			// console.log(index)
			state.currentindex = index
		},
		// 更改播放状态
		upplaYing(state,flag){
			state.playing = flag
		}
	},
	actions: {
		// 选中播放歌曲
		selectPlay({commit}, {list,index}) {
			// console.log(context)
			// console.log(list)
			// console.log(index)
			commit('upplayList',list)
			commit('upcurrentIndex',index)
			commit('upplaYing',true)
		},
		
	},
	modules: {}
})
