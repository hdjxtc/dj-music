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
</style>
