<template>
	<div class="block">
		<el-pagination layout="total, prev, pager, next, jumper"
		:total="total" @current-change="pageChange" :page-size="30"></el-pagination>
	</div>
</template>

<script>
	export default {
		name: 'fany',
		props: ['total'],
		methods: {
			pageChange(page) {
				this.$emit("pageChange", page);
			}
		}
	}
</script>

<style>
	.block{
		width: 95%;
		margin: 0 auto;
		background: #fff;
		opacity: .6;
	}
	@media screen and (max-width: 768px) {
		.el-pagination__total,.el-pagination__jump{
			display: none!important;
		}
	}
	@media screen and (max-width: 371px) {
		.el-pager li{
			min-width: 25px!important;
		}
	}
</style>
