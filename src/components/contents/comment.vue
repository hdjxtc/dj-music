<template>
	<div class="comments">
		<div class="comment-box">
			<div class="title flex-row">
				<i class="el-icon-chat-dot-round" style="margin-right: 10px;"></i>Comments |
				<span class="noticom"><a>{{commentTotal}} 条评论</a>
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
		<Commentlist title="最新评论" 
			:commentList="newestComment" 
			:currentCommentId="currentCommentId"
			@deletecomment="deletecomments" 
			@commentHandle="commentHandle" 
			@cancelComment="cancelComment"
			@commentSubmit="commentSubmit" 
			@commentLike="commentLike" 
		/>
	</div>
</template>

<script>
	import Commentbox from './commentBox'
	import Commentlist from './commentlist'
	export default {
		name: 'comment',
		data() {
			return {
				// 获取数量
				limit: 20,
				// 偏移
				offset: 0,
				// 评论数量
				commentTotal: 0,
				// 精彩评论
				hotComments: [],
				// 最新评论
				newestComment: [],
				// 当前评论id
				currentCommentId: '',
				// 是否清空评论框内容
				clearContent: false,
			}
		},
		props: {
			// 当前歌曲
			currentSong: {
				type: Object
			},
		},
		watch: {
			currentSong() {
				let id = this.currentSong.id
				this.getSongcomments(id)
				// 切歌时初始化当前评论id
				this.currentCommentId =  ''
			}
		},
		mounted() {
			// 初始化
			let id = this.currentSong.id
			this.getSongcomments(id)
		},
		components: {
			Commentbox,
			Commentlist
		},
		methods: {
			// 获取歌曲评论
			async getSongcomments(id) {
				// console.log(id)
				let timestamp = new Date().getTime()
				let props = {
					params: {
						id,
						limit: this.limit,
						offset: this.offset,
						timestamp: timestamp
					}
				}
				try {
					let res = await this.$api.get("/comment/music", props)
					if (res.code === 200) {
						this.commentTotal = res.total
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
			async commentSubmit(content) {
				if (!content) {
					this.$message.error('什么都没写，你点锤子')
					return
				} else {
					let timestamp = new Date().getTime()
					let props = {
						params: {
							type: 0,
							id: this.currentSong.id,
							content: content,
							timestamp: timestamp
						}
					}
					if (this.currentCommentId == '') {
						// 发布评论
						props.params.t = 1
					} else {
						// 回复评论
						props.params.t = 2
						props.params.commentId = this.currentCommentId
					}
					try {
						let res = await this.$api.get("/comment", props)
						if (res.code === 200) {
							this.$message.success("评论成功！")
							// 将评论回复定位和输入框清空
							this.cancelComment()
							this.clearContent = true
							// 重新获取最新评论
							this.getSongcomments(this.currentSong.id)
						}
					} catch (error) {
						// this.$message.warning("该资源不允许评论！")
						console.log(error)
					}
				}
			},
			// 删除评论
			async deletecomments(commentId) {
				let timestamp = new Date().getTime()
				let props = {
					params: {
						t: 0,
						type: 0,
						id: this.currentSong.id,
						commentId: commentId,
						timestamp: timestamp,
					}
				}
				try {
					let res = await this.$api.get("/comment", props)
					if (res.code === 200) {
						this.$message.success("删除成功！")
						this.getSongcomments(this.currentSong.id)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 评论点赞
			async commentLike(id, liked) {
				let timestamp = new Date().getTime()
				let props = {
					params: {
						id: this.currentSong.id,
						cid: id,
						type: 0,
						timestamp
					},
				}
				if (liked) {
					props.params.t = 0
				} else {
					props.params.t = 1
				}
				try {
					let res = await this.$api.get("/comment/like",props)
					if (res.code === 200) {
						this.getSongcomments(this.currentSong.id)
					}
				} catch (error) {
					console.log(error)
				}
			},
		}
	}
</script>

<style scoped>
	.flex-row {
		height: 35px;
		border-radius: 3px;
		padding: 0 3px;
		border-bottom: 1px solid #f1f1f1;
		margin-bottom: 10px;
		width: 67%;
		font-size: 14px;
	}
</style>
