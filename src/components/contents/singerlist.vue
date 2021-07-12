<template>
	<li @click="toSinger(item.id)">
		<div class="cover">
			<div class="image shadow">
				<el-image :key="item.img1v1Url" :src="item.img1v1Url">
					<div slot="placeholder" class="image-slot flex-center flex-column" lazy>
						<i class="el-icon-loading"></i>
					</div>
					<div slot="error" class="image-slot flex-center">
						<i class="el-icon-picture-outline"></i>
					</div>
				</el-image>
			</div>
		</div>
		<div class="info">
			<p class="name">{{ item.name }}</p>
		</div>
	</li>
</template>

<script>
	export default {
		name: 'singerlist',
		props: {
			item: {
				type: Object
			}
		},
		methods: {
			// 跳转歌手页面
			toSinger(id) {
				this.$router.push({
					name: 'singerpage',
					query: {
						id: id
					}
				})
				// this.setSinger(item)
			},
		},
	}
</script>

<style scoped>
	li {
		padding: 0 15px 30px;
		flex: 0 0 10%;
		min-width: 10%;
		cursor: pointer;
		list-style: none;
	}

	.cover {
		position: relative;
		padding-top: 100%;
		border-radius: 50%;
	}

	.cover .image {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.info {
		margin-top: 15px;
		text-align: center;
	}

	.info .name {
		font-weight: 700;
		font-size: 14px;
		line-height: 18px;
		/* 允许在单词内换行 */
		word-break: break-word;
	}
	
	@media screen and (max-width: 992px) {
		li {
			flex: 0 0 20%;
		}
	}
	@media screen and (max-width: 555px) {
		li {
			flex: 0 0 33%;
		}
	}
	@media screen and (max-width: 340px) {
		li {
			flex: 0 0 50%;
		}
	}
</style>
