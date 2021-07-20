<template>
	<div class="comment-list">
		<h3>{{title}}</h3>
		<ul class="commentlist">
			<!-- 评论列表 -->
			<li class="item" v-for="item of commentList" :key="item.commentId">
				<!-- 头像 -->
				<div class="avatar">
					<!-- <img :src="item.user.avatarUrl" :alt="item.user.nickname" :title="item.user.nickname" /> -->
					<el-image :key="item.user.avatarUrl" :src="item.user.avatarUrl" :title="item.user.nickname" lazy>
						<div slot="placeholder" class="image-slot flex-center flex-column">
							<i class="el-icon-loading"></i>
						</div>
						<div slot="error" class="image-slot flex-center">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</div>
				<!-- 评论信息 -->
				<div class="info">
					<h2 class="flex-between">
						<!-- 评论用户、时间 -->
						<span>
							{{ item.user.nickname }}
							<small> · {{handle.formatMsgTime(item.time)}}</small>
						</span>
						<!-- 点赞、回复 -->
						<div class="tool flex-row">
							<i class="iconfont dj-icon-dianzan" @click="commentLike(item.commentId, item.liked)" :class="item.liked ? 'active' : ''"></i>
							<span>({{item.likedCount}})</span>
							<i class="iconfont dj-icon-pinglun" @click="commentHandle(item.commentId)"></i>
							<a href="javascript:;" class="delete" v-if="userInfo!=null && item.user.userId==userInfo.userId" @click="deletecomment(item.commentId)">删除评论</a>
						</div>
					</h2>
					<!-- 评论内容 -->
					<div class="content">
						{{item.content}}
						<!-- 评论回复 -->
						<div class="beReqlied" v-for="subItem of item.beReplied" :key="subItem.beRepliedCommentId">
							<small>@{{ subItem.user.nickname }}：</small>{{ subItem.content }}
						</div>
					</div>
					<!-- 隐藏的输入框 -->
					<Commentbox 
						v-if="item.commentId == currentCommentId" 
						@cancelComment="cancelComment" 
						@commentSubmit="commentSubmit"
					/>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import Commentbox from './commentBox'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'commentNewest',
		data() {
			return {
				commentContent: ''
			}
		},
		components: {
			Commentbox
		},
		props: {
			// 标题
			title: {
				type: String
			},
			// 评论信息
			commentList: {
				type: Array
			},
			currentCommentId: {
				type: [String, Number]
			}
		},
		computed: {
			...mapGetters(['userInfo', 'loginStatu'])
		},
		methods: {
			// 点击评论
			commentHandle(id) {
				this.$emit('commentHandle', id)
			},
			// 提交评论
			commentSubmit(content) {
				this.$emit('commentSubmit', content)
			},
			// 评论点赞
			commentLike(id, liked) {
				this.$emit('commentLike', id, liked)
			},
			// 取消评论
			cancelComment() {
				this.$emit('cancelComment')
			},
			// 删除评论
			deletecomment(commentId){
				this.$emit('deletecomment',commentId)
			}
		},
	}
</script>

<style scoped>
	.comment-list {
		margin-top: 50px;
	}

	.comment-list h3 {
		margin-bottom: 15px;
		font-size: 16px;
		font-weight: 600;
	}

	.comment-list ul li {
		padding: 10px 0;
		width: 100%;
		display: flex;
	}

	.comment-list ul li .avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		margin-right: 12px;
		flex-shrink: 0;
	}

	.comment-list ul li .avatar img {
		width: 100%;
		border-radius: 50%;
	}

	.comment-list ul li .info {
		flex: 1;
	}

	.comment-list ul li .info h2 {
		font-size: 13px;
		margin-right: 5px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		font-weight: 600;
	}

	.comment-list ul li .info h2 small {
		font-size: 12px;
		color: #a5a5c1;
		font-weight: 200;
	}

	.comment-list ul li .info h2 .tool i {
		font-size: 14px;
		font-weight: 100;
		margin-left: 20px;
		cursor: pointer;
		transition: all 0.4s;
		color: #000000;
	}

	.comment-list .active {
		color: red!important;
	}

	.comment-list ul li .info h2 .tool span {
		font-size: 12px;
		margin-top: 2px;
		color: #666;
		font-weight: 200;
		position: relative;
	}

	.comment-list ul li .info h2 .tool span::after {
		content: "";
		width: 1px;
		height: 13px;
		background: #4a4a4a;
		opacity: 0.7;
		position: absolute;
		top: 2px;
		right: -12px;
	}

	.comment-list ul li .info .content {
		width: 100%;
		font-size: 12px;
		color: #4a4a4a;
		line-height: 1.6;
		padding: 8px 10px;
		background: #f5efef4a;
		margin-top: 5px;
		border-radius: 3px;
	}

	.comment-list ul li .info .content .beReqlied {
		margin-top: 10px;
		background: #fff;
		padding: 8px 10px;
		border-radius: 3px;
		color: #666;
	}
	.delete{
		margin-left: 15px;
		text-decoration: none;
		color: #9db3fd;
	}
	.delete:hover{
		text-decoration: underline;
		color: #f00;
	}
	/* 移动 */
	@media screen and (max-width: 576px) {
		.commentlist{
			margin-left: -2rem;
		}
	}
</style>
