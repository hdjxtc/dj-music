<template>
	<div class="playlistdetailbox" v-if="detail">
		<!-- 左栏 -->
		<div class="left shadow">
			<div class="top">
				<!-- 封面 -->
				<div class="avatar">
					<img :src="detail.coverImgUrl" alt="" />
				</div>
				<!-- 歌单信息 -->
				<div class="info">
					<div class="title flex-between">
						<span>{{detail.name}}</span>
					</div>
					<div class="user flex-row">
						<div class="avatar" @click="toUser(creator.userId)">
							<img :src="creator.avatarUrl" alt="" />
						</div>
						<p class="nickname" @click="toUser(creator.userId)">{{creator.nickname}}</p>
						<p class="createTime" v-if="detail.createTime">
							{{handle.dateFormat(detail.createTime, 'YYYY-MM-DD')}}创建
						</p>
					</div>
					<div class="tag flex-row" v-if="detail.tags && detail.tags.length > 0">
						标签：
						<a v-for="item of detail.tags" :key="item" @click="tag(item)">{{item}}</a>
					</div>
					<div class="desc">
						<p class="ellipsis-two" v-html="detail.description"></p>
						<span 
							class="flex-row"
							@click="openDesc(detail.name, detail.description)" 
							v-if="txtLength(detail.description) > 50"
						>全部
						<i class="el-icon-arrow-right"></i></span>
					</div>
				</div>
			</div>
			<Songlist :songlist="songs" :width1="300" :width2="200" :width3="200" :subscribed="detail.subscribed" @collect="collect"/>
		</div>
		<!-- 右栏 -->
		<div class="right">
			<div class="like module shadow">
				<div class="card-headers flex-row">
					<span>喜欢这个歌单的人</span>
				</div>
				<ul v-if="subscribers.length > 0">
					<li v-for="item of subscribers" :key="item.userId">
						<div class="avatar" @click="toUser(item.userId)">
							<img :src="item.avatarUrl + '?param=150y150'" :alt="item.nickname" :title="item.nickname" />
						</div>
					</li>
				</ul>
				<p class="no-data-text" v-else style="padding-bottom: 10px;">还没有人喜欢</p>
			</div>
			<div class="related module shadow">
				<div class="card-headers flex-row">
					<span>相关推荐</span>
				</div>
				<ul>
					<li v-for="item of relatedList" :key="item.id" @click="toDetail(item.id)">
						<div class="avatar">
							<img :src="item.coverImgUrl" :alt="item.nickname"
								:title="item.nickname" />
						</div>
						<div class="info">
							<h2 class="ellipsis" :title="item.name">{{ item.name }}</h2>
							<span>by <small> {{ item.creator.nickname }}</small></span>
						</div>
					</li>
				</ul>
			</div>
			<div class="comment module shadow">
				<div class="card-headers flex-row">
					<span>精彩评论</span>
				</div>
				<ul v-if="comments.length > 0">
					<li class="item" v-for="item of comments" :key="item.time">
						<div class="avatar" @click="toUser(item.user.userId)">
							<img :src="item.user.avatarUrl" :alt="item.user.nickname" :title="item.user.nickname" />
						</div>
						<div class="info">
							<h2 @click="toUser(item.user.userId)">
								{{ item.user.nickname}}<small> · {{ handle.formatMsgTime(item.time) }}</small>
							</h2>
							<p>{{ item.content }}</p>
						</div>
					</li>
				</ul>
				<p class="no-data-text" v-else style="padding-bottom: 10px;">还没有人评论</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {createSong} from '@/model/song'
	import Songlist from '@/components/contents/songlist'
	export default {
		data() {
			return {
				// 歌单详情
				detail: {},
				// 歌单创建者
				creator: {},
				// 歌曲列表
				songs: [],
				// 收藏这个歌单的人
				subscribers: [],
				// 相关歌单
				relatedList: [],
				// 相似歌单
				simiList: [],
				// 评论
				comments: [],
				// 歌单最近的收藏者
				s: 32,
				artistId: '',
			}
		},
		components: {
			Songlist
		},
		computed: {
			// 描述字数
			txtLength() {
				return function(txt) {
					if (txt) {
						return txt.length
					}
				}
			}
		},
		watch: {
			$route() {
				// 滚动条滚零
				let contents = document.getElementById('contents')
				contents.scrollTo(0,0)
				let id = this.$route.query.id || this.singer.id
				if (id) {
					this.initialize(id)
				}
			}
		},
		methods: {
			// 标签跳转
			tag(cat) {
				this.$router.push({
					name: 'playlist',
					query: {
						cat
					}
				})
			},
			// 获取歌单详情
			async getPlayListDetail(id, s) {
				let timestamp = new Date().getTime()
				try {
					let res = await this.$api.get(`/playlist/detail?id=${id}&s=${s}&timestamp=${timestamp}`)
					// console.log(res)
					if (res.code === 200) {
						if (res.playlist.description !== null) {
							res.playlist.description = res.playlist.description.replace(
								/(\r\n|\n|\r)/gm,
								'<br />'
							)
						}
						this.detail = res.playlist
						// console.log(this.detail)
						this.creator = res.playlist.creator
						let trackIds = res.playlist.trackIds
						// 数量超过一千，进行分割
						let arrLength = 1000
						let sliceArr = []
						for (let i = 0; i < trackIds.length; i += arrLength) {
							// slice返回被删除的元素
							sliceArr.push(trackIds.slice(i, i + arrLength))
						}
						this.getSongDetail(sliceArr)
					}
				} catch (error) {
					// this.$message.error(error)
				}
			},
			// 获取歌曲列表
			async getSongDetail(sliceArr) {
				// 如果有分割,分别请求
				let before = sliceArr[0]
				let after = sliceArr[1]
				let beforeIds = []
				let afterIds = []
				before.map(item => {
					beforeIds.push(item.id)
				})
				// 拼接id
				beforeIds = beforeIds.join(',')
				if (after) {
					after.map(item => {
						afterIds.push(item.id)
					})
					afterIds = afterIds.join(',')
				}
				
				let timestamp = new Date().getTime()
				try {
					if (after) {
						let beforeRes = await this.$api.post(`/song/detail?ids=${beforeIds}&timestamp=${timestamp}`)
						let afterRes = await this.$api.post(`/song/detail?ids=${afterIds}&timestamp=${timestamp+1}`)
						let res = beforeRes.songs.concat(afterRes.songs)
						this.songs = this.normalizeSongs(res)
					} else {
						let beforeRes = await this.$api.post(`/song/detail?ids=${beforeIds}&timestamp=${timestamp}`)
						let res = beforeRes.songs
						// 处理数据
						this.songs = this.normalizeSongs(res)
						// console.log(this.songs)
					}
				} catch (error) {
					// this.$message.error(error)
				}
			},
			// 处理歌曲
			normalizeSongs(list) {
				let ret = []
				list.map(item => {
					if (item.id) {
						ret.push(createSong(item))
					}
				})
				return ret
			},
			// 获取相关歌单推荐
			async getRelatedPlaylist(id) {
				try {
					let res = await this.$api.get(`/related/playlist?id=${id}`)
					if (res.code === 200) {
						this.relatedList = res.playlists
					}
				} catch (error) {
					// this.$message.error(error)
				}
			},
			// 获取歌单收藏者
			async getSubscribersPlaylist(id) {
				let params = {
					id,
					limit: 28,
					offset: 0
				}
				try {
					let res = await this.$api.get(`/playlist/subscribers`, {
						params: params,
					})
					if (res.code === 200) {
						this.subscribers = res.subscribers
					}
				} catch (error) {
					// this.$message.error(error)
				}
			},
			// 获取评论
			async getCommentPlaylist(id) {
				let params = {
					id,
					limit: 28,
					offset: 0
				}
				try {
					let res = await this.$api.get(`/comment/playlist`, {
						params: params,
					})
					if (res.code === 200) {
						if (res.hotComments.length > 0) {
							this.comments = res.hotComments
						} else {
							this.comments = res.comments
						}
					}
				} catch (error) {
					// this.$message.error(error)
				}
			},
			// 打开歌单介绍详情
			openDesc(title, content) {
				// 饿了么弹框组件
				this.$alert(content, title, {
					// 是否可通过点击遮罩关闭 MessageBox
					closeOnClickModal: true,
					// 是否可通过按下 ESC 键关闭 MessageBox
					closeOnPressEscape: true,
					// 自定义类名
					customClass: 'descBox',
					// 是否显示确定按钮
					showConfirmButton: false,
					// 是否将 message 属性作为HTML片段处理
					dangerouslyUseHTMLString: true
				})
			},
			// 收藏歌单
			async collect() {
				let t = this.detail.subscribed ? 2 : 1
				let message = this.detail.subscribed ? '已取消收藏' : '收藏成功'
				try {
					let res = await this.$api.get(`/playlist/subscribe?t=${t}&id=${this.artistId}` )
					if (res.code === 200) {
						this.$message({
							message,
							type: 'success'
						})
						// 重新拉取歌单详情
						setTimeout(() => {
							this.getPlayListDetail(this.artistId, 100)
						}, 300)
					}
				} catch (error) {
					// this.$message.error(error)
					console.log(error)
				}
			},
			// 相关推荐详情
			toDetail(id) {
				this.$message.info('请稍后~')
				this.$router.push({
					name: 'playlistdetail',
					query: {
						id
					}
				})
			},
			// 用户页面
			toUser(id) {
				this.$router.push({
					name: 'personalpage',
					query: {
						id
					}
				})
			},
			// 初始化
			initialize(id) {
				// 歌单详情
				this.getPlayListDetail(id, 100)
				// 相关歌单
				this.getRelatedPlaylist(id)
				// 歌单收藏
				this.getSubscribersPlaylist(id)
				// 评论
				this.getCommentPlaylist(id)
			}
		},
		mounted() {
			// 滚动条滚零
			let contents = document.getElementById('contents')
			contents.scrollTo(0,0)
			let id = this.$route.query.id
			this.artistId = id
			if (id) {
				this.initialize(id)
			}
		},
	}
