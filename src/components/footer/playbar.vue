<template>
	<transition name="fade">
		<div class="shadow flex-row" v-show="playList.length > 0">
			<!-- 歌曲封面 -->
			<div class="author" @click="playpage=true">
				<img :src="currentSong.image" alt="dj-music" class="shadow"/>
			</div>
			<!-- 歌曲信息 -->
			<div class="info">
				<h2 class="name">{{ currentSong.name }}</h2>
				<p class="singer">{{ currentSong.singer }}</p>
			</div>
			<!-- 播放前进后退 -->
			<div class="player-btn">
				<i class="iconfont dj-icon-shangyiqu icon-prev" @click="prevSong"></i>
				<i class="iconfont" :class="playIcon" @click="togglePlay"></i>
				<i class="iconfont dj-icon-xiayiqu icon-next" @click="nextSong"></i>
			</div>
			<!-- 进度条 -->
			<div class="progress-wrap hidden-hd" id="progress-wrap" @mousedown="isDrag = true"
				@mouseup="isDrag = false">
				<p class="current-time">{{ formatTime(currentTimes) }}</p>
				<el-slider v-model="currentTimes" :max="audioduration" :show-tooltip="false"
					style="width: 70%;margin-left: 1%;" @change="changeProgress"></el-slider>
				<p class="duration-time">
					{{formatTime(audioduration)}}
				</p>
			</div>
			<!-- 音量条 -->
			<div class="volume-wrap hidden-sm">
				<i class="iconfont" :class="mutedIcon" @click="changeMuted"></i>
				<el-slider v-model="volumeNum" style="width: 100%;margin-left: 3%;" @change="changeVolume"></el-slider>
			</div>
			<!-- 工具栏 -->
			<div class="tool hidden-sm">
				<i class="iconfont dj-icon-liebiaoxunhuan"></i>
				<i class="iconfont dj-icon-geci"></i>
				<i class="iconfont dj-icon-bofangduilie"></i>
			</div>
			<audio ref="audio" :src="currentSong.url" @playing="audioReady" @error="audioError" @timeupdate="updateTime" @pause="audioPaused" @ended="audioEnd" :muted="isMuted"></audio>
			<div class="container playpage" v-show="playpage" @click="playpage=false">歌曲播放页</div>
		</div>
	</transition>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	// 循环模式
	// import {playMode} from '@/common/playConfig'
	// 歌词
	// import Lyric from 'lyric-parser'
	export default {
		name: 'playbar',
		data() {
			return {
				// 当前进度
				currentTimes: 0,
				// 音量值
				volume: 0.3,
				// 音量条默认显示值
				volumeNum: 30,
				// 歌曲是否准备好，防止过快切换报错(The play() request was interrupted by a call to pause()，上一个的播报还没结束，这一个播报就覆盖上来了),每次切换都要判断
				songReady: false,
				// 是否静音
				isMuted: false,
				// 是否在拖动进度条
				isDrag: false,
				// 歌曲最大时间
				audioduration: 0,
				playpage: false
			}
		},
		computed: {
			// 监听播放暂停改图标
			playIcon() {
				return this.currentPlaying ? 'dj-icon-bofang' : 'dj-icon-zanting'
			},
			// 是否静音
			mutedIcon() {
				return this.isMuted ? 'dj-icon-jingyin' : 'dj-icon-yinliang'
			},
			...mapGetters([
				'playList',
				'currentSong',
				'currentIndex',
				'currentPlaying',
			])
		},
		watch: {
			// 监听播放歌曲信息,切歌操作
			currentSong(newsong, oldsong) {
				// 判断当前播放歌曲有无信息
				if (!newsong.id || !newsong.url || newsong.id === oldsong.id) {
					return
				}
				this.songReady = false
				// 改变DOM数据后执行的延迟回调$nextTick
				this.$nextTick(() => {
					const audio = this.$refs.audio
					if (audio) {
						// 初始化播放地址
						audio.src = newsong.url
						// 初始化播放音量
						audio.volume = this.volume
						//初始化进度条时间
						audio.currentTime = 0;
						// 播放
						audio.play()
						// //监听音频改变
						// audio.addEventListener("timeupdate", () => {
						// 	//获取歌曲时间,同步到进度条
						// 	this.currentTimes = audio.currentTime
						// })
					}
					// 若歌曲 5s 未播放则不会执行audioReady，则认为超时，修改状态确保可以切换歌曲。
					clearTimeout(this.timer)
					this.timer = setTimeout(() => {
						this.$message.warning('当前网络不佳！')
						this.songReady = true
					}, 6000)
				})
			},
			// 监听播放歌曲状态，实现播放暂停
			currentPlaying(isPlaying) {
				if (!this.songReady) {
					return
				}
				this.$nextTick(() => {
					const audio = this.$refs.audio
					if (audio) {
						isPlaying ? audio.play() : audio.pause()
					}
				})
			},
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

			// 切换播放暂停
			togglePlay() {
				if (!this.songReady) {
					return
				}
				this.upplaYing(!this.currentPlaying)
			},

			// 上一首
			prevSong() {
				if (!this.songReady) {
					return
				}
				if (this.playList.length === 1) {
					this.loopSong()
					return
				} else {
					let index = this.currentIndex - 1
					if (index === -1) {
						index = this.playList.length - 1
					}
					this.upcurrentIndex(index)
					// 暂停时点的上一首，调用切换函数更改状态
					if (!this.currentPlaying) {
						this.togglePlay()
					}
				}
			},
			// 下一首
			nextSong() {
				if (!this.songReady) {
					return
				}
				if (this.playList.length === 1) {
					this.loopSong()
					return
				} else {
					let index = this.currentIndex + 1
					if (index === this.playList.length) {
						index = 0
					}
					this.upcurrentIndex(index)
					if (!this.currentPlaying) {
						this.togglePlay()
					}
				}
			},
			// 单曲循环播放
			loopSong() {
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
				this.upplaYing(true)
			},
			// 歌曲是否准备完成
			audioReady() {
				this.audioduration = this.$refs.audio.duration
				clearTimeout(this.timer)
				this.songReady = true
			},
			// 歌曲错误
			audioError() {
				clearTimeout(this.timer)
				this.songReady = true
			},
			// 歌曲暂停
			audioPaused() {
				// 时间播放完会自动执行
				this.upplaYing(false)
			},
			// 进度条拖动改变播放进度
			changeProgress(e) {
				this.$refs.audio.currentTime = e
			},
			// 监听播放时间改变
			updateTime() {
				if (!this.isDrag) {
					// 获取歌曲时间,同步到进度条
					this.currentTimes = this.$refs.audio.currentTime
				}
			},
			// 控制静音
			changeMuted() {
				if (this.isMuted) {
					this.isMuted = false
					this.$refs.audio.muted = false
				} else {
					this.isMuted = true
					this.$refs.audio.muted = true
				}
			},
			// 改变音量
			changeVolume(e) {
				// slider组件默认事件,回调函数是改变后的值
				this.volume = e / 100
				this.$refs.audio.volume = e / 100
			},
			// 歌曲播放完成
			audioEnd() {
				this.$message.success('放完啦！')
				// this.currentTime = 0
				// if (this.mode === playMode.loop) {
				// 	this.loopSong()
				// } else {
				// 	this.nextSong()
				// }
			},
			...mapMutations([
				'upplaYing',
				'upcurrentIndex'
			]),
		}
	}
