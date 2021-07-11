<template>
	<div class="banner">
		<div class="banner-pc">
			<el-carousel trigger="click" type="card" height="200px" style="margin: 20px 50px;">
				<el-carousel-item v-for="(item,index) in bannerinfo" :key="index">
					<a :href="item.url">
						<img :src="item.imageUrl || item.pic" alt="" class="imgSize" />
					</a>
				</el-carousel-item>
			</el-carousel>
		</div>
		<div class="banner-yd">
			<el-carousel indicator-position="none" trigger="click" height="150px" style="margin: 20px 9.3% 20px 11.8%">
				<el-carousel-item v-for="(item,index) in bannerinfo" :key="index">
					<a :href="item.url">
						<img :src="item.imageUrl || item.pic" alt="" class="imgSize" style="width: 100%;" />
					</a>
				</el-carousel-item>
			</el-carousel>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'banner',
		data() {
			return {
				bannerinfo: [],
				// href: ''
			}
		},
		created() {
			this.getSwiter();
		},
		methods: {
			//获取轮播图
			async getSwiter() {
				const res = await this.$api.post("banner");
				this.bannerinfo = res.banners;
				// console.log(res.banners)
				
				// res.banners.map(item => {
				// 	// console.log(item)
				// 	// 如果轮播类型为1,则为歌曲
				// 	if (item.targetType == 1) {
				// 		//获取歌曲列表
				// 		let timestamp = new Date().valueOf()
				// 		this.$api.get("/song/detail", {
				// 			params: {
				// 				ids: item.targetId,
				// 				timestamp: timestamp
				// 			}
				// 		}).then(url => {
				// 			this.href =
				// 				`https://music.163.com/song/media/outer/url?id=${url.songs[0].id}.mp3`
				// 		})
				// 	}
				// 	// 否则一律做活动超链接
				// 	else {
				// 		this.href = item.url
				// 	}
				// })
			},
		}
	}
</script>

<style scoped>
	img {
		height: 100%;
	}

	@media screen and (max-width: 992px) {
		.banner-pc {
			display: none !important;
		}
	}

	@media screen and (min-width: 992px) {
		.banner-yd {
			display: none !important;
		}
	}
</style>
