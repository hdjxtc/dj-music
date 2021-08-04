<template>
	<div class="banner">
<<<<<<< HEAD
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
=======
		<el-carousel :interval="40000" type="card" height="200px" style="margin: 20px 50px;">
			<el-carousel-item v-for="(item,index) in bannerinfo" :key="index">
				<a :href="item.url">
					<img :src="item.imageUrl || item.pic" alt="" class="imgSize" />
				</a>
			</el-carousel-item>
		</el-carousel>
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	</div>
</template>

<script>
	export default {
		name: 'banner',
		data() {
			return {
				bannerinfo: [],
<<<<<<< HEAD
				// href: ''
=======
				cateListProm: {
					params: {
						limit: 60,
						offset: 0,
						cat: "全部"
					}
				},
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
			}
		},
		created() {
			this.getSwiter();
		},
		methods: {
			//获取轮播图
			async getSwiter() {
<<<<<<< HEAD
				try {
					const res = await this.$api.post("banner");
					this.bannerinfo = res.banners;
					// console.log(res.banners)
				} catch (error) {
					console.log(error)
				}
=======
				const res = await this.$api.post("banner");
				this.bannerinfo = res.banners;
				// console.log(this.bannerinfo)
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
			},
		}
	}
</script>

<style scoped>
	img {
		height: 100%;
	}
<<<<<<< HEAD

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
=======
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
</style>