</script>

<style scoped>
	/* 动画 */
	.fade-enter {
		opacity: 0;
		transform: translate3d(0, 30px, 0);
	}

	.fade-enter-active {
		transition: .5s;
	}

	.fade-leave-to {
		opacity: 0;
		transform: translate3d(0, 30px, 0);
	}

	.fade-leave-active {
		transition: .5s;
	}

	/* 弹性容器 */
	.flex-row {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		background: #f9f9f9;
		/* align-items: center; */
	}

	/* 弹性项目 */
	.player-btn {
		flex-grow: 1;
	}

	.progress-wrap {
		flex-grow: 2;
	}

	.volume-wrap {
		flex-grow: 1;
	}

	.tool {
		flex-grow: 1;
	}

	/* 歌曲信息 */
	.author {
		padding: 0.1%;
		cursor: pointer;
	}

	.author img {
		width: 50px;
		border-radius: 3px;
	}

	.info {
		margin-top: 0.8%;
		width: 10%;
	}

	.info h2 {
		font-weight: 600;
		font-size: 14px;
		color: #333;
		margin-bottom: 3%;
	}

	.info p {
		font-size: 12px;
		color: #999;
	}

	.name,
	.singer {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 控制按钮 */
	.player-btn i {
		font-size: 30px;
		cursor: pointer;
		margin: 0 3%;
	}

	.player-btn i:nth-of-type(2) {
		font-size: 35px;
	}

	/* 进度条 */
	.progress-wrap {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding-bottom: 0.5%;
	}

	.progress-wrap p {
		margin-bottom: 0;
		font-size: 14px
	}

	/* 音量 */
	.volume-wrap {
		display: flex;
		align-items: center;
		margin-left: 3%;
		padding-bottom: 0.5%;
	}

	.volume-wrap i {
		font-size: 20px;
		cursor: pointer;
	}

	/* 工具栏 */
	.tool {
		margin-top: 1%;
	}

	.tool i {
		cursor: pointer;
		margin: 0 7%;
		font-size: 20px;
	}
	
	/* 移动 */
	@media screen and (max-width: 992px) {
		.hidden-hd {
			display: none;
		}
	}

	@media screen and (max-width: 768px) {
		.hidden-sm {
			display: none;
		}

		.info {
			width: 40%;
		}
	}
	.playpage{
		height: calc(100% - 104px);
		background: #000;
		position: fixed;
		top: 53px;
	}
</style>
