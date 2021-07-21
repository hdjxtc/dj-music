import Vue from 'vue'
import Vuex from 'vuex'
// 存储store到本地存储
import createPersistedState from 'vuex-persistedstate'
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
		// 播放模式
		mode: 0,
		// 移动端，是否打开侧边栏
		isdrawer: false
	},
	getters: {
		// 获取登录状态
		loginStatu(state) {
			return state.loginstatu || JSON.parse(window.localStorage.getItem('loginStatu'))
		},
		// 获取登录用户信息
		userInfo(state) {
			return state.userinfo || JSON.parse(window.localStorage.getItem('userInfo'))
		},

		// 获取播放列表
		playList(state) {
			return state.playlist || {}
		},
		// 获取前播放歌曲
		currentSong(state) {
			// console.log(state.playlist[state.currentindex])
			return state.playlist[state.currentindex] || {}
		},
		// 获取当前播放歌曲索引
		currentIndex(state) {
			return state.currentindex
		},
		// 获取播放状态
		currentPlaying(state) {
			return state.playing
		},
		// 获取播放模式
		currentMod(state) {
			return state.mode
		},
		// 获取侧边栏状态
		isDrawer(state){
			return state.isdrawer
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
			let isrepeat = true
			// 判断当前点击播放的歌曲在歌曲信息里有没有
			state.playlist.map((item, index) => {
				if (item.id == list.id) {
					isrepeat = false
					// 当播放地址失效时更新地址
					state.playlist[index].url = list.url
					state.currentindex = index
				}
			})
			if (isrepeat) {
				state.playlist.push(list)
				state.currentindex = state.playlist.length - 1
			}
		},
		// 更改播放状态
		upplaYing(state, flag) {
			state.playing = flag
		},
		// 更改播放歌曲下标
		upcurrentIndex(state, index) {
			state.currentindex = index
		},
		// 更换播放模式
		upplayMod(state, mode) {
			state.mode = mode
		},
		// 清除播放列表
		clearPlaylist(state) {
			let currentSong = state.playlist[state.currentindex]
			state.playlist = [currentSong]
			state.currentindex = state.playlist.length - 1
		},
		// 删除播放列表某一项
		deletePlaylist(state, index) {
			if (index < state.currentindex) {
				state.currentindex = state.currentindex - 1
			}
			// 如果正在播放的是并且删掉的是最后一个
			if (state.currentindex == state.playlist.length - 1) {
				state.currentindex = 0
			}
			state.playlist.splice(index, 1)
		},
		// 更改侧边栏状态
		upisDrawer(state,flag) {
			state.isdrawer = flag
		},
	},
	actions: {
		// 选中播放歌曲
		selectPlay({commit}, {list,index}) {
			// console.log(context)
			// console.log(list)
			// console.log(index)
			commit('upplayList', list[index])
			commit('upplaYing', true)
		},
	},
	plugins: [
		createPersistedState({
			// 定义要存储的数据，不保持播放状态，让他每次初始化为false,即暂停状态
			reducer(val) {
				return {
					currentindex: val.currentindex,
					mode: val.mode,
					playlist: val.playlist
				}
			}
		})
	],
	modules: {}
})
