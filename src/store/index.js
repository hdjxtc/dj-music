import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 播放列表
		playlist: [],
		// 播放索引
		currentindex: -1,
		// 播放状态
		playing: false,
	},
	getters: {
		// 获取播放列表
		playList(state) {
			return state.playlist
		},
		// 获取前播放歌曲
		currentSong(state) {
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
		// 更改歌曲信息
		addplayList(state, list) {
			state.playlist = list
		},
		// 更改播放索引
		addcurrentIndex(state, index) {
			state.currentindex = index
		},
		// 更改播放状态
		plaYing(state,flag){
			state.playing = flag
		}
	},
	actions: {
		// 选中播放歌曲
		selectPlay({commit}, {list,index}) {
			// console.log(context)
			// console.log(list)
			// console.log(index)
			commit('addplayList',list)
			commit('addcurrentIndex',index)
			commit('plaYing',true)
		},
		
	},
	modules: {}
})
