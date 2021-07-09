<template>
	<div class="home">
		<Banner />
		<h5 class="tuijian">热门推荐</h5>
		<div style="clear: both;"></div>
		<Tjgedan />
		<h5 class="tjgd">新歌上架</h5>
		<div style="clear: both;"></div>
		<Newmusic />
	</div>
</template>
<style scoped>
	.tuijian{
		float: left;
		font-size: 1.1rem;
		font-weight: 700;
		margin-left: 4.75rem;
	}
	.tjgd {
		float: left;
		font-size: 1.1rem;
		font-weight: 700;
		margin-top: 1rem;
		margin-left: 4.75rem;
		margin-bottom: 1.5rem;
	}
</style>
<script>
	import Banner from '@/components/contents/banner.vue'
	import Tjgedan from '@/components/contents/tjgedan.vue'
	import Newmusic from '@/components/contents/newmusic.vue'
	export default {
		name: 'home',
		components: {
			Banner,
			Tjgedan,
			Newmusic
		}
	}
</script>
