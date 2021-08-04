<template>
<<<<<<< HEAD
	<div class="gendanlist" :class="num?'gendanlisttwo':''" v-if="playList.length>0">
		<div class="item" :class="num?'two':''" v-for="(item,index) of playList" :key="index" @click="toDetail(item.id)">
			<div class="wrapper">
				<div class="cover">
					<div class="image">
						<el-image :key="index" :src="item.picUrl || item.coverImgUrl">
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
	<Empty v-else />
=======
	<div class="gendanlist">
		<div class="mainBox">
			<ul class="bigBox" v-for="(item, index) in songList" :key="index">
				<li class="eachBox" @click="eachClick(item.id)">
					<div class="picBox">
						<el-skeleton :loading="loading" animated :throttle="500">
							<template slot="template">
								<el-skeleton-item variant="image" style="width: 175px; height: 175px" />
							</template>
							<img :src="item.picUrl" alt="" />
						</el-skeleton>
					</div>
					<div class="countIcon">
						<!-- <span>{{(item.playCount/10000).toFixed(0)>10000 ? (item.playCount/100000000).toFixed(0)+"亿":(item.playCount/10000).toFixed(0)+"万"}}</span> -->
						<span>{{ handle.tranNumber(item.playCount, 0) }}</span>
						<i class="el-icon-headset" />
					</div>
					<div class="boFang">
						<i class="el-icon-video-play"></i>
					</div>
					<div class="topText">
						<p>{{ item.name }}</p>
					</div>
				</li>
			</ul>
		</div>
		<div style="clear: both;"></div>
	</div>
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
</template>

<script>
	export default {
		name: 'gendanlist',
<<<<<<< HEAD
		props: {
			playList: {
				type: Array
			},
			num: {
				type: Number
			}
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
=======
		data() {
			return {
				//音乐列表
				songList: [],
				loading: true
			};
		},
		created() {
			this.getNewSongs();
		},
		methods: {
			//获取音乐图片
			async getNewSongs() {
				await this.$api.get("personalized")
					.then((res) => {
						this.total = res.total;
						this.songList = res.result;
						this.loading = false
						// console.log(res.data.result);
					});
			}
		}
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	}
</script>

<style scoped>
	.gendanlist {
<<<<<<< HEAD
		display: flex;
		flex-wrap: wrap;
		padding: 2rem;
	}
	
	.gendanlisttwo {
		padding: 0;
	}

	.gendanlist .item {
		flex: 0 0 16.6%;
		min-width: 16.6%;
		cursor: pointer;
		padding: 0 15px 30px;
	}
	.gendanlist .two {
		flex: 0 0 50%;
		min-width: 50%;
		padding: 0 3px 30px;
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
=======
		margin: 5px auto;
		padding-left: 2.8rem;
	}

	.eachBox {
		position: relative;
		width: 182px;
		height: 225px;
		margin-right: 15px;
		margin-bottom: 10px;
		float: left;
		cursor: pointer;
		overflow: hidden;
		list-style: none;
	}

	.eachBox:nth-child(5),
	.eachBox:nth-child(10) {
		margin-right: 0;
	}

	.picBox {
		width: 175px;
		height: 175px;
		margin-bottom: 8px;
	}

	.picBox img {
		width: 100%;
	}

	.countIcon {
		position: absolute;
		top: 0;
		right: 0.42rem;
		width: 100px;
		height: 20px;
		line-height: 20px;
		background-image: linear-gradient(to left,
				rgba(0, 0, 0, 0.2),
				rgba(255, 255, 255, 0));
	}

	.countIcon span,
	.countIcon i {
		position: relative;
		right: 4px;
		float: right;
		font-size: 12px;
		color: #fff;
	}

	.countIcon i {
		position: relative;
		top: 5px;
		right: 7px;
	}

	.boFang {
		position: absolute;
		bottom: 43px;
		right: 9px;
		font-size: 31px;
		transform: translateX(125%);
		transition: 0.3s;
	}

	.boFang i {
		color: rgba(255, 255, 255, 0.95);
	}

	.bigBox:hover .boFang {
		transform: translateY(0);
	}

	.topText {
		/* width: 175px; */
		/* height: 40px; */
		/* background-color: rgba(0, 0, 0, 0.2); */
		transform: translateY(-20%);
		transition: 0.3s;
	}

	.topText p {
		padding: 5px 5px;
		font-size: 12px;
		color: #000;
	}

	@media screen and (max-width: 477px) {
		.eachBox {
			width: 162px;
			height: 205px;
		}

		.picBox {
			width: 155px;
			height: 155px;
		}

		.gendanlist {
			padding-left: 2rem;
		}
	}

	@media screen and (max-width: 425px) {
		.eachBox {
			width: 146px;
			height: 190px;
		}

		.picBox {
			width: 140px;
			height: 140px;
		}

		.gendanlist {
			padding-left: 1.6rem;
		}
	}

	@media screen and (max-width: 386px) {
		.eachBox {
			width: 136px;
			height: 180px;
		}

		.picBox {
			width: 130px;
			height: 130px;
		}

		.gendanlist {
			padding-left: 1rem;
		}
	}

	@media screen and (max-width: 361px) {
		.eachBox {
			width: 126px;
			height: 170px;
		}

		.picBox {
			width: 120px;
			height: 120px;
		}
	}

	@media screen and (max-width: 333px) {
		.eachBox {
			width: 116px;
			height: 160px;
		}

		.picBox {
			width: 110px;
			height: 110px;
		}

		.gendanlist {
			padding-left: 0.5rem;
		}
	}

	@media screen and (max-width: 309px) {
		.eachBox {
			width: 106px;
			height: 150px;
		}

		.picBox {
			width: 100px;
			height: 100px;
		}

		.gendanlist {
			padding-left: 0.4rem;
		}
	}

	@media screen and (max-width: 287px) {
		.eachBox {
			width: 96px;
			height: 140px;
		}

		.picBox {
			width: 90px;
			height: 90px;
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
		}
	}
</style>
