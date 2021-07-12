<template>
	<transition name="fade">
		<div class="shadow flex-row" v-show="playList.length > 0">
			<!-- 歌曲封面 -->
			<div class="author">
				<img :src="currentSong.image" alt="dj-music" class="shadow" />
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
			<div class="progress-wrap hidden-hd" id="progress-wrap">
				<p class="current-time">{{ formatTime(urrentTimes) }}</p>
				<el-slider v-model="urrentTimes" :max="currentSong.duration" :show-tooltip="false"
					style="width: 70%;margin-left: 1%;"></el-slider>
				<p class="duration-time">
					{{formatTime(currentSong.duration)}}
				</p>
			</div>
			<!-- 音量条 -->
			<div class="volume-wrap hidden-sm">
				<i class="iconfont dj-icon-yinliang"></i>
				<el-slider v-model="volumeNum" style="width: 100%;margin-left: 3%;"></el-slider>
			</div>
			<!-- 工具栏 -->
			<div class="tool hidden-sm">
				<i class="iconfont dj-icon-geci"></i>
				<i class="iconfont dj-icon-liebiaoxunhuan"></i>
				<i class="iconfont dj-icon-bofangduilie"></i>
			</div>
			<audio ref="audio" :src="currentSong.url"></audio>
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
				urrentTimes: 0,
				// 进度条最大值
				maxduration: 0,
				// 音量条默认值
				volumeNum: 50,
				// 在此页面使用的播放状态
				songReady: false,
			}
		},
		computed: {
			// 监听播放暂停改图标
			playIcon() {
				return this.currentPlaying ? 'dj-icon-bofang' : 'dj-icon-zanting'
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
				// console.log(this.currentSong.duration)
				if (!newsong.id || !newsong.url || newsong.id === oldsong.id) {
					return
				}
				// 改变DOM数据后执行的延迟回调$nextTick
				this.$nextTick(() => {
					const audio = this.$refs.audio
					//初始化进度条时间
					audio.currentTime = 0;
					//监听音频改变
					audio.addEventListener("timeupdate", () => {
						//获得音频长度
						this.maxduration = audio.duration;
						//获取歌曲时间,同步到进度条
						this.urrentTimes = audio.currentTime;
					});
					if (audio) {
						audio.src = newsong.url
						audio.play()
					}
				})
			},
			// 监听播放歌曲状态，实现播放暂停
			currentPlaying(isPlaying) {
				// console.log(isPlaying)
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
			// 切换播放暂停
			togglePlay() {
				this.upplaYing(!this.currentPlaying)
			},
			// 上一首
			prevSong() {
				if (this.playList.length === 1) {
					this.loopSong()
					return
				} else {
					let index = this.currentIndex - 1
					if (index === -1) {
						index = this.playList.length - 1
					}
					this.upcurrentIndex(index)
					if (!this.currentPlaying) {
						this.togglePlay()
					}
				}
			},
			// 下一首
			nextSong() {
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
		margin-right: 2%;
	}

	.author img {
		width: 50px;
		border-radius: 3px;
	}

	.info {
		margin-top: 0.8%;
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
	}

	.progress-wrap p {
		margin-bottom: 0;
	}

	/* 音量 */
	.volume-wrap {
		display: flex;
		align-items: center;
		margin-left: 3%;
	}

	.volume-wrap i {
		font-size: 20px;
	}

	/* 工具栏 */
	.tool {
		margin-top: 1.2%;
	}

	.tool i {
		cursor: pointer;
		margin: 0 7%;
	}

	.tool i:nth-of-type(1) {
		font-size: 17px;
	}

	.tool i:nth-of-type(2) {
		font-size: 20px;
	}

	.tool i:nth-of-type(3) {
		font-size: 16px;
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

		.name,
		.singer {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
