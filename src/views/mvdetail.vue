<template>
	<div class="mvdetailbox">
		<!-- 左栏 -->
		<div class="left shadow">
			<!-- 视频 -->
			<div class="video-container">
				<video 
					v-show="!isDrawer"
					:src="videoUrl" 
					controls="controls" 
					autoplay 
					controlslist="nodownload"
				>
				</video>
			</div>
			<!-- 视频底部 -->
			<div class="video-footer">
				<!-- 标题 -->
				<h2 class="title flex-row">
					<i class="iconfont dj-icon-MV iconmv"></i>
					{{ detail.name }}
				</h2>
				<!-- 标签 -->
				<div class="tag">
					<a v-for="item of detail.videoGroup" :key="item.id">#{{ item.name }}</a>
				</div>
				<!-- 时间和次数 -->
				<p class="flex-row">
					<span>发布：{{ handle.dateFormat(detail.publishTime, 'YYYY-MM-DD')}}</span>
					<span v-if="detail.playCount">播放次数：{{ handle.tranNumber(detail.playCount, 1) }}</span>
				</p>
				<!-- 操作 -->
				<div class="follow">
					<!-- 点赞 -->
					<div class="box" @click="likeResource">
						<i class="iconfont dj-icon-zan" :class="videoDetailInfo.isLike ? 'active' : ''"></i>
						{{ videoDetailInfo.likeCount }}
					</div>
					<!-- 收藏 -->
					<div class="box">
						<i class="iconfont dj-icon-yishoucang"></i>
						{{ detail.subCount }}
					</div>
					<!-- 转发 -->
					<div class="box">
						<i class="iconfont dj-icon-fabu"></i>
						{{ videoDetailInfo.shareCount }}
					</div>
				</div>
				<!-- 评论 -->
				<div class="comment-box" style="margin-top: 50px;">
					<div class="title flex-row">
						<i class="el-icon-chat-dot-round" style="margin-right: 10px;"></i>Comments |
						<span class="noticom"><a>&nbsp;{{commentTotal}} 条评论</a>
						</span>
					</div>
					<!-- 评论框 -->
					<transition name="fade">
						<Commentbox v-if="currentCommentId == ''" :currentCommentId="currentCommentId"
							:clearContent="clearContent" @commentSubmit="commentSubmit" />
					</transition>
				</div>
				<!-- 评论列表 -->
				<Commentlist v-if="hotComments.length > 0" title="精彩评论" :commentList="hotComments"
					:currentCommentId="currentCommentId" @commentHandle="commentHandle" @cancelComment="cancelComment"
					@commentSubmit="commentSubmit" @commentLike="commentLike" />
				<Commentlist title="最新评论" :commentList="newestComment" :currentCommentId="currentCommentId"
					@deletecomment="deletecomments" @commentHandle="commentHandle" @cancelComment="cancelComment"
					@commentSubmit="commentSubmit" @commentLike="commentLike" />
			</div>
		</div>
		<!-- 右栏 -->
		<div class="right">
			<div class="profile module shadow">
				<div class="card-headers flex-row">
					<span>视频简介</span>
				</div>
				<div class="content">
					<p v-if="detail.desc">{{ detail.desc }}</p>
					<p v-else>视频暂无简介</p>
				</div>
			</div>
			<div class="related module shadow">
				<div class="card-headers flex-row">
					<span>相关推荐</span>
				</div>
				<ul>
					<li v-for="item of relatedList" :key="item.vid">
						<div class="avatar">
							<img :src="item.cover" :alt="item.name" :title="item.name" />
							<div class="action">
								<button class="play flex-center" title="播放" v-if="!item.isLive"
									@click="toDetail(item.id)">
									<i class="el-icon-caret-right" style="font-size: 16px;"></i>
								</button>
							</div>
						</div>
						<div class="info">
							<h2 class="flex-row ellipsis">
								<i class="iconfont dj-icon-MV iconmv" style="font-size: 20px;"></i>
								{{ item.name }}
							</h2>
							<div class="author">
								by
								<span v-for="author of item.artists" :key="author.id">
									<small>
										{{ author.name }}
									</small>
								</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Commentbox from '@/components/contents/commentBox'
	import Commentlist from '@/components/contents/commentlist'
	import {mapGetters} from 'vuex'
	export default {
		name: 'videodetail',
		data() {
			return {
				// mv详情
				detail: {},
				// mv点赞数据
				videoDetailInfo: {},
				// mv地址
				videoUrl: '',
				// 相关推荐
				relatedList: [],
				// 精彩评论
				hotComments: [],
				// 最新评论
				newestComment: [],
				// 当前评论id
				currentCommentId: '',
				// 获取数量
				limit: 20,
				// 偏移
				offset: 0,
				// 当前mv的id
				videoId: '',
				// 评论数量
				commentTotal: 0,
				// 是否清空评论框内容
				clearContent: false,
			}
		},
		components: {
			Commentbox,
			Commentlist
		},
		computed: {
			...mapGetters([
				'userInfo', 
				'loginStatu',
				'isDrawer'
			])
		},
		watch: {
			$route() {
				let id = this.$route.query.id || this.videoId
				if (id) {
					this.initialize(id)
				}
			}
		},
		mounted() {
			let id = this.$route.query.id
			if (id) {
				this.videoId = id
				this.initialize(id)
			}
		},
		methods: {
			// 获取mv播放地址
			async getMvUrl(id) {
				try {
					let res = await this.$api.get(`/mv/url?id=${id}`)
					if (res.code === 200) {
						this.videoUrl = res.data.url
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取mv详情
			async getMvDetail(id) {
				try {
					let res = await this.$api.get(`/mv/detail?mvid=${id}`)
					if (res.code === 200) {
						res.data.videoGroup.map(item => {
							if (item.name.indexOf('#') != -1) {
								item.name = item.name.replace(/#/g, '')
							}
						})
						this.detail = res.data
						// console.log(this.detail)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取mv点赞转发评论数数据
			async getMvDetailInfo(id) {
				try {
					let timestamp = new Date().getTime()
					let res = await this.$api.get(`/mv/detail/info?mvid=${id}&timestamp=${timestamp}`)
					if (res.code === 200) {
						let detail = {
							isLike: res.liked,
							likeCount: res.likedCount,
							shareCount: res.shareCount,
							commentCount: res.commentCount
						}
						this.videoDetailInfo = detail
						// console.log(this.videoDetailInfo)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取相关mv
			async getMvRelated(id) {
				try {
					let res = await this.$api.get(`/simi/mv?mvid=${id}`)
					if (res.code === 200) {
						this.relatedList = res.mvs
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取mv评论
			async getMvComments(id) {
				let timestamp = new Date().getTime()
				let params = {
					id,
					limit: this.limit,
					offset: this.offset,
					timestamp
				}
				try {
					// 过滤#
					let res = await this.$api.get(`/comment/mv`, {
						params: params
					})
					if (res.code === 200) {
						// 赋值评论总数
						this.commentTotal = res.total
						// 是否有热评
						if (res.hotComments) {
							this.hotComments = res.hotComments
						} else {
							this.hotComments = []
						}
						this.newestComment = res.comments
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 点击回复评论
			commentHandle(id) {
				this.currentCommentId = id
			},
			// 取消评论
			cancelComment() {
				this.currentCommentId = ''
			},
			// 提交评论
			commentSubmit(content) {
				if (!content) {
					this.$message.error('什么都没写，你点锤子')
					return
				} else {
					let timestamp = new Date().getTime()
					let params = {
						type: 1,
						id: this.videoId,
						content: content,
						timestamp
					}
					if (this.currentCommentId == '') {
						// 发布评论
						params.t = 1
					} else {
						// 回复评论
						params.t = 2
						params.commentId = this.currentCommentId
					}
					this.$api
						.get(`/comment`, {
							params: params
						})
						.then(res => {
							if (res.code === 200) {
								this.$message.success('评论成功！')
								// 将评论回复定位和输入框清空
								this.cancelComment()
								this.clearContent = true
								// 重新拉取评论
								this.getMvComments(this.videoId)
							}
						})
						.catch(err => {
							// 饿了么Notification通知
							this.$notify.error({
								title: err.data.dialog.title,
								message: err.data.dialog.subtitle
							})
						})
				}
			},
			// 删除评论
			async deletecomments(commentId) {
				let timestamp = new Date().getTime()
				let props = {
					params: {
						t: 0,
						type: 1,
						id: this.videoId,
						commentId: commentId,
						timestamp: timestamp,
					}
				}
				try {
					let res = await this.$api.get("/comment", props)
					if (res.code === 200) {
						this.$message.success("删除成功！")
						this.getMvComments(this.videoId)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 评论点赞
			async commentLike(id, liked) {
				let timestamp = new Date().getTime()
				let params = {
					id: this.videoId,
					cid: id,
					type: 1,
					timestamp
				}
				if (liked) {
					// 取消点赞
					params.t = 0
				} else {
					// 点赞
					params.t = 1
				}
				try {
					let res = await this.$api.get(`/comment/like`, {
						params: params
					})
					if (res.code === 200) {
						this.getMvComments(this.videoId)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// mv资源点赞
			async likeResource() {
				// 对应mv资源
				let type = 1
				let t = 2
				if (this.videoDetailInfo.isLike) {
					t = 2
				} else {
					t = 1
				}
				let timestamp = new Date().getTime()
				let id = this.videoId
				try {
					let res = await this.$api.get(`/resource/like?type=${type}&t=${t}&id=${id}&timestamp=${timestamp}`)
					if (res.code === 200) {
						this.getMvDetailInfo(this.videoId)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 点击相关推荐mv播放
			toDetail(id) {
				this.$router.push({
					name: 'mvdetail',
					query: {
						id
					}
				})
			},
			// 初始化
			initialize(id) {
				this.getMvUrl(id)
				this.getMvDetail(id)
				this.getMvRelated(id)
				this.getMvDetailInfo(id)
				this.getMvComments(id)
			}
		},
	}
</script>

<style scoped>
	ul {
		padding-left: 0 !important;
		list-style: none;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.mvdetailbox {
		display: flex;
	}

	.mvdetailbox .active {
		color: #FA2800 !important;
	}

	.mvdetailbox .left {
		/* flex: 1; */
		width: 950px;
		padding: 15px;
		border-radius: 8px;
		margin-right: 20px;
	}

	.mvdetailbox .video-container {
		position: relative;
		padding-top: 56.25%;
		background: #000;
	}

	.mvdetailbox .video-container video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.mvdetailbox .video-footer {
		margin-top: 10px;
		text-align: left;
	}

	.mvdetailbox .video-footer .title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.mvdetailbox .video-footer .title .iconmv {
		font-size: 21px;
		color: #FA2800;
		margin-right: 10px;
	}

	.mvdetailbox .left .video-footer .tag {
		margin-bottom: 8px;
	}

	.mvdetailbox .left .video-footer .tag a {
		font-size: 12px;
		color: #FA2800;
		margin-right: 10px;
		cursor: pointer;
	}

	.mvdetailbox .left .video-footer p span {
		margin-right: 30px;
		font-size: 12px;
		color: #161e27;
	}

	.mvdetailbox .left .video-footer .follow {
		display: flex;
		margin-top: 10px;
	}

	.mvdetailbox .left .video-footer .follow .box {
		color: #161e27;
		cursor: pointer;
		padding-right: 25px;
	}

	.mvdetailbox .left .video-footer .follow .box i {
		font-size: 20px;
		color: #161e27;
	}

	.mvdetailbox .left .comments {
		margin-top: 25px;
	}

	.mvdetailbox .left .comments .title {
		width: 100%;
		height: 50px;
		border-radius: 3px;
		padding: 0 3px;
		border-bottom: 1px solid #f1f1f1;
	}

	.mvdetailbox .left .comments .title i {
		color: #666;
		font-size: 18px;
		margin-right: 10px;
	}

	.mvdetailbox .left .comments .title span {
		margin-left: 5px;
	}

	.mvdetailbox .left .comments .comment-box {
		margin-top: 20px;
	}

	.mvdetailbox .left .comments .comment-box p i {
		margin-right: 10px;
	}

	.mvdetailbox .left .comments .comment-box p span {
		flex: 1;
	}

	.mvdetailbox .left .comments .comment-box p .cancel-comment {
		color: #d9dfff;
		font-size: 12px;
		background: none;
		padding: 6px 10px;
		border-radius: 2px;
		border: 1px solid #dee3ff;
		cursor: pointer;
	}

	.mvdetailbox .left .comments .comment-box .comment-form {
		display: flex;
		margin-top: 1.5em;
	}

	.mvdetailbox .left .comments .comment-box .comment-form .avatar {
		width: 50px;
		height: 50px;
		border-radius: 3px;
		margin-right: 20px;
		position: relative;
		flex-shrink: 0;
	}

	.mvdetailbox .left .comments .comment-box .comment-form .avatar img {
		width: 100%;
		border-radius: 3px;
	}

	.mvdetailbox .left .comments .comment-box .comment-form .comarea {
		flex: 1;
	}

	.mvdetailbox .left .comments .comment-box .comment-form .comarea textarea {
		width: 100%;
		outline: none;
		background: #f8f9ff;
		resize: none;
		padding: 6px 12px;
		color: #666;
		border: 1px solid #eaebff;
		border-radius: 3px;
		font-size: 13px;
		height: 80px;
	}

	.mvdetailbox .left .comments .comment-foot {
		margin-top: 15px;
	}

	.mvdetailbox .left .comments .comment-foot .comment-btn {
		color: #fff;
		padding: 10px 30px;
		font-size: 0.75rem;
		border-radius: 3px;
		border: none;
		cursor: pointer;
		outline: none;
		background: #ff416c;
		/* fallback for old browsers */
		background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
		/* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to right, #ff4b2b, #ff416c);
		/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}

	.mvdetailbox .left .comments .page-wrap {
		margin-top: 20px;
	}

	.mvdetailbox .right {
		width: 350px;
	}

	.mvdetailbox .right .module {
		padding: 15px;
		width: 100%;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.mvdetailbox .right .profile .author {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		margin-top: 5px;
	}

	.mvdetailbox .right .profile .author .avatar {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		margin-right: 15px;
	}

	.mvdetailbox .right .profile .author .avatar img {
		width: 40px;
		height: 40px;
		border-radius: 20px;
	}

	.mvdetailbox .right .profile .author p {
		flex: 1;
	}

	.mvdetailbox .right .profile .author .follow {
		padding: 3px 10px;
		font-size: 12px;
		background: #FA2800;
		color: #fff;
		border: 1px solid #FA2800;
		cursor: pointer;
		border-radius: 18px;
	}

	.mvdetailbox .right .profile .author .follow:hover {
		background: none;
		color: #FA2800;
	}

	.mvdetailbox .right .related {
		padding-bottom: 5px;
	}

	.mvdetailbox .right .related ul li {
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
	}

	.mvdetailbox .right .related ul li .avatar {
		width: 100%;
		margin-right: 15px;
		flex-shrink: 0;
		position: relative;
	}

	.mvdetailbox .right .related ul li .avatar img {
		width: 100%;
	}

	.mvdetailbox .right .related ul li .avatar .action {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.mvdetailbox .right .related ul li .avatar .action .play {
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: 50%;
		color: #fff;
		cursor: pointer;
		background-color: #FA2800;
	}

	.mvdetailbox .right .related ul li .avatar .action .play i {
		font-size: 12px;
	}

	.mvdetailbox .right .related ul li .info {
		height: 50px;
		width: calc(100% - 50px);
		text-align: left;
		/* 		flex: 1;
		display: flex;
		justify-content: center;
		flex-direction: column; */
	}

	.mvdetailbox .right .related ul li .info h2 {
		font-size: 14px;
		margin-bottom: 3px;
		margin-top: 6px;
		width: 100%;
		min-height: 20px;
		font-weight: 600;
	}

	.mvdetailbox .right .related ul li .info h2 i {
		color: #FA2800;
		font-size: 24px;
		margin-right: 5px;
	}

	.mvdetailbox .right .related ul li .info .author {
		font-size: 12px;
		color: #8588c1;
	}

	.mvdetailbox .right .related ul li .info .author span {
		font-size: 12px;
		color: #8588c1;
	}

	.mvdetailbox .right .related ul li .info .author span::after {
		content: '/';
		margin-left: 5px;
	}

	.mvdetailbox .right .related ul li .info .author span:last-child::after {
		content: '';
	}

	.mvdetailbox .right .related ul li:hover .action {
		display: flex;
	}

	.mvdetailbox .right .comment ul li {
		padding: 10px 0;
		width: 100%;
		display: flex;
	}

	.mvdetailbox .right .comment ul li .avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		margin-right: 12px;
		flex-shrink: 0;
	}

	.mvdetailbox .right .comment ul li .avatar img {
		width: 100%;
		border-radius: 50%;
	}

	.mvdetailbox .right .comment ul li .info {
		flex: 1;
	}

	.mvdetailbox .right .comment ul li .info h2 {
		font-size: 15px;
		margin-right: 5px;
		margin-bottom: 10px;
	}

	.mvdetailbox .right .comment ul li .info h2 small {
		font-size: 12px;
		color: #a5a5c1;
		font-weight: 200;
	}

	.mvdetailbox .right .comment ul li .info p {
		width: 100%;
		font-size: 12px;
		color: #666;
		line-height: 1.6;
		padding: 5px 10px;
		background: #f5f5f5;
		margin-top: 5px;
		border-radius: 3px;
	}

	.mvdetailbox .right .card-headers {
		border-left: 3px solid #FA2800;
		height: 20px;
		padding-left: 1rem;
		margin-bottom: 15px;
		font-weight: bold;
	}

	.mvdetailbox .right .content {
		color: #484e61;
		font-size: 14px;
	}

	.mvdetailbox .right .content p {
		margin-bottom: 0 !important;
	}

	.mvdetailbox .right .card-headers .icon-like {
		font-size: 20px;
	}

	.comment-list ul li .info .content {
		background: #f5efef4a !important;
	}

	@media screen and (max-width: 768px) {
		.mvdetailbox {
			display: block;
		}

		.mvdetailbox .left,
		.mvdetailbox .right {
			width: 100%;
		}
	}
</style>
