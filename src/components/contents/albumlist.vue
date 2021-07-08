<template>
	<div class="album-box">
		<ul class="album-list">
			<li v-for="(item,index) of albums" :key="index" @click="toDetail(item.id)">
				<div class="wrapper">
					<div class="cover">
						<!-- 专辑图片 -->
						<div class="image">
							<el-image :key="index" :src="item.picUrl" lazy>
								<div slot="placeholder" class="image-slot flex-center flex-column">
									<i class="el-icon-loading"></i>
								</div>
								<div slot="error" class="image-slot flex-center">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
						</div>
						<!-- 分类 -->
						<div class="count">
							<i class="arrow"></i>
							<span>{{ item.subType || item.type }}</span>
						</div>
					</div>
				</div>
				<!-- 创建日期 -->
				<div class="info">
					<div class="name ellipsis">{{ item.name }}</div>
					<div class="author">{{ item.artist.name }}</div>
					<div class="time author">
						{{ handle.dateFormat(item.publishTime, 'YYYY-MM-DD') }}
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'albumlist',
		props: {
			albums: {
				type: Array
			},
		},
		methods: {
			toDetail(id) {
				this.$router.push({
					name: 'albumpage',
					query: {
						id
					}
				})
			}
		},
	}
</script>

<style scoped>
	li{
		list-style: none;
	}
	.album-box ul{
		padding: 1rem!important;
	}
	/* 弹性盒,自动拆分行 */
	.album-list {
		display: flex;
		flex-wrap: wrap;
	}
	/* 放大0收缩0保持16... */
	.album-list li {
		padding: 0 15px 30px;
		flex: 0 0 16.5%;
		min-width: 16.5%;
		cursor: pointer;
	}

	.album-list li .wrapper {
		position: relative;
		padding-right: 10px;
		overflow: hidden;
	}

	.album-list li .wrapper .cover {
		position: relative;
		z-index: 2;
		padding-top: 100%;
		background: #D9D9D9;
	}

	.album-list li .wrapper .cover .image {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
		height: 100%;
		border-radius: 3px;
	}

	.count {
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
	/* 三角形 */
	.album-list li .wrapper .cover .count .arrow {
		display: block;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 4px 0 4px 6px;
		border-color: transparent transparent transparent #fff;
		margin-right: 5px;
	}

	.album-list li .wrapper .cover .count:after {
		content: '';
		position: absolute;
		right: -14px;
		top: 0;
		width: 14px;
		height: 24px;
		background: url("https://img.alicdn.com/tfs/TB1xEGRub9YBuNjy0FgXXcxcXXa-268-48.png") no-repeat 100%;
		background-size: cover;
	}
	/* 黑音乐片 */
	.album-list li .wrapper::after {
		content: '';
		position: absolute;
		z-index: 1;
		right: 10px;
		top: 50%;
		-webkit-transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
		width: 100%;
		padding-top: 100%;
		background-color: #000;
		border-radius: 50%;
		transition: all 0.4s;
	}

	.album-list li .wrapper:hover::after {
		right: 0px;
	}

	.album-list li .info {
		margin-top: 15px;
	}

	.album-list li .info .name {
		font-weight: 700;
		line-height: 18px;
	}

	.album-list li .info .author {
		font-size: 12px;
		color: #999;
	}
	
	@media screen and (max-width: 768px) {
		.album-list li {
			flex: 0 0 25%;
		}
	}
	@media screen and (max-width: 550px) {
		.album-list li {
			flex: 0 0 33.3%;
		}
	}
	@media screen and (max-width: 420px) {
		.album-list li {
			flex: 0 0 50%;
		}
	}
</style>
