<template>
	<div class="comment-box" v-if="loginStatu">
		<p class="flex-row">
			<span>
				<i class="el-icon-user-solid"></i>
				&nbsp;&nbsp;{{ userInfo.nickname }}，你好
			</span>
		</p>
		<div class="comment-form">
			<div class="avatar">
				<img :src="userInfo.avatarUrl" :title="userInfo.nickname" />
			</div>
			<div class="comarea">
				<textarea name="comment" v-model="commentContent" placeholder="请开始你的表演！" cols="50" rows="5"></textarea>
			</div>
		</div>
		<div class="flex-between">
			<button class="cancel-comment" @click="cancelComment" v-if="currentCommentId != ''">
				取消回复
			</button>
			<button type="button" class="comment-btn" @click="commentSubmit">
				评论
			</button>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'commentBox',
		data() {
			return {
				// 评论内容
				commentContent: ''
			}
		},
		props: {
			currentCommentId: {
				type: [String, Number]
			},
			clearContent: {
				type: Boolean
			}
		},
		computed: {
			...mapGetters(['userInfo', 'loginStatu'])
		},
		watch: {
			clearContent(val) {
				if (val) {
					this.commentContent = ''
				}
			}
		},
		methods: {
			// 提交评论
			commentSubmit() {
				this.$emit('commentSubmit', this.commentContent)
			},
			// 取消评论
			cancelComment() {
				this.$emit('cancelComment')
			}
		},
	}
</script>

<style scoped>
	.flex-row {
		font-size: 14px;
	}
	/* 头像图标 */
	.comment-box p i {
		margin-right: 10px;
	}
	/* 评论框盒 */
	.comment-box .comment-form {
		display: flex;
		margin-top: 1.5em;
	}
	/* 头像 */
	.comment-box .comment-form .avatar {
		width: 50px;
		height: 50px;
		border-radius: 3px;
		margin-right: 20px;
		position: relative;
		flex-shrink: 0;
	}
	.comment-box .comment-form .avatar img {
		width: 100%;
		border-radius: 3px;
	}
	/* 输入框 */
	.comment-box .comment-form .comarea {
		flex: 1;
	}
	.comment-box .comment-form .comarea textarea {
		width: 100%;
		background: #f8f9ff;
		resize: none;
		padding: 6px 12px;
		color: #666;
		border: 1px solid #eaebff;
		border-radius: 3px;
		font-size: 13px;
		height: 80px;
	}
	
	/* 底部按钮盒 */
	.flex-between{
		margin-top: 15px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	/* 取消回复 */
	.cancel-comment {
		color: #d9df;
		font-size: 12px;
		background: none;
		padding: 6px 10px;
		border-radius: 2px;
		border: 1px solid #d9df;
		cursor: pointer;
		margin-right: 30px;
	}
	/* 提交评论 */
	.flex-between .comment-btn {
		color: #fff;
		padding: 7px 26px;
		font-size: 0.75rem;
		border-radius: 3px;
		border: none;
		cursor: pointer;
		outline: none;
		background: linear-gradient(to right, #ff4b2b, #ff416c);
	}
</style>
