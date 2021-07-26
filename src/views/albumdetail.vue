<template>
	<div class="playlistdetailbox" v-if="detail">
		<!-- 左栏 -->
		<div class="left shadow">
			<div class="top">
				<!-- 封面 -->
				<div class="avatar">
					<img :src="detail.picUrl" alt="" />
				</div>
				<!-- 专辑信息 -->
				<div class="info">
					<div class="title flex-between">
						<span>{{detail.name}}</span>
					</div>
					<div class="user flex-row">
						<div class="avatar">
							<img :src="creator.picUrl" alt="" />
						</div>
						<p class="nickname">{{creator.name}}</p>
						<p class="createTime" v-if="detail.publishTime">
							{{handle.dateFormat(detail.publishTime, 'YYYY-MM-DD')}}创建
						</p>
					</div>
					<div class="tag flex-row">
						发行公司：
						{{detail.company}}
					</div>
					<div class="desc">
						<p class="ellipsis-two" v-html="detail.description"></p>
						<span class="flex-row" @click="openDesc(detail.name, detail.description)"
							v-if="txtLength(detail.description) > 50">全部
							<i class="el-icon-arrow-right"></i></span>
					</div>
				</div>
			</div>
			<div class="content">
				<Songlist :songlist="songs" :width1="300" :width2="200" :width3="200" />
			</div>
		</div>
		<!-- 右栏 -->
		<div class="right">
			<div class="related module shadow">
				<div class="card-headers flex-row">
					<span>热门专辑</span>
				</div>
				<ul>
					<li v-for="item of hotAlbums" :key="item.id" @click="toDetail(item.id)">
						<div class="avatar">
							<img :src="item.picUrl" :alt="item.name" :title="item.name" />
						</div>
						<div class="info">
							<h2 class="ellipsis" :title="item.name">{{ item.name }}</h2>
							<span>by <small> {{ item.artist.name }}</small></span>
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
				// 热门专辑
				hotAlbums: [],
				// 评论
				comments: [],
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
				let id = this.$route.query.id || this.singer.id
				if (id) {
					this.initialize(id)
				}
			}
		},
		mounted() {
			let id = this.$route.query.id
			this.artistId = id
			if (id) {
				this.initialize(id)
			}
		},
		methods: {
			// 获取专辑内容
			async getalbumDetail(id) {
				let timestamp = new Date().getTime()
				try {
					let res = await this.$api.get(`/album?id=${id}&timestamp=${timestamp}`)
					// console.log(res)
					if (res.code === 200) {
						this.detail = res.album
						this.creator = res.album.artist
						this.songs = this.normalizeSongs(res.songs)
						this.getartistAlbum()
					}
				} catch (err) {
					console.log(err)
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
			// 获取歌手专辑(热门专辑)
			async getartistAlbum() {
				let timestamp = new Date().getTime()
				let params = {
					id: this.creator.id,
					limit: 5,
					offset: 0,
					timestamp
				}
				try {
					let res = await this.$api.get(`/artist/album`, { params: params })
					if (res.code === 200) {
						this.hotAlbums = res.hotAlbums
					}
				} catch (err) {
					console.log(err)
				}
			},
			// 获取评论
			async getCommentAlbum(id) {
				let params = {
					id,
					limit: 28,
					offset: 0
				}
				try {
					let res = await this.$api.get(`/comment/album`, {
						params: params,
					})
					if (res.code === 200) {
						if (res.hotComments.length > 0) {
							this.comments = res.hotComments
						} else {
							this.comments = res.comments
						}
					}
				} catch (err) {
					// this.$message.error(error)
					console.log(err)
				}
			},
			// 打开专辑介绍详情
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
			// 热门专辑详情
			toDetail(id) {
				this.$message.info('请稍后~')
				this.$router.push({
					name: 'albumdetail',
					query: {
						id
					}
				})
			},
			// 用户页面
			toUser(id) {
				console.log(id)
				// this.$router.push({
				// 	name: 'personal',
				// 	query: {
				// 		id
				// 	}
				// })
			},
			// 初始化
			initialize(id) {
				// 歌单详情
				this.getalbumDetail(id)
				// 评论
				this.getCommentAlbum(id)
			}
		},
	}
</script>

<style scoped>
	ul {
		padding-left: 0 !important;
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
		font-weight: 600;
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

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.nickname,
	.createTime {
		margin-bottom: 0;
	}

	.ellipsis-two {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.desc p {
		margin-bottom: 0;
		text-align: left;
	}

	@media screen and (max-width: 1200px) {
		.playlistdetailbox {
			display: block;
		}

		.playlistdetailbox .right {
			width: 100%;
		}
	}

	@media screen and (max-width: 768px) {
		.playlistdetailbox .left .top {
			display: block;
			text-align: left;
		}
	}
</style>
