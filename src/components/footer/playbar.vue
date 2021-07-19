<template>
	<transition name="fade">
		<div class="container shadow flex-row" v-show="playList.length > 0 && !$route.meta.isLogin">
			<!-- 歌曲封面 -->
			<div v-show="!playpage" class="author" @click="openplaypage">
				<img src="../../assets/img/zhankai.png" class="zhankai">
				<img :src="currentSong.image" alt="dj-music" class="shadow" />
			</div>
			<!-- 歌曲信息 -->
			<div v-show="!playpage" class="info hidden-hd">
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
			<!-- pc和移动对应的点击抬起事件 -->
			<div class="progress-wrap" id="progress-wrap" 
				@mousedown="isDrag = true"
				@mouseup="isDrag = false"
				@touchstart="isDrag = true"
				@touchend="isDrag = false"
			>
				<p class="current-time">{{ formatTime(currentTimes) }}</p>
				<el-slider 
					v-model="currentTimes" 
					:max="audioduration" 
					:show-tooltip="false"
					style="width: 70%;margin-left: 1%;" 
					@change="changeProgress"
				></el-slider>
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
			<div class="tool">
				<el-tooltip :content="modeTitle" effect="light">
					<i class="iconfont left" :class="[modeIcon,playpage?'leftopen':'']" @click="changeMode"></i>
				</el-tooltip>
				<i class="iconfont dj-icon-geci hidden-col" title="歌词" @click="openLyric"  :style="showLyric?'color:red':''"></i>
				<i class="iconfont dj-icon-bofangduilie right" title="播放列表" @click="openPlaylist" :style="showPlaylist?'color:red':''"></i>
			</div>
			<audio ref="audio" :src="currentSong.url" @playing="audioReady" @error="audioError" @timeupdate="updateTime"
				@pause="audioPaused" @ended="audioEnd" :muted="isMuted"></audio>
			<!-- 歌词 -->
			<transition name="fade">
				<div class="lyriclist" v-show="showLyric">
					<Lyric :lyriclist="lyriclist" :currenttime="currentTimes" :currentSong="currentSong"/>
				</div>
			</transition>
			<!-- 播放列表 -->
			<transition name="fade">
				<div class="playlist-box shadow" v-show="showPlaylist">
					<div class="title">播放列表
						<i class="iconfont dj-icon-shanchu" title="清空" @click="clearPlaylist"></i>
					</div>
					<div class="list">
						<div class="playlist-row" v-for="(item, index) of playList" :key="index"
							:style="item.id==currentSong.id?'color:red':''">
							<div class="flex-center">
								<span class="num">{{ handle.addZero(index + 1, 2) }}</span>
								<i class="iconfont play-btn" :class="index==currentIndex&&currentPlaying?'dj-icon-bofang':'dj-icon-zanting'" @click="selectPlays(index)"></i>
							</div>
							<p class="ellipsis" style="flex: 2;margin-right: 10%">{{item.name}}</p>
							<p class="ellipsis" style="margin-right: 5%">{{item.singer}}</p>
							<p class="ellipsis">{{formatTime(item.duration)}}</p>
							<i class="iconfont dj-icon-guanbi" title="删除" @click="deletePlaylist(index)"></i>
						</div>
					</div>
				</div>
			</transition>
			<!-- 歌曲详情页 -->
			<transition name="slide">
				<div class="container playpage" v-show="playpage">
					<img src="../../assets/img/shousuo.png" class="shousuo" @click="playpage=false">
					<!-- 组件 -->
					<Playpage :currentSong="currentSong" :currentPlaying="currentPlaying" :lyriclist="lyriclist" :currenttime="currentTimes"/>
					<!-- 返回顶部 -->
					<el-backtop target=".playpage" :bottom="100">
						<img src="../../assets/img/gotop.png">
					</el-backtop>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
	import Playpage from '../contents/playpage'
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	// 循环模式
	import {
		playMode
	} from '@/common/playmod'
	import Lyric from './lyric'
	// 歌词
	// import Lyric from 'lyric-parser'
	export default {
		name: 'playbar',
		data() {
			return {
				// 当前进度
				currentTimes: 0,
				// 歌曲最大时间
				audioduration: 0,
				// 音量值
				volume: 0.3,
				// 音量条默认显示值
				volumeNum: 30,
				// 歌曲是否准备好，防止过快切换报错(The play() request was interrupted by a call to pause()，上一个的播放操作还没结束，这一个播放就覆盖上来了),每次切换都要判断,一开始默认可以操作，因为有历史记录
				songReady: true,
				// 是否静音
				isMuted: false,
				// 是否在拖动进度条
				isDrag: false,
				// 播放列表
				showPlaylist: false,
				// 歌曲播放页
				playpage: false,
				// 是否显示歌词
				showLyric: false,
				// 歌词信息
				lyriclist: null,
			}
		},
		components: {
			Lyric,
			Playpage
		},
		computed: {
			// 监听播放暂停改图标
			playIcon() {
				return this.currentPlaying ? 'dj-icon-bofang' : 'dj-icon-zanting'
			},
			// 播放模式图标
			modeIcon() {
				return this.currentMod === playMode.sequence ? 'dj-icon-liebiaoxunhuan' :
					this.currentMod === playMode.loop ? 'dj-icon-danquxunhuan' :
					'dj-icon-suijibofang'
			},
			// 播放模式标题
			modeTitle() {
				return this.currentMod === playMode.sequence ? '顺序播放' :
					this.currentMod === playMode.loop ?
					'单曲循环' :
					'随机播放'
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
				'currentMod'
			])
		},
		watch: {
			// 监听歌曲列表,清空时暂停正在播放的
			playList(list){
				if(list.length==0){
					const audio = this.$refs.audio
					audio.currentTime = 0
					audio.pause()
					return
				}
			},
			// 监听播放歌曲信息,切歌操作
			currentSong(newsong, oldsong) {
				// 判断当前播放歌曲有无信息
				if (!newsong.id || !newsong.url || newsong.id === oldsong.id) {
					return
				}
				// 解决播放列表里只改下标不改状态的bug
				// if (!this.currentPlaying) {
					// this.togglePlay()
				// }
				
				// 获取歌词
				this.getLyric()
				
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
						audio.currentTime = 0
						// 播放
						audio.play()
					}
					// 若歌曲 8s 未播放则不会执行audioReady，则认为超时，修改状态确保可以切换歌曲。
					clearTimeout(this.timer)
					this.timer = setTimeout(() => {
						this.$message.warning('当前网络不佳！请稍后！')
						this.songReady = true
					}, 8000)
				})
			},
			// 监听播放歌曲状态，实现播放暂停
			currentPlaying(isPlaying) {
				if (!this.songReady) {
					return
				}
				if(isPlaying){
					this.getLyric()
				}
				this.$nextTick(() => {
					const audio = this.$refs.audio
					if (audio) {
						isPlaying ? audio.play() : audio.pause()
					}
				})
			},
			// 监听路由跳转关闭歌曲页面
			$route(){
				this.playpage = false
			}
		},
		methods: {
			cs(){
				alert('这是一个测试')
			},
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
				// 如果播放列表只有一首歌,就将进度清零重新播放
				if (this.playList.length == 1) {
					this.loopSong()
					return
				} else {
					let index
					if (this.currentMod == playMode.sequence) {
						index = this.currentIndex - 1
						if (index == -1) {
							index = this.playList.length - 1
						}
					} else if (this.currentMod == playMode.loop) {
						this.loopSong()
						return
					} else {
						index = Math.floor(Math.random() * this.playList.length)
						if(index==this.currentIndex){
							this.loopSong()
							return
						}
					}
					this.upcurrentIndex(index)
				}
				// 暂停时点的上一首，调用切换函数更改状态
				if (!this.currentPlaying) {
					this.togglePlay()
				}
			},
			
			// 下一首
			nextSong() {
				if (!this.songReady) {
					return
				}
				if (this.playList.length == 1) {
					this.loopSong()
					return
				} else {
					let index
					if (this.currentMod == playMode.sequence) {
						index = this.currentIndex + 1
						if (index == this.playList.length) {
							index = 0
						}
					} else if (this.currentMod == playMode.loop) {
						this.loopSong()
						return
					} else {
						index = Math.floor(Math.random() * this.playList.length)
						if(index==this.currentIndex){
							this.loopSong()
							return
						}
					}
					this.upcurrentIndex(index)
				}
				if (!this.currentPlaying) {
					this.togglePlay()
				}
			},
			
			// 单曲循环播放
			loopSong() {
				if(!this.songReady){
					return
				}
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
				this.upplaYing(true)
			},
			
			// 歌曲是否准备完成
			audioReady() {
				clearTimeout(this.timer)
				this.audioduration = this.$refs.audio.duration
				this.songReady = true
			},
			
			// 歌曲错误
			audioError() {
				// this.$message.error('播放错误，请稍后！')
				this.getLyric()
				// 播放地址失效后重新获取
				let id = this.currentSong.id
				this.$api.get(`/song/url?id=${id}`).then(res => {
					let list = res.data
					let index = 0
					this.selectPlay({
						list,
						index
					})
				})
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
				// 用户滚动歌词时不作操作
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
				if (this.currentMod === playMode.loop) {
					this.currentTimes = 0
					this.loopSong()
				} else {
					this.nextSong()
				}
			},

			// 展开播放列表
			openPlaylist() {
				// this.showLyric = false
				if (this.showPlaylist) {
					this.showPlaylist = false
				} else {
					this.showPlaylist = true
				}
			},
			
			// 更换播放模式
			changeMode() {
				const mode = (this.currentMod + 1) % 3
				this.upplayMod(mode)
			},
			
			// 点击列表里的播放暂停
			selectPlays(index){
				if(this.currentIndex==index){
					this.togglePlay()
					return
				}
				this.upcurrentIndex(index)
				this.upplaYing(true)
			},
			
			// 清空播放列表
			clearPlaylist(){
				this.clearPlaylist()
			},
			
			// 删除播放列表某一项
			deletePlaylist(index){
				this.deletePlaylist(index)
			},
			
			// 展开歌词
			openLyric(){
				if(this.showLyric){
					this.showLyric = false
				}else{
					this.getLyric()
					this.showLyric = true
				}
			},
			// 获取歌词
			async getLyric(){
				await this.$api.get(`/lyric?id=${this.currentSong.id}`).then(res=>{
					this.lyriclist = res.lrc.lyric
				})
				.catch(()=>{
					// this.lyriclist = "暂无歌词"
					return
				})
			},
			// 展开歌曲页
			openplaypage(){
				this.showLyric = false
				this.showPlaylist = false
				this.playpage = true
				this.getLyric()
			},
			...mapMutations([
				'upplaYing',
				'upcurrentIndex',
				'upplayMod',
				'clearPlaylist',
				'deletePlaylist'
			]),
			...mapActions([
				'selectPlay',
			])
		}
	}
