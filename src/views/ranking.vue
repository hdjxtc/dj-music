<template>
	<div class="rankingbox">
		<div class="rank-wrap container" v-loading="loading">
			<div class="module">
				<h2 class="title flex-row">云音乐特色榜</h2>
				<Gedanlist :playList="featureList"></Gedanlist>
			</div>
			<div class="module">
				<h2 class="title flex-row">全球媒体榜</h2>
				<Gedanlist :playList="globalList"></Gedanlist>
			</div>
		</div>
	</div>
</template>
<script>
	import Gedanlist from '@/components/contents/gedanlist'
	export default {
		data() {
			return {
				ranks: [],
				loading: false
			}
		},
		components: {
			Gedanlist
		},
		computed: {
			featureList: function() {
				return this.ranks.slice(0, 4)
			},
			globalList: function() {
				return this.ranks.slice(4, this.ranks.length)
			}
		},
		methods: {
			// 获取排行榜数据
			async getToplist() {
				this.loading = true
				try {
					let res = await this.$api.get(`/toplist/detail`)
					if (res.code === 200) {
						// console.log(res)
						this.ranks = res.list
						this.loading = false
					}
				} catch (error) {
					console.log(error)
				}
			}
		},
		mounted() {
			this.getToplist()
		}
	}
</script>
<style scoped>
	.rank-wrap .module .title {
		position: relative;
		text-align: left;
		font-size: 18px;
		font-weight: 600;
		margin-left: 3rem;
		padding-top: 2rem;
		padding-left: 15px;
	}

	.rank-wrap .module .title::before {
		content: '';
		width: 3px;
		height: 20px;
		background: #fa2800;
		position: absolute;
		left: 0;
	}
</style>
