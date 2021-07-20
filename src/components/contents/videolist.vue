<template>
	<div class="mv-box">
		<ul class="mv-list" v-if="videos.length > 0">
			<li v-for="(item,index) of videos" :key="item.id">
				<div class="cover">
					<div class="image">
						<el-image :key="index" :src="item.image" lazy>
							<div slot="placeholder" class="image-slot flex-center flex-column">
								<i class="el-icon-loading"></i>
							</div>
							<div slot="error" class="image-slot flex-center">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>
					<div class="count">
						<i class="arrow"></i>
						<span>{{ handle.tranNumber(item.playCount, 0) }}</span>
					</div>
					<div class="action">
						<button class="play flex-center" title="播放" @click="toDetail(item.id)">
							<i class="el-icon-caret-right"></i>
						</button>
					</div>
					<div class="foot">
						<p>{{ item.duration }}</p>
					</div>
				</div>
				<div class="info">
					<p class="title ellipsis">{{ item.name }}</p>
				</div>
			</li>
		</ul>
		<Empty v-else />
	</div>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		name: 'videolist',
		props: {
			videos: {
				type: Array
			}
		},
		methods: {
			// 视频详情
			toDetail(id) {
				// 播放视频暂停播放
				this.upplaYing(false)
				let type = parseInt(id)
				if (isNaN(type) || id.length > 10) {
					// 视频
					this.$router.push({
						name: 'videodetail',
						query: {
							id
						}
					})
				} else {
					// mv
					this.$router.push({
						name: 'mvdetail',
						query: {
							id
						}
					})
				}
			},
			...mapMutations([
				'upplaYing',
			]),
		},
	}
</script>

<style scoped>
	.mv-box {
		padding: 15px 0;
	}

	.mv-box .mv-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 1rem;
	}

	.mv-box .mv-list li {
		list-style: none;
		flex: 0 0 20%;
		min-width: 20%;
		padding: 0 15px 30px;
	}

	.mv-box .mv-list li .cover {
		position: relative;
		z-index: 2;
		padding-top: 56%;
		border-radius: 2px;
		background-color: #D9D9D9;
	}

	.mv-box .mv-list li .cover .image {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
		height: 100%;
		border-radius: 2px;
	}

	.mv-box .mv-list li .cover .count {
		position: absolute;
		right: 16px;
		top: 1px;
		height: 24px;
		padding-left: 9px;
		background: url("https://img.alicdn.com/tfs/TB1xEGRub9YBuNjy0FgXXcxcXXa-268-48.png") no-repeat 0;
		background-size: cover;
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		line-height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mv-box .mv-list li .cover .count .arrow {
		display: block;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 4px 0 4px 6px;
		border-color: transparent transparent transparent #fff;
		margin-right: 5px;
	}

	.mv-box .mv-list li .cover .count:after {
		content: '';
		position: absolute;
		right: -14px;
		top: 0;
		width: 14px;
		height: 24px;
		background: url("https://img.alicdn.com/tfs/TB1xEGRub9YBuNjy0FgXXcxcXXa-268-48.png") no-repeat 100%;
		background-size: cover;
	}

	.mv-box .mv-list li .cover .action {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.mv-box .mv-list li .cover .action .play {
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: 50%;
		color: #fff;
		background-color: #fa2800;
		cursor: pointer;
	}

	.mv-box .mv-list li .cover .action .play i {
		font-size: 15px;
	}

	.mv-box .mv-list li .cover .foot {
		width: 100%;
		/* background: rgba(0, 0, 0, 0.6); */
		position: absolute;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
	}

	.mv-box .mv-list li .cover .foot p {
		color: #fff;
		margin-bottom: 0 !important;
		text-shadow: -2px 1px rgb(0 0 0 / 40%);
	}

	.mv-box .mv-list li .cover:hover .action {
		display: flex;
	}

	.mv-box .mv-list li .info {
		margin-top: 15px;
	}

	.mv-box .mv-list li .info .title {
		font-size: 14px;
		font-weight: 500;
		display: block;
		line-height: 1.3;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media screen and (max-width: 992px) {
		.mv-box .mv-list li {
			flex: 0 0 33.3%;
		}
	}

	@media screen and (max-width: 550px) {
		.mv-box .mv-list li {
			flex: 0 0 50%;
		}
	}

	@media screen and (max-width: 341px) {
		.mv-box .mv-list li {
			flex: 0 0 100%;
		}
	}
</style>
