<template>
	<div class="mv-box">
		<ul class="mv-list" v-if="videos.length > 0">
			<li v-for="item of videos" :key="item.id" :class="item.isLive ? 'live' : ''">
				<div class="cover">
					<div class="image">
						<el-image :key="item.image + '?param=352y197'" :src="item.image + '?param=325y197'" lazy>
							<div slot="placeholder" class="image-slot flex-center flex-column">
								<i class="iconfont niceicon-3"></i>
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
						<button class="play flex-center" title="播放" v-if="!item.isLive"
							@click="toDetail(item.id, item.type)">
							<i class="iconfont nicebofang1"></i>
						</button>
						<button class="play flex-center" title="播放" v-else @click="toLive(item.id)">
							<i class="iconfont nicebofang1"></i>
						</button>
					</div>
					<div class="foot">
						<p>{{ item.nickName }}</p>
						<p>{{ item.duration }}</p>
					</div>
				</div>
				<div class="info">
					<h2 class="title ellipsis">{{ item.name }}</h2>
				</div>
			</li>
		</ul>
		<Empty v-else/>
	</div>
</template>

<script>
	export default {
		name: 'videolist',
		props: {
			videos: {
				type: Array
			},
			type: {
				type: String
			}
		},
		methods: {
			// 直播跳转
			toLive(id) {
				let url = `https://iplay.163.com/live?id=${id}`
				window.open(url, '_blank')
			},
			// 视频详情
			toDetail(id) {
				// this.stopPlay()播放视频移除播放   vuex待优化
				if (typeof id == 'number' || id.length < 10) {
					this.$router.push({
						name: 'videodetail',
						query: {
							id
						}
					})
				} else {
					this.$router.push({
						name: 'videoDetail',
						query: {
							id
						}
					})
				}
			},
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
		margin: 0 -15px;
	}

	.mv-box .mv-list li {
		padding: 0 15px 30px;
		flex: 0 0 25%;
		max-width: 25%;
	}

	.mv-box .mv-list li .cover {
		position: relative;
		z-index: 2;
		padding-top: 56%;
		border-radius: 2px;
		background-color: #000;
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
		cursor: pointer;
	}

	.mv-box .mv-list li .cover .action .play i {
		font-size: 12px;
	}

	.mv-box .mv-list li .cover .foot {
		width: 100%;
		height: 35px;
		background: rgba(0, 0, 0, 0.6);
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

	.mv-box .mv-list li .info .author {
		margin-top: 5px;
		font-size: 12px;
		color: #999;
	}

	.mv-box .mv-list li.live .cover .foot {
		background: rgba(250, 40, 0, 0.75);
	}
</style>