</script>

<style scoped>
	/* 弹性容器 */
	.flex-row {
		width: 100%;
		height: 53px;
		position: fixed;
		bottom: 0;
		z-index: 2;
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
		padding-top: 0.5%;
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
		padding-top: 0.5%;
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
		.tool{
			margin-top: 1.8%;
		}
		.el-slider{
			width: 55%!important;
		}
	}

	@media screen and (max-width: 768px) {
		.hidden-sm {
			display: none;
		}
		.tool{
			margin-top: 2.5%;
		}
		
	}
	@media screen and (max-width: 576px) {
		.hidden-col {
			display: none;
		}
		.tool{
			margin-top: 2.2%;
		}
		.tool i{
			font-size: 25px;
		}
		#progress-wrap{
			position: fixed;
			width: 100%;
			padding: 0 10%;
			bottom: 6.3%;
			background: #f9f9f9;
			z-index: 2;
		}
		.el-slider{
			width: 70%!important;
		}
		.player-btn{
			flex-grow: 50;
		}
		.tool .left{
			position: fixed;
			left: 13%;
		}
		.tool .leftopen{
			left: 0;
		}
		.tool .right{
			position: fixed;
			right: 0;
		}
	}
	@media screen and (max-width: 415px) {
		.playlist-box{
			width: 320px!important;
			height: 390px!important;
		}
	}
	@media screen and (max-width: 401px) {
		.tool{
			margin-top: 3.2%;
		}
	}
	@media screen and (max-width: 345px) {
		.playlist-box{
			width: 390px!important;
			height: 360px!important;
		}
	}

	/* 歌曲播放页 */
	.playpage {
		height: calc(100% - 104px);
		background: #f9f9f9;
		position: fixed;
		top: 52px;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.playpage::-webkit-scrollbar {
		width: 7px;
		height: 6px;
	}
	
	.playpage::-webkit-scrollbar-track {
		border-radius: 3px;
		background: rgba(135, 245, 255, 0.2);
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 255, 0.18);
	}
	.playpage::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: linear-gradient(45deg, #66e3ff,#6dcaf4, #66e3ff);
		-webkit-box-shadow: inset 0 0 10px rgba(78, 255, 0, 0.2);
	}
	

	/* 播放列表容器 */
	.playlist-box {
		width: 380px;
		height: 450px;
		background: #F9F9F9;
		position: absolute;
		right: 20px;
		bottom: 65px;
		border-radius: 3px;
		padding: 10px 30px 30px;
		overflow: hidden;
		z-index: 2;
	}

	/* 播放列表标题 */
	.playlist-box .title {
		margin: 0 0 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* 播放列表清空图标 */
	.playlist-box .title i {
		font-size: 15px;
		cursor: pointer;
	}

	.playlist-box .title i:hover {
		color: red;
	}

	/* 播放列表 */
	.playlist-box .list {
		overflow-y: scroll;
		max-height: calc(100% - 50px);
	}

	/* 滚动槽 */
	.playlist-box .list::-webkit-scrollbar {
		width: 0px;
		height: 8px;
	}

	/* 播放列表行 */
	.playlist-box .playlist-row {
		display: flex;
		align-items: center;
		height: 45px;
	}

	.playlist-row:hover .flex-center i {
		display: block;
		margin-right: 15px;
	}

	/* 序号 */
	.playlist-box .flex-center {
		width: 17px;
		overflow: hidden;
		margin-right: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.playlist-box .num {
		font-size: 13px;
		color: #4a4a4a;
	}

	/* 播放列表播放暂停图标 */
	.playlist-row .flex-center i {
		color: #fa2800;
		font-size: 15px;
		display: none;
		text-align: left;
	}

	/* 歌曲名 */
	.playlist-row .ellipsis {
		font-size: 13px;
		cursor: pointer;
		flex: 1;
		text-align: left;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-bottom: 0 !important;
	}

	/* 叉 */
	.playlist-row i {
		font-size: 12px;
		cursor: pointer;
		margin-right: 0.3%;
	}

	.playlist-row i:hover {
		color: red;
	}
	
	/* 歌词 */
	.lyriclist{
		width: 85%;
		height: 80px;
		overflow: hidden;
		position: absolute;
		bottom: 70px;
		z-index: 2;
	}
	
	/* 歌曲播放页 */
	/* 展开按钮 */
	.zhankai {
		display: none;
		position: absolute;
		top: 1px;
		left: 1px;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 14px;
	}
	.author:hover .zhankai {
		display: block;
	}
	/* 收缩 */
	.shousuo {
		position: absolute;
		right: 0%;
		top: 1%;
		width: 35px;
		height: 35px;
		padding: 6px;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
