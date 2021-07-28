<template>
	<div class="playpagebox container">
		<div class="top">
			<div class="blur"
				:style="{background: 'url(' + currentSong.image + ') no-repeat center top',filter: 'blur(100px)'}">
			</div>
			<div class="left">
				<div class="playbar hidden-hd" ref="playbar">
					<img src="../../assets/img/playbar.png">
				</div>
				<div class="songimg" ref="songimg">
					<img src="../../assets/img/disc.png">
					<img :src="currentSong.image">
				</div>
				<div class="btnBox">
					<el-button size="mini" icon="el-icon-circle-plus-outline" @click="clicklike">喜欢</el-button>
					<el-button size="mini" icon="el-icon-download" @click="down">下载</el-button>
					<el-button size="mini" icon="el-icon-chat-line-square" @click="comment">评论</el-button>
				</div>
			</div>
			<div class="center">
				<div class="center-top">
					<!-- 歌曲信息 -->
					<div class="musictitle">
						<h4>
							{{currentSong.name}}
						</h4>
						<i class="iconfont dj-icon-MV" style="cursor: pointer; margin-left: 3%;"
							v-if="currentSong.mv!=''" @click="toDetail(currentSong.mv)" title="MV"></i>
					</div>
					<div class="musicinfo">
						<h6>
							专辑：<a href="javascript:;"
								@click="toAlbumdetail(currentSong.albumid)">{{currentSong.album}}</a>
						</h6>
						<h6>
							歌手：<a href="javascript:;"
								@click="toSingerdetail(currentSong.artistid)">{{currentSong.singer}}</a>
						</h6>
					</div>
				</div>
				<div class="center-bottom" ref="scroll" @mousedown="isDrags = true" @mouseup="isDrags = false"
					@touchstart="isDrags = true" @touchend="isDrags = false">
					<!-- 歌词 -->
					<div class="lyricbox">
						<ul>
							<li v-for="(item,index) in lyricarray" :key="index" :class="index==lyricindex?'current':''">
								{{item[1]}}
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="right">
				<!-- 相似歌曲相似歌单 -->
				<Similargedan :similarplaylist="similarplaylist" />
				<Similarsong :similarsongs="similarsongs" />
			</div>
		</div>
		<div class="bottom">
			<!-- 评论 -->
			<Comment :currentSong="currentSong" />
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import axios from 'axios'
	import Similarsong from './similarsong'
	import Similargedan from './similargedan'
	import Comment from './comment'
	import {parseLyric} from '@/model/parselyric'
	export default {
		name: "playpage",
		data() {
			return {
				// 唱片旋转角度
				routeNum: 0,
				//转换后的歌词数组
				lyricarray: [],
				// 当前歌词下标
				lyricindex: 0,
				// 歌词的最后一行的时间
				lasttime: 999,
				// 开始滚动时间
				start: 0,
				// 相似歌曲
				similarsongs: null,
				// 相似歌单
				similarplaylist: null,
				// 是否在拖动歌词
				isDrags: false,
			}
		},
		props: {
			// 当前歌曲
			currentSong: {
				type: Object
			},
			// 当前播放状态
			currentPlaying: {
				type: Boolean,
			},
			// 当前播放时间
			currenttime: {
				type: Number,
				default: 0
			},
			// 歌词信息
			lyriclist: {
				type: String,
				default: '暂无歌词'
			}
		},
		computed: {
			...mapGetters([
				'getMycreatelist',
				'loginStatu',
				'userInfo'
			])
		},
		mounted() {
			// 控制唱片旋转
			this.getMusicState()
			// 第一次进入,设置默认值
			this.lyricarray = [
				[0, '暂无歌词']
			]
			// 相似歌曲
			this.getSimilarsong()
			// 相似歌单
			this.getSimilarplaylist()

			// 将拼接字符串中的方法绑定window对象,method里的方法才能正常调用
			window.addlike = this.addlike
		},
		components: {
			Similarsong,
			Similargedan,
			Comment,
		},
		watch: {
			// 监听当前歌曲
			currentSong() {
				// 切歌,设置默认值
				this.lyricarray = [
					[0, '暂无歌词']
				]
				// 歌词滚动归零
				this.$refs.scroll.scrollTo(0, 0)
				// 相似歌曲
				this.getSimilarsong()
				this.getSimilarplaylist()
			},
			// 监听播放状态
			currentPlaying() {
				this.getMusicState()
			},
			// 监听歌词
			async lyriclist() {
				// 格式化歌词
				this.lyricarray = parseLyric(this.lyriclist)
				if (this.lyricarray.length == 0) {
					this.lyricarray = [
						[0, '暂无歌词']
					]
				} else {
					// 将空数据去除
					this.lyricarray.map((item, index) => {
						if (!item[1]) {
							this.lyricarray.splice(index, 1)
						}
						// 开始滚动的时间改为第六句的时间
						// if (index == 6) {
						// 	this.start = item[0]
						// }
					})
					// console.log('处理后',this.lyricarray)
					// 最后一行的时间
					this.lasttime = this.lyricarray[this.lyricarray.length - 1][0]
				}
			},
			// 监听播放时间
			currenttime(current) {
				// 当拖动进度条归零
				if (!this.isDrags) {
					if (current < this.start) {
						this.$refs.scroll.scrollTo(0, 0)
					}
				}
				// 只有一条数据时不操作
				if (!(this.lyricarray.length == 1)) {
					// 当超过最后一条歌词的时间时不再操作，避免到最后一条时找不到下一行而报错
					if (!(current > this.lasttime)) {
						// 歌词对应时间判断
						for (let i = 0; i < this.lyricarray.length; i++) {
							const row = this.lyricarray[i]
							const nextrow = this.lyricarray[i + 1]
							// 如果歌曲current大于当前行歌曲时间，且current小于下一行时间
							if (current >= row[0] && current < nextrow[0]) {
								this.lyricindex = i
							}
						}
					}
					if (current > this.lasttime) {
						this.lyricindex = this.lyricarray.length - 1
					}
				}
			},
			lyricindex() {
				// 歌词滚动
				if (!this.isDrags) {
					this.$nextTick(() => {
						if (this.lyricindex > 5) {
							this.$refs.scroll.scrollTo(0, 30.4 * (this.lyricindex - 5))
						}
					})
				}
			}
		},
		methods: {
			// 视频详情
			toDetail(id) {
				// 播放视频暂停播放
				this.upplaYing(false)
				this.$router.push({
					name: 'mvdetail',
					query: {
						id
					}
				})
			},
			// 专辑详情
			toAlbumdetail(id) {
				// console.log(id)
				this.$router.push({
					name: 'albumdetail',
					query: {
						id
					}
				})
			},
			// 歌手详情
			toSingerdetail(id) {
				this.$router.push({
					name: 'singerdetail',
					query: {
						id
					}
				})
			},
			// 判断播放状态
			getMusicState() {
				if (this.currentPlaying) {
					clearInterval(this.timer)
					this.$refs.playbar.style.transform = "rotate(-20deg)"
					this.timer = setInterval(this.rotateRotate, 30);
				} else {
					this.$refs.playbar.style.transform = "rotate(-40deg)"
					clearInterval(this.timer)

				}
			},
			//唱片旋转
			rotateRotate() {
				let songimg = this.$refs.songimg
				if (songimg) {
					songimg.style.transform = "rotate(" + this.routeNum + "deg)"
					this.routeNum += 1
				}
			},
			// 获取相似歌曲
			getSimilarsong() {
				let id = this.currentSong.id
				if (id != undefined) {
					this.$api.get(`/simi/song?id=${id}`).then(res => {
						this.similarsongs = res.songs
						// console.log(res)
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 获取相似歌单
			getSimilarplaylist() {
				let id = this.currentSong.id
				if (id != undefined) {
					this.$api.get(`/simi/playlist?id=${id}`).then(res => {
						this.similarplaylist = res.playlists
						// console.log(res)
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 获取用户歌单
			async getUserArtist() {
				// 获取用户歌单
				try {
					let timestamp = new Date().getTime()
					let res = await this.$api.get(`/user/playlist?uid=${this.userInfo.userId}&timestamp=${timestamp}`)
					if (res.code === 200) {
						// console.log(res)
						let list = res.playlist
						let myCreatelist = []
						list.map(item => {
							// 拿出我创建的歌单
							if (item.userId === this.userInfo.userId) {
								myCreatelist.push(item)
							}
						})
						// 存储到store
						this.addMycreatelist(myCreatelist)
						// console.log(this.getMycreatelist)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 喜欢
			async clicklike() {
				// 登录后才能收藏歌曲
				if (this.loginStatu) {
					if (this.getMycreatelist == null) {
						// console.log(this.userInfo.userId)
						// 调用this.getUserArtist()造成没请求成功就执行下面的map遍历,控制台报错，所以直接用代码
						try {
							let timestamp = new Date().getTime()
							let res = await this.$api.get(
								`/user/playlist?uid=${this.userInfo.userId}&timestamp=${timestamp}`)
							if (res.code === 200) {
								// console.log(res)
								let list = res.playlist
								let myCreatelist = []
								list.map(item => {
									// 拿出我创建的歌单
									if (item.userId === this.userInfo.userId) {
										myCreatelist.push(item)
									}
								})
								// 存储到store
								this.addMycreatelist(myCreatelist)
							}
						} catch (error) {
							console.log(error)
						}
					}
					let ul = '<ul>'
					await this.getMycreatelist.map(item => {
						ul += `<li class="mylike" onClick="addlike(${item.id})">
								<div class="author">
									<img src="${item.coverImgUrl}" alt="${item.creator.nickname}" title="${item.creator.nickname}" />
								</div>
								<div class="info">
									<h2 class="ellipsis" title="item.name">${item.name}</h2>
									<span><small>by ${item.trackCount}</small></span>
								</div>
							</li>`
					})
					ul += '</ul>'
					// console.log(ul)
					// 饿了么弹框组件
					this.$alert(ul, '添加到歌单', {
						// 是否可通过点击遮罩关闭 MessageBox
						closeOnClickModal: true,
						// 是否可通过按下 ESC 键关闭 MessageBox
						closeOnPressEscape: true,
						// 是否显示确定按钮
						showConfirmButton: false,
						// 是否将 message 属性作为HTML片段处理
						dangerouslyUseHTMLString: true,
						// 自定义类名
						customClass: 'descBox'
					}).catch(err => {
						console.log(err)
					})
				} else {
					this.$message.warning('请先登录！')
					return
				}
			},
			// 收藏到我的歌单
			addlike(pid) {
				try {
					let timestamp = new Date().getTime()
					this.$api.get(`/playlist/tracks?op=add&pid=${pid}&tracks=${this.currentSong.id}&timestamp=${timestamp}`)
						.then(res => {
							// console.log(res)
							// console.log(res.body)
							if (res.body.code == 502) {
								this.$message.warning(res.body.message)
							} else {
								this.$message.success('收藏成功！')
								// 更新数据
								this.getUserArtist()
								// 主动触发esc关闭弹窗
								setTimeout(()=>{
									if (HTMLElement && !HTMLElement.prototype.pressKey) {
										HTMLElement.prototype.pressKey = function(code) {
											var evt = document.createEvent('UIEvents');
											evt.keyCode = code;
											evt.initEvent('keydown', true, true);
											this.dispatchEvent(evt);
										};
									}
									document.body.pressKey(27);
								},2000)
							}
						}).catch(err => {
							console.log(err)
						})
				} catch (err) {
					console.log(err)
				}
			},
			// 评论
			comment() {
				let playpage = document.getElementsByClassName('playpage')[0]
				playpage.scrollTo(0, 700)
			},
			// 下载
			down() {
				this.$message.success('请稍后~')
				let downUrl = this.currentSong.url
				// 文件名
				let fileName = this.currentSong.name
				axios({
					method: 'get',
					url: downUrl,
					responseType: 'blob',
					headers: {
						'content-type': 'audio/mpeg'
					}
				}).then((res) => {
					// 创建blob 设置blob文件类型 data 设置为后端返回的文件(例如mp3,jpeg) type:这里设置后端返回的类型 为 mp3
					let blob = new Blob([res.data], {
						type: res.data.type
					})
					// 创建A标签
					let downa = document.createElement('a')
					// 创建下载的链接
					let href = window.URL.createObjectURL(blob)
					// 下载地址
					downa.href = href
					// 下载文件名
					downa.download = fileName
					document.body.appendChild(downa)
					// 模拟点击A标签
					downa.click()
					// 下载完成移除元素
					document.body.removeChild(downa)
					// 释放blob对象
					window.URL.revokeObjectURL(href)
				}).catch(function(error) {
					console.log(error)
				})
			},
			...mapMutations([
				'upplaYing',
				'addMycreatelist'
			]),
		},
	}
</script>

<style scoped>
	.playpagebox {
		height: 100%;
		background-color: transparent
	}

	.top {
		display: flex;
		padding: 3%;
	}

	.top .playbar {
		position: absolute;
		top: 0;
		width: 100px;
		height: 130px;
		z-index: 999;
		transform: rotate(-40deg);
		transform-origin: left top;
		transition: all 1s ease;
	}

	.top .songimg {
		position: relative;
		width: 320px;
		height: 320px;
		top: 20px;
	}

	.top .songimg img:first-child {
		width: 100%;
	}

	.top .songimg img:last-child {
		width: 60%;
		position: absolute;
		border-radius: 50%;
		top: 65px;
		left: 65px;
	}

	.top .left {
		margin: 0 50px;
		height: 680px;
	}

	/* 歌曲标题 */
	.top .center {
		margin-top: -1%;
		margin-right: 50px;
	}

	.top .center-top {
		margin-left: 8%;
		width: 365px;
		text-align: center;
	}

	.top .center .musictitle {
		width: 365px;
		font-size: 32px;
	}

	.top .center .musictitle h4 {
		color: #fff;
		text-shadow: 1px 1px rgb(0 0 0 / 60%);
		display: inline-block;
		font-weight: 600;
	}

	/* 歌曲信息 */
	.top .center .musicinfo {
		color: #fff;
		text-shadow: 1px 1px rgb(0 0 0 / 60%);
	}

	.top .center .musicinfo h6 {
		font-size: 12px;
	}

	.top .center .musicinfo a {
		text-decoration: none;
		color: #2761e6;
		transition: .3s;
	}

	.top .center .musicinfo a:hover {
		color: #e60045;
	}


	/* 滚动条 */
	.center-bottom {
		width: 400px;
		height: 400px;
		overflow-y: scroll;
		/* overflow-x: hidden; */
		white-space: nowrap;
		cursor: default;
	}

	.center-bottom::-webkit-scrollbar {
		width: 0;
		height: 4px;
	}

	.center-bottom::-webkit-scrollbar-track {
		border-radius: 3px;
		background: rgba(135, 245, 255, 0.2);
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 255, 0.18);
	}

	.center-bottom::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: linear-gradient(45deg, #66e3ff, #6dcaf4, #66e3ff);
		-webkit-box-shadow: inset 0 0 10px rgba(78, 255, 0, 0.2);
	}

	/* 歌曲图下按钮 */
	.btnBox {
		margin-top: 90px;
	}

	/* 歌词行 */
	.lyricbox ul li {
		font-size: 13px;
		list-style: none;
		line-height: 31px;
		letter-spacing: 1px;
		color: #000;
		text-shadow: 1px 1px rgb(255 255 255 / 60%)
	}

	/* 当前歌词 */
	.lyricbox .current {
		font-size: 18px;
		color: #49ff17;
		text-shadow: -1px 1px rgb(0 0 0 / 60%);
	}

	/* 背景模糊 */
	.blur {
		height: 400px;
		position: absolute;
		left: 100px;
		right: 0;
		z-index: -1;
		opacity: 0.7;
	}

	.right {
		width: 350px;
	}

	.bottom {
		text-align: left;
		margin: -150px 3rem 0 3rem;
	}

	/* 移动 */
	@media screen and (max-width: 1400px) {
		.right {
			display: none;
		}

		.left {
			margin: 0 10% !important;
		}
	}

	@media screen and (max-width: 992px) {
		.top {
			padding: 0;
		}

		.btnBox,
		.hidden-hd {
			display: none;
		}

		.center {
			position: absolute;
			left: 20%;
			margin-top: 3% !important;
		}

		.left {
			height: 900px !important;
			margin: 15% 28% !important;
		}

		.blur {
			height: 100%;
			left: 0;
			background-size: contain !important;
		}

		.lyricbox ul li {
			font-size: 15px;
			color: #fff;
			text-shadow: 1px 1px rgb(0 0 0 / 60%)
		}

		.center-bottom::-webkit-scrollbar {
			height: 0;
		}
	}

	@media screen and (max-width: 768px) {
		.bottom {
			margin: -150px 0.5rem 0 0.5rem;
		}

		.blur {
			background-size: cover !important;
		}

		.left {
			margin: 15% 20% !important;
		}

		.center {
			position: absolute;
			left: 10%;
			margin-top: 5% !important;
		}
	}

	@media screen and (max-width: 576px) {
		.top .songimg {
			width: 250px;
			height: 250px;
		}

		.top .songimg img {
			top: 50px !important;
			left: 50px !important;
		}

		.left {
			margin: 15% 26% !important;
		}
	}

	@media screen and (max-width: 485px) {
		.center {
			left: 25px;
		}

		.center-bottom {
			text-align: center !important;
		}
	}

	@media screen and (max-width: 415px) {

		.center-top,
		.center .musictitle {
			width: 330px !important;
			margin: 0 auto;
		}

		.left {
			margin: 15% 20% !important;
		}
	}

	@media screen and (max-width: 391px) {
		.center {
			left: -7%;
		}

		.left {
			margin: 15% 17% !important;
		}
	}

	@media screen and (max-width: 376px) {
		.left {
			margin: 15% 15% !important;
		}

		.center-bottom {
			margin-left: -20px;
		}
	}

	@media screen and (max-width: 348px) {
		.center {
			left: -13%;
		}

		.left {
			margin: 15% 13% !important;
		}
	}

	@media screen and (max-width: 318px) {
		.center {
			left: -20%;
		}

		.left {
			margin: 15% 10% !important;
		}
	}
</style>
