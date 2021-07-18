<template>
	<div class="tjgedan">
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
</template>

<script>
	export default {
		name: 'tjgedan',
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
				try {
					await this.$api.get("personalized")
						.then((res) => {
							this.total = res.total;
							this.songList = res.result;
							this.loading = false
							// console.log(res.data.result);
						});
				} catch (error) {
					console.log(error)
				}
			}
		}
	}
</script>

<style scoped>
	.tjgedan {
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

		.tjgedan {
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

		.tjgedan {
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

		.tjgedan {
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

		.tjgedan {
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

		.tjgedan {
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
		}
	}
</style>