</script>

<style scoped>
	ul{
		padding-left: 0!important;
		list-style: none;
	}
	.playlistdetailbox {
		display: flex;
		align-items: flex-start;
	}

	.playlistdetailbox .left {
		/* flex: 1; */
		width: 950px;
		padding: 15px;
		border-radius: 8px;
		margin-right: 20px;
	}

	.playlistdetailbox .left .top {
		display: flex;
	}

	.playlistdetailbox .left .top>.avatar {
		width: 200px;
		height: 200px;
		border-radius: 8px;
		position: relative;
		margin-right: 30px;
		flex-shrink: 0;
	}

	.playlistdetailbox .left .top>.avatar img {
		width: 100%;
		height: 100%;
		border-radius: 8px;
		position: relative;
	}

	.playlistdetailbox .left .top>.avatar::before {
		content: '';
		width: 95%;
		height: 95%;
		background: rgba(0, 0, 0, 0.2);
		display: block;
		position: absolute;
		top: 15px;
		right: -5px;
		z-index: 0;
		border-radius: 8px;
	}

	.playlistdetailbox .left .top .info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: left;
	}

	.playlistdetailbox .left .top .info .title {
		width: 100%;
		font-size: 24px;
		font-weight: 700;
		line-height: 24px;
		margin-bottom: 20px;
		margin-top: 10px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.playlistdetailbox .left .top .info .tag a {
		color: #fff;
		background: red;
		margin-right: 15px;
		font-size: 12px;
		cursor: pointer;
		padding: 4px 12px;
		border-radius: 15px;
	}

	.playlistdetailbox .left .top .info .tag a:last-child::after {
		content: '';
	}

	.playlistdetailbox .left .top .info .user {
		margin-bottom: 15px;
	}

	.playlistdetailbox .left .top .info .user .avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		position: relative;
		margin-right: 15px;
		cursor: pointer;
	}

	.playlistdetailbox .left .top .info .user .avatar img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		position: relative;
	}

	.playlistdetailbox .left .top .info .user .nickname {
		font-size: 14px;
		margin-right: 30px;
		cursor: pointer;
	}

	.playlistdetailbox .left .top .info .user .nickname:hover {
		color: red;
	}

	.playlistdetailbox .left .top .info .user .createTime {
		font-size: 14px;
		color: #808080;
	}

	.playlistdetailbox .left .top .info .desc {
		display: flex;
		flex-direction: column;
		line-height: 1.6;
		margin-top: 15px;
	}

	.playlistdetailbox .left .top .info .desc span {
		flex-shrink: 0;
		color: red;
		cursor: pointer;
	}

	.playlistdetailbox .left .top .info .desc p {
		line-height: 1.6;
		font-weight: 400;
		flex: 1;
		font-size: 14px;
	}

	.playlistdetailbox .left .content {
		margin-top: 20px;
	}

	.playlistdetailbox .right {
		width: 350px;
		flex-shrink: 0;
	}

	.playlistdetailbox .right .module {
		padding: 15px;
		width: 100%;
		border-radius: 8px;
		margin-bottom: 20px;
		text-align: left;
	}

	.playlistdetailbox .right .like {
		padding-bottom: 5px;
	}

	.playlistdetailbox .right .like ul {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -5px;
	}

	.playlistdetailbox .right .like ul li {
		flex: 0 0 14.285714285714%;
		max-width: 14.285714285714%;
		padding: 0 5px 10px;
	}

	.playlistdetailbox .right .like ul li .avatar {
		width: 100%;
		border-radius: 3px;
	}

	.playlistdetailbox .right .like ul li .avatar img {
		width: 100%;
		border-radius: 3px;
	}

	.playlistdetailbox .right .related {
		padding-bottom: 5px;
	}

	.playlistdetailbox .right .related ul li {
		display: flex;
		margin-bottom: 15px;
		cursor: pointer;
	}

	.playlistdetailbox .right .related ul li .avatar {
		width: 50px;
		height: 50px;
		border-radius: 3px;
		margin-right: 15px;
		flex-shrink: 0;
	}

	.playlistdetailbox .right .related ul li .avatar img {
		width: 100%;
		border-radius: 3px;
	}

	.playlistdetailbox .right .related ul li .info {
		height: 50px;
		width: calc(100% - 60px);
		flex: 1;
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: left;
	}

	.playlistdetailbox .right .related ul li .info h2 {
		font-size: 14px;
		margin-bottom: 10px;
		width: 100%;
	}

	.playlistdetailbox .right .related ul li .info span {
		font-size: 12px;
		color: #8588c1;
	}

	.playlistdetailbox .right .related ul li .info:hover h2 {
		color: red;
	}

	.playlistdetailbox .right .comment ul li {
		padding: 10px 0;
		width: 100%;
		display: flex;
	}

	.playlistdetailbox .right .comment ul li .avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		margin-right: 12px;
		flex-shrink: 0;
		cursor: pointer;
	}

	.playlistdetailbox .right .comment ul li .avatar img {
		width: 100%;
		border-radius: 50%;
	}

	.playlistdetailbox .right .comment ul li .info {
		flex: 1;
	}

	.playlistdetailbox .right .comment ul li .info h2 {
		font-size: 13px;
		margin-right: 5px;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.playlistdetailbox .right .comment ul li .info h2 small {
		font-size: 12px;
		color: #8588c1;
		font-weight: 200;
	}

	.playlistdetailbox .right .comment ul li .info p {
		width: 100%;
		font-size: 12px;
		color: #666;
		line-height: 1.6;
		padding: 5px 10px;
		background: #f5efef4a;
		margin-top: 5px;
		border-radius: 3px;
	}

	.playlistdetailbox .right .card-headers {
		border-left: 3px solid red;
		height: 20px;
		padding-left: 1rem;
		margin-bottom: 15px;
		font-weight: bold;
	}

	.playlistdetailbox .right .card-headers .icon-like {
		font-size: 20px;
	}
	
	.flex-row{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.nickname,.createTime{
		margin-bottom: 0;
	}
	.ellipsis-two{
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.desc p{
		margin-bottom: 0;
		text-align: left;
	}
	@media screen and (max-width: 1200px) {
		.playlistdetailbox{
			display: block;
		}
		.playlistdetailbox .right{
			width: 100%;
		}
	}
	@media screen and (max-width: 768px) {
		.playlistdetailbox .left .top{
			display: block;
			text-align: left;
		}
	}
</style>
