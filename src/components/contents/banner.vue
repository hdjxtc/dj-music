<template>
	<div class="banner">
		<el-carousel :interval="40000" type="card" height="200px" style="margin: 20px 50px;">
			<el-carousel-item v-for="(item,index) in bannerinfo" :key="index">
				<a :href="item.url">
					<img :src="item.imageUrl || item.pic" alt="" class="imgSize" />
				</a>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	export default {
		name: 'banner',
		data() {
			return {
				bannerinfo: [],
				cateListProm: {
					params: {
						limit: 60,
						offset: 0,
						cat: "全部"
					}
				},
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
				// console.log(this.bannerinfo)
			},
		}
	}
</script>

<style scoped>
	img {
		height: 100%;
	}
</style>
