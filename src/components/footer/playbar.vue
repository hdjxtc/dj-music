<template>
	<transition name="fade">
		<div class="shadow flex-row" v-show="playList.length > 0">
			<!-- 歌曲封面 -->
			<div class="avatar">
				<img :src="currentSong.image" alt="dj-music" />
			</div>
			<!-- 歌曲信息 -->
			<div class="info">
				<h2 class="ellipsis">{{ currentSong.name }}</h2>
				<p class="ellipsis">{{ currentSong.singer }}</p>
			</div>
			<!-- 播放前进后退 -->
			<div class="player-btn">
				<i class="iconfont icon-prev dj-icon-shangyiqu"></i>
				<i class="iconfont dj-icon-zanting"></i>
				<i class="iconfont icon-next dj-icon-xiayiqu"></i>
			</div>
			<!-- 进度条 -->
			<div class="progress-wrap" id="progress-wrap">
				<p class="current-time">{{ formatTime(currentTime) }}</p>
				<el-slider v-model="musicduration" :max="totalduration" :show-tooltip="false"></el-slider>
				<p class="duration-time">
					{{ formatTime(currentSong.duration) }}
				</p>
			</div>
			<!-- 音量条 -->
			<div class="volume-wrap">
				<i class="iconfont dj-icon-yinliang"></i>
				<div class="progress-bar">
					<el-slider v-model="volumeNum" style="width: 100%;" class="bar-inner"></el-slider>
				</div>
			</div>
			<!-- 工具栏 -->
			<div class="tool">
				<i class="iconfont dj-icon-geci"></i>
				<i class="iconfont"></i>
				<i class="iconfont dj-icon-bofangduilie"></i>
			</div>
			<audio ref="audio" :src="currentSong.url"></audio>
		</div>
	</transition>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	// 循环模式
	// import {playMode} from '@/common/playConfig'
	// 歌词
	// import Lyric from 'lyric-parser'
	export default {
		name: 'playbar',
		data() {
			return {
				// 进度条左边时间
				currentTime: 0,
				// 进度条默认值
				musicduration: 0,
				// 进度条最大值
				totalduration: 0,
				// 音量条默认值
				volumeNum: 50,
			}
		},
		computed: {
			...mapGetters([
				'playList',
				'currentSong',
				'currentPlaying'
			])
		},
		watch: {
			// 监听播放歌曲信息,切歌操作
			currentSong(newsong, oldsong) {
				if (!newsong.id || !newsong.url || newsong.id === oldsong.id) {
					return
				}
				// 改变DOM数据后执行的延迟回调$nextTick
				this.$nextTick(() => {
					const audio = this.$refs.audio
					if (audio) {
						audio.src = newsong.url
						audio.play()
					}
				})
				// 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.songReady = true
				}, 5000)
			},
			// 监听播放歌曲状态
			currentPlaying(isPlaying) {
				// 改变DOM数据后执行的延迟回调$nextTick
				this.$nextTick(() => {
					const audio = this.$refs.audio
					if (audio) {
						isPlaying ? audio.play() : audio.pause()
					}
				})
			}
		},
		methods: {
			// 格式化时间
			formatTime(interval) {
				// 取整
				interval = interval | 0
				const m = (interval / 60) | 0
				const s = interval % 60
				return `${this.handle.addZero(m, 2)}:${this.handle.addZero(s, 2)}`
			},
		}
		// computed: {
		// 	// 播放暂停按钮
		// 	playIcon() {
		// 		return this.playing ? 'dj-icon-zanting' : 'dj-icon-bofang'
		// 	},
		// 	// 播放模式
		// 	modeIcon() {
		// 		return this.mode === playMode.sequence ?
		// 			'dj-icon-liebiaoxunhuan' :
		// 			this.mode === playMode.loop ?
		// 			'dj-icon-danquxunhuan' :
		// 			'dj-icon-suijibofang'
		// 	},
		// 	// 是否静音
		// 	mutedIcon() {
		// 		return this.isMuted ? 'dj-icon-jingyin' : 'dj-icon-yinliang'
		// 	},
		// 	// 进度条
		// 	percent() {
		// 		return this.currentTime / this.currentSong.duration
		// 	},
		// 	...mapGetters([
		// 		'playList',
		// 		'currentSong',
		// 		'playing',
		// 		'currentIndex',
		// 		'mode',
		// 		'sequenceList',
		// 		'historyList'
		// 	])
		// },
		// watch: {
		// 	// 监听歌曲内容变化
		// 	currentSong(newSong, oldSong) {
		// 		if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
		// 			return
		// 		}
		// 		this.songReady = false
		// 		this.canLyricPlay = false
		// 		if (this.currentLyric) {
		// 			this.currentLyric.stop()
		// 			// 重置为null
		// 			this.currentLyric = null
		// 			this.currentTime = 0
		// 			this.playingLyric = ''
		// 			this.currentLyricNum = 0
		// 		}
		// 		this.$nextTick(() => {
		// 			const audio = this.$refs.audio
		// 			if (audio) {
		// 				audio.src = newSong.url
		// 				audio.volume = this.volume
		// 				audio.play()
		// 				this.saveHistoryList(newSong)
		// 				this.id = newSong.id
		// 			}
		// 		})
		// 		// 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
		// 		clearTimeout(this.timer)
		// 		this.timer = setTimeout(() => {
		// 			this.songReady = true
		// 		}, 5000)
		// 		this.getLyric(newSong.id)
		// 	},
		// 	// 监听播放状态
		// 	playing(isPlaying) {
		// 		if (!this.songReady) {
		// 			return
		// 		}
		// 		this.$nextTick(() => {
		// 			const audio = this.$refs.audio
		// 			if (audio) {
		// 				isPlaying ? audio.play() : audio.pause()
		// 			}
		// 		})
		// 	}
		// },
		// methods: {
		// 	// 清空历史播放列表
		// 	clearHistory() {
		// 		this.clearHistoryList()
		// 	},
		// 	// 移除最近播放单曲
		// 	deleteHistoryItem(item, index) {
		// 		console.log(item, index)
		// 		this.deleteHistoryList(item)
		// 	},
		// 	// 播放歌曲
		// 	playSong(item, index) {
		// 		this.selectPlay({
		// 			list: this.historyList,
		// 			index
		// 		})
		// 	},
		// 	// 停止播放歌曲
		// 	pauseSong() {
		// 		this.pausePlay()
		// 	},
		// 	// 展开播放列表
		// 	openPlaylist() {
		// 		this.showLyric = false
		// 		if (this.showPlaylist) {
		// 			this.showPlaylist = false
		// 		} else {
		// 			this.showPlaylist = true
		// 		}
		// 	},
		// 	// 控制静音
		// 	changeMuted() {
		// 		if (this.isMuted) {
		// 			this.isMuted = false
		// 			this.$refs.audio.muted = false
		// 		} else {
		// 			this.isMuted = true
		// 			this.$refs.audio.muted = true
		// 		}
		// 	},
		// 	// 改变音量
		// 	changeVolume(e) {
		// 		this.volume = e / 100
		// 		this.$refs.audio.volume = e / 100
		// 	},
		// 	// 展开歌词
		// 	openLyric() {
		// 		this.showPlaylist = false
		// 		if (this.showLyric) {
		// 			this.showLyric = false
		// 		} else {
		// 			this.showLyric = true
		// 		}
		// 	},
		// 	closeLyric() {
		// 		this.showLyric = false
		// 	},
		// 	// 获取歌词
		// 	async getLyric(id) {
		// 		try {
		// 			let res = await this.$api.getLyric(id)
		// 			if (res.code === 200) {
		// 				let lyric = res.lrc.lyric
		// 				this.currentLyric = new Lyric(lyric, this.lyricHandle)
		// 				if (this.isPureMusic) {
		// 					const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
		// 					this.pureMusicLyric = this.currentLyric.lrc
		// 						.replace(timeExp, '')
		// 						.trim()
		// 					this.playingLyric = this.pureMusicLyric
		// 				} else {
		// 					if (this.playing && this.canLyricPlay) {
		// 						this.currentLyric.seek(this.currentTime * 1000)
		// 					}
		// 					console.log(this.currentLyric)
		// 				}
		// 			}
		// 		} catch (error) {
		// 			this.currentLyric = null
		// 			this.playingLyric = ''
		// 			this.currentLyricNum = 0
		// 		}
		// 	},
		// 	// 歌词回调
		// 	lyricHandle({
		// 		lineNum,
		// 		txt
		// 	}) {
		// 		if (!this.$refs.lyricLine) {
		// 			return
		// 		}
		// 		this.currentLyricNum = lineNum
		// 		if (lineNum > 10) {
		// 			let lineEl = this.$refs.lyricLine[lineNum - 10]
		// 			if (this.$refs.lyricList) {
		// 				this.$nextTick(() => {
		// 					this.$refs.lyricList.scrollToElement(lineEl, 1000)
		// 				})
		// 			}
		// 		} else {
		// 			if (this.$refs.lyricList) {
		// 				this.$nextTick(() => {
		// 					this.$refs.lyricList.scrollTo(0, 0, 1000)
		// 				})
		// 			}
		// 		}
		// 		this.playingLyric = txt
		// 	},
		// 	// 点击播放暂停
		// 	togglePlaying() {
		// 		if (!this.songReady) {
		// 			return
		// 		}
		// 		this.setPlayingState(!this.playing)
		// 		if (this.currentLyric) {
		// 			this.currentLyric.togglePlay()
		// 		}
		// 	},
		// 	// 上一首
		// 	prevSong() {
		// 		if (!this.songReady) {
		// 			return
		// 		}
		// 		if (this.playList.length === 1) {
		// 			this.loopSong()
		// 			return
		// 		} else {
		// 			let index = this.currentIndex - 1
		// 			if (index === -1) {
		// 				index = this.playList.length - 1
		// 			}
		// 			this.setCurrentIndex(index)
		// 			if (!this.playing) {
		// 				this.togglePlaying()
		// 			}
		// 		}
		// 	},
		// 	// 下一首
		// 	nextSong() {
		// 		if (!this.songReady) {
		// 			return
		// 		}
		// 		if (this.playList.length === 1) {
		// 			this.loopSong()
		// 			return
		// 		} else {
		// 			let index = this.currentIndex + 1
		// 			if (index === this.playList.length) {
		// 				index = 0
		// 			}
		// 			this.setCurrentIndex(index)
		// 			if (!this.playing) {
		// 				this.togglePlaying()
		// 			}
		// 		}
		// 	},
		// 	// 单曲循环播放
		// 	loopSong() {
		// 		this.$refs.audio.currentTime = 0
		// 		this.$refs.audio.play()
		// 		this.setPlayingState(true)
		// 		if (this.currentLyric) {
		// 			this.currentLyric.seek(0)
		// 		}
		// 	},
		// 	// 播放准备完成
		// 	audioReady() {
		// 		clearTimeout(this.timer)
		// 		this.songReady = true
		// 		this.canLyricPlay = true
		// 		if (this.currentLyric && !this.isPureMusic) {
		// 			this.currentLyric.seek(this.currentTime * 1000)
		// 		}
		// 	},
		// 	// 歌曲错误
		// 	audioError() {
		// 		clearTimeout(this.timer)
		// 		this.songReady = true
		// 	},
		// 	// 歌曲暂停
		// 	audioPaused() {
		// 		this.setPlayingState(false)
		// 		if (this.currentLyric) {
		// 			this.currentLyric.stop()
		// 		}
		// 	},
		// 	// 歌曲播放完成
		// 	audioEnd() {
		// 		this.currentTime = 0
		// 		if (this.mode === playMode.loop) {
		// 			this.loopSong()
		// 		} else {
		// 			this.nextSong()
		// 		}
		// 	},
		// 	// 监听播放时间改变
		// 	updateTime(e) {
		// 		this.currentTime = e.target.currentTime
		// 	},
		// 	// 进度条拖动改变播放进度
		// 	onPercentBarChange(percent) {
		// 		const currentTime = this.currentSong.duration * percent
		// 		this.currentTime = this.$refs.audio.currentTime = currentTime
		// 		if (this.currentLyric) {
		// 			this.currentLyric.seek(currentTime * 1000)
		// 		}
		// 		if (!this.playing) {
		// 			this.togglePlaying()
		// 		}
		// 	},
		// 	// 切换播放模式
		// 	changeMode() {
		// 		const mode = (this.mode + 1) % 3
		// 		this.setPlayMode(mode)
		// 		let list = null
		// 		if (mode === playMode.random) {
		// 			list = this.utils.shuffle(this.sequenceList)
		// 		} else {
		// 			list = this.sequenceList
		// 		}
		// 		this.resetCurrentIndex(list)
		// 		this.setPlayList(list)
		// 	},
		// 	// 重置当前播放歌曲序号
		// 	resetCurrentIndex(list) {
		// 		let index = list.findIndex(item => {
		// 			return item.id === this.currentSong.id
		// 		})
		// 		this.setCurrentIndex(index)
		// 	},
		// 	// 格式化时间
		// 	formatTime(interval) {
		// 		interval = interval | 0
		// 		const m = (interval / 60) | 0
		// 		const s = interval % 60
		// 		return `${this.utils.formatZero(m, 2)}:${this.utils.formatZero(s, 2)}`
		// 	},
		// 	...mapMutations({
		// 		setPlayingState: 'SET_PLAYING_STATE',
		// 		setCurrentIndex: 'SET_CURRENT_INDEX',
		// 		setPlayMode: 'SET_PLAY_MODE',
		// 		setPlayList: 'SET_PLAYLIST'
		// 	}),
		// 	...mapActions([
		// 		'saveHistoryList',
		// 		'deleteHistoryList',
		// 		'clearHistoryList',
		// 		'selectPlay',
		// 		'pausePlay'
		// 	])
		// },
		// created() {},
		// mounted() {
		// 	console.log(this.historyList)
		// }
	}
</script>

<style scoped>
	.fade-enter {
		opacity: 0;
		transform: translate3d(0, 30px, 0);
	}

	.fade-enter-active {
		transition: all 0.5s;
	}

	.fade-leave-to {
		opacity: 0;
		transform: translate3d(0, 30px, 0);
	}

	.fade-leave-active {
		transition: all 0.5s;
	}

	.flex-row .avatar{
		
	}
</style>
