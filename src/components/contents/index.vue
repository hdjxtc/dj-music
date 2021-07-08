<template>
	<div class="contents">
		<router-view />
		<Footer v-if="!$route.meta.isLogin"/>
		<el-backtop target=".contents" :bottom="35" :right="25">
			<img src="../../assets/img/gotop.png" >
		</el-backtop>
	</div>
</template>

<script>
	import Footer from '@/components/footer/footer'
	export default{
		name: 'contents',
		components: {
			Footer
		}
	}
</script>

<style scoped>
	.contents{
		height: 100vh;
		overflow: scroll;
	}
	.contents::-webkit-scrollbar {
		width: 7px;
		height: 6px;
	}
	
	.contents::-webkit-scrollbar-track {
		border-radius: 3px;
		background: rgba(135, 245, 255, 0.2);
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 255, 0.18);
	}
	.contents::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: linear-gradient(45deg, #66e3ff,#6dcaf4, #66e3ff);
		-webkit-box-shadow: inset 0 0 10px rgba(78, 255, 0, 0.2);
	}
</style>
