<template>
	<div class="gendanlist">
		<div class="item" v-for="(item,index) of playList" :key="index" @click="toDetail(item.id)">
			<div class="wrapper">
				<div class="cover">
					<div class="image">
						<el-image :key="index" :src="item.picUrl || item.coverImgUrl" lazy>
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
				</div>
			</div>
			<div class="info">
				<h2 class="name ellipsis">
					{{ item.name }}
				</h2>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'gendanlist',
		props: {
			playList: {
				type: Array
			},
		},
		methods: {
			toDetail(id) {
				this.$router.push({
					name: 'playlistdetail',
					query: {
						id: id
					}
				})
			}
		},
	}
</script>

<style scoped>
	.gendanlist {
		display: flex;
		flex-wrap: wrap;
		padding: 2rem;
	}

	.gendanlist .item {
		flex: 0 0 16.6%;
		min-width: 16.6%;
		cursor: pointer;
		padding: 0 15px 30px;
	}

	.gendanlist .item .wrapper {
		position: relative;
		padding-right: 10px;
	}

	.gendanlist .item .wrapper:before {
		content: "";
		width: 100%;
		height: 100%;
		background-color: #626262;
		position: absolute;
		top: 0;
		transition: 0.4s;
		right: 6px;
		transform: scale(0.85);
		/* 旋转基点 */
		transform-origin: 100% 50%;
		z-index: 2;
		border-radius: 5px;
	}

	.gendanlist .item .wrapper .cover {
		position: relative;
		z-index: 2;
		padding-top: 100%;
		border-radius: 2px;
		background-color: #d9d9d9;
	}

	.gendanlist .item .wrapper .cover .image {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
		height: 100%;
		border-radius: 4px;
	}

	.gendanlist .item .wrapper .cover .count {
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

	.gendanlist .item .wrapper .cover .count .arrow {
		display: block;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 4px 0 4px 6px;
		border-color: transparent transparent transparent #fff;
		margin-right: 5px;
	}

	.gendanlist .item .wrapper .cover .count:after {
		content: "";
		position: absolute;
		right: -14px;
		top: 0;
		width: 14px;
		height: 24px;
		background: url("https://img.alicdn.com/tfs/TB1xEGRub9YBuNjy0FgXXcxcXXa-268-48.png") no-repeat 100%;
		background-size: cover;
	}

	.gendanlist .item .info {
		margin-top: 15px;
	}

	.gendanlist .item .info .name {
		font-size: 14px;
	}

	.gendanlist .item:hover .wrapper:before {
		right: 3px;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media screen and (max-width: 768px) {
		.gendanlist .item {
			flex: 0 0 25%;
		}
	}

	@media screen and (max-width: 550px) {
		.gendanlist .item {
			flex: 0 0 33.3%;
		}
	}

	@media screen and (max-width: 420px) {
		.gendanlist .item {
			flex: 0 0 50%;
		}
	}

	@media screen and (max-width: 280px) {
		.gendanlist .item {
			flex: 0 0 100%;
		}
	}
</style>
