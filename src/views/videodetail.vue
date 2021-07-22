<template>
	<div class="videodetailbox">
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
					{{ detail.title }}
				</h2>
				<!-- 标签 -->
				<div class="tag">
					<a v-for="item of detail.videoGroup" :key="item.id">#{{ item.name }}</a>
				</div>
				<!-- 时间和次数 -->
				<p class="flex-row">
					<span>发布：{{ handle.dateFormat(detail.publishTime, 'YYYY-MM-DD')}}</span>
					<span v-if="detail.playTime">播放次数：{{ handle.tranNumber(detail.playTime, 1) }}</span>
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
						{{ detail.subscribeCount }}
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
						<span class="noticom"><a>&nbsp;{{videoDetailInfo.commentCount}} 条评论</a>
						</span>
					</div>
					<!-- 评论框 -->
					<transition name="fade">
						<Commentbox 
							v-if="currentCommentId == ''" 
							:currentCommentId="currentCommentId"
							:clearContent="clearContent" 
							@commentSubmit="commentSubmit" 
						/>
					</transition>
				</div>
				<!-- 评论列表 -->
				<Commentlist 
					v-if="hotComments.length > 0" 
					title="精彩评论" 
					:commentList="hotComments"
					:currentCommentId="currentCommentId" 
					@commentHandle="commentHandle" 
					@cancelComment="cancelComment"
					@commentSubmit="commentSubmit" 
					@commentLike="commentLike" 
				/>
				<Commentlist 
					title="最新评论" 
					:commentList="newestComment" 
					:currentCommentId="currentCommentId"
					@deletecomment="deletecomments" 
					@commentHandle="commentHandle" 
					@cancelComment="cancelComment"
					@commentSubmit="commentSubmit" 
					@commentLike="commentLike" 
				/>
			</div>
		</div>
		<!-- 右栏 -->
		<div class="right">
			<div class="profile module shadow">
				<div class="card-headers flex-row">
					<span>视频简介</span>
				</div>
				<div class="content">
					<div class="author">
						<div class="avatar" @click="toUser(creator.userId)">
							<img :src="creator.avatarUrl" />
						</div>
						<p class="name" @click="toUser(creator.userId)">{{ creator.nickname }}</p>
					</div>
					<p v-if="detail.description">{{ detail.description }}</p>
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
							<img :src="item.coverUrl" :alt="item.title" :title="item.title" />
							<div class="action">
								<button v-if="!item.isLive" class="play flex-center" title="播放"
									@click="toDetail(item.vid)">
									<i class="el-icon-caret-right" style="font-size: 16px;"></i>
								</button>
							</div>
						</div>
						<div class="info">
							<h2 class="flex-row ellipsis">
								{{ item.name }}
							</h2>
							<div class="author">
								by
								<span v-for="author of item.creator" :key="author.userId">
									<small>
										{{ author.userName }}
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
	import {mapGetters,mapMutations} from 'vuex'
	export default {
		name: 'videodetail',
		data() {
			return {
				// 视频详情
				detail: {},
				creator: {},
				// 视频点赞数据
				videoDetailInfo: {},
				// 视频地址
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
				// 当前视频的id
				videoId: '',
				// 是否清空评论框内容
				clearContent: false,
				// 当前页
				currentPage: 0,
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
			// 滚动条滚零
			let contents = document.getElementById('contents')
			contents.scrollTo(0,0)
			let id = this.$route.query.id
			if (id) {
				this.videoId = id
				this.initialize(id)
			}
		},
		methods: {
			// 获取视频播放地址
			async getMvUrl(id) {
				try {
					let res = await this.$api.get(`/video/url?id=${id}`)
					if (res.code === 200) {
						this.videoUrl = res.urls[0].url
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取视频详情
			async getMvDetail(id) {
				try {
					let res = await this.$api.get(`/video/detail?id=${id}`)
					if (res.code === 200) {
						res.data.videoGroup.map(item => {
							if (item.name.indexOf('#') != -1) {
								// 过滤#
								item.name = item.name.replace(/#/g, '')
							}
						})
						this.detail = res.data
						this.creator = res.data.creator
						// console.log(this.detail)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取视频点赞转发评论数数据
			async getMvDetailInfo(id) {
				try {
					let timestamp = new Date().getTime()
					let res = await this.$api.get(`/video/detail/info?vid=${id}&timestamp=${timestamp}`)
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
			// 获取相关视频
			async getMvRelated(id) {
				try {
					let res = await this.$api.get(`/related/allvideo?id=${id}`)
					if (res.code === 200) {
						this.relatedList = res.data
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取视频评论
			async getMvComments(id) {
				let timestamp = new Date().getTime()
				let params = {
					id,
					limit: this.limit,
					offset: this.offset,
					timestamp
				}
				try {
					let res = await this.$api.get(`/comment/video`, {
						params: params
					})
					if (res.code === 200) {
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
						type: 5,
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
							console.log(err)
						})
				}
			},
			// 删除评论
			async deletecomments(commentId) {
				let timestamp = new Date().getTime()
				let props = {
					params: {
						t: 0,
						type: 5,
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
					type: 5,
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
			// 视频资源点赞
			async likeResource() {
				// 对应视频资源
				let type = 5
				let t = 1
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
			// 点击相关推荐视频播放
			toDetail(id) {
				this.$message.info('请稍等~')
				// 播放视频暂停播放
				this.upplaYing(false)
				// 滚动条滚零
				let contents = document.getElementById('contents')
				contents.scrollTo(0,0)
				this.$router.push({
					name: 'videodetail',
					query: {
						id
					}
				})
			},
			...mapMutations([
				'upplaYing',
			]),
			// 用户页
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

	.videodetailbox {
		display: flex;
	}

	.videodetailbox .active {
		color: #FA2800 !important;
	}

	.videodetailbox .left {
		/* flex: 1; */
		width: 950px;
		padding: 15px;
		border-radius: 8px;
		margin-right: 20px;
	}

	.videodetailbox .video-container {
		position: relative;
		padding-top: 56.25%;
	}

	.videodetailbox .video-container video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
	}

	.videodetailbox .video-footer {
		margin-top: 10px;
		text-align: left;
	}

	.videodetailbox .video-footer .title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.videodetailbox .video-footer .title .iconmv {
		font-size: 21px;
		color: #FA2800;
		margin-right: 10px;
	}

	.videodetailbox .left .video-footer .tag {
		margin-bottom: 8px;
	}

	.videodetailbox .left .video-footer .tag a {
		font-size: 12px;
		color: #FA2800;
		margin-right: 10px;
		cursor: pointer;
	}

	.videodetailbox .left .video-footer p span {
		margin-right: 30px;
		font-size: 12px;
		color: #161e27;
	}

	.videodetailbox .left .video-footer .follow {
		display: flex;
		margin-top: 10px;
	}

	.videodetailbox .left .video-footer .follow .box {
		color: #161e27;
		cursor: pointer;
		padding-right: 25px;
	}

	.videodetailbox .left .video-footer .follow .box i {
		font-size: 20px;
		color: #161e27;
	}

	.videodetailbox .left .comments {
		margin-top: 25px;
	}

	.videodetailbox .left .comments .title {
		width: 100%;
		height: 50px;
		border-radius: 3px;
		padding: 0 3px;
		border-bottom: 1px solid #f1f1f1;
	}

	.videodetailbox .left .comments .title i {
		color: #666;
		font-size: 18px;
		margin-right: 10px;
	}

	.videodetailbox .left .comments .title span {
		margin-left: 5px;
	}

	.videodetailbox .left .comments .comment-box {
		margin-top: 20px;
	}

	.videodetailbox .left .comments .comment-box p i {
		margin-right: 10px;
	}

	.videodetailbox .left .comments .comment-box p span {
		flex: 1;
	}

	.videodetailbox .left .comments .comment-box p .cancel-comment {
		color: #d9dfff;
		font-size: 12px;
		background: none;
		padding: 6px 10px;
		border-radius: 2px;
		border: 1px solid #dee3ff;
		cursor: pointer;
	}

	.videodetailbox .left .comments .comment-box .comment-form {
		display: flex;
		margin-top: 1.5em;
	}

	.videodetailbox .left .comments .comment-box .comment-form .avatar {
		width: 50px;
		height: 50px;
		border-radius: 3px;
		margin-right: 20px;
		position: relative;
		flex-shrink: 0;
	}

	.videodetailbox .left .comments .comment-box .comment-form .avatar img {
		width: 100%;
		border-radius: 3px;
	}

	.videodetailbox .left .comments .comment-box .comment-form .comarea {
		flex: 1;
	}

	.videodetailbox .left .comments .comment-box .comment-form .comarea textarea {
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

	.videodetailbox .left .comments .comment-foot {
		margin-top: 15px;
	}

	.videodetailbox .left .comments .comment-foot .comment-btn {
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

	.videodetailbox .left .comments .page-wrap {
		margin-top: 20px;
	}

	.videodetailbox .right {
		width: 350px;
	}

	.videodetailbox .right .module {
		padding: 15px;
		width: 100%;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.videodetailbox .right .profile .author {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		margin-top: 5px;
		cursor: pointer;
	}

	.videodetailbox .right .profile .author .avatar {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		margin-right: 15px;
	}

	.videodetailbox .right .profile .author .avatar img {
		width: 40px;
		height: 40px;
		border-radius: 20px;
	}

	.videodetailbox .right .profile .author p {
		flex: 1;
	}

	.videodetailbox .right .profile .author .follow {
		padding: 3px 10px;
		font-size: 12px;
		background: #FA2800;
		color: #fff;
		border: 1px solid #FA2800;
		cursor: pointer;
		border-radius: 18px;
	}

	.videodetailbox .right .profile .author .follow:hover {
		background: none;
		color: #FA2800;
	}

	.videodetailbox .right .related {
		padding-bottom: 5px;
	}

	.videodetailbox .right .related ul li {
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
	}

	.videodetailbox .right .related ul li .avatar {
		width: 100%;
		margin-right: 15px;
		flex-shrink: 0;
		position: relative;
	}

	.videodetailbox .right .related ul li .avatar img {
		width: 100%;
	}

	.videodetailbox .right .related ul li .avatar .action {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.videodetailbox .right .related ul li .avatar .action .play {
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: 50%;
		color: #fff;
		cursor: pointer;
		background-color: #FA2800;
	}

	.videodetailbox .right .related ul li .avatar .action .play i {
		font-size: 12px;
	}

	.videodetailbox .right .related ul li .info {
		height: 50px;
		width: calc(100% - 50px);
		text-align: left;
		/* 		flex: 1;
		display: flex;
		justify-content: center;
		flex-direction: column; */
	}

	.videodetailbox .right .related ul li .info h2 {
		font-size: 14px;
		margin-bottom: 3px;
		margin-top: 6px;
		width: 100%;
		min-height: 20px;
		font-weight: 600;
	}

	.videodetailbox .right .related ul li .info h2 i {
		color: #FA2800;
		font-size: 24px;
		margin-right: 5px;
	}

	.videodetailbox .right .related ul li .info .author {
		font-size: 12px;
		color: #8588c1;
	}

	.videodetailbox .right .related ul li .info .author span {
		font-size: 12px;
		color: #8588c1;
	}

	.videodetailbox .right .related ul li .info .author span::after {
		content: '/';
		margin-left: 5px;
	}

	.videodetailbox .right .related ul li .info .author span:last-child::after {
		content: '';
	}

	.videodetailbox .right .related ul li:hover .action {
		display: flex;
	}

	.videodetailbox .right .comment ul li {
		padding: 10px 0;
		width: 100%;
		display: flex;
	}

	.videodetailbox .right .comment ul li .avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		margin-right: 12px;
		flex-shrink: 0;
	}

	.videodetailbox .right .comment ul li .avatar img {
		width: 100%;
		border-radius: 50%;
	}

	.videodetailbox .right .comment ul li .info {
		flex: 1;
	}

	.videodetailbox .right .comment ul li .info h2 {
		font-size: 15px;
		margin-right: 5px;
		margin-bottom: 10px;
	}

	.videodetailbox .right .comment ul li .info h2 small {
		font-size: 12px;
		color: #a5a5c1;
		font-weight: 200;
	}

	.videodetailbox .right .comment ul li .info p {
		width: 100%;
		font-size: 12px;
		color: #666;
		line-height: 1.6;
		padding: 5px 10px;
		background: #f5f5f5;
		margin-top: 5px;
		border-radius: 3px;
	}

	.videodetailbox .right .card-headers {
		border-left: 3px solid #FA2800;
		height: 20px;
		padding-left: 1rem;
		margin-bottom: 15px;
		font-weight: bold;
	}

	.videodetailbox .right .content {
		color: #484e61;
		font-size: 14px;
		text-align: left;
	}

	.videodetailbox .right .content p {
		margin-bottom: 0 !important;
	}

	.videodetailbox .right .card-headers .icon-like {
		font-size: 20px;
	}

	.comment-list ul li .info .content {
		background: #f5efef4a !important;
	}
	
	@media screen and (max-width: 768px) {
		.videodetailbox{
			display: block;
		}
		.videodetailbox .left,.videodetailbox .right{
			width: 100%;
		}
	}
</style>
