<template>
	<div id="app">
		<div class="container">
			<div class="header" v-show="!$route.meta.isLogin">
				<Navbar />
			</div>
			<div class="content">
				<Contents />
			</div>
			<Playbar />
		</div>
	</div>
</template>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		background: url(./assets/img/bg.jpg) no-repeat;
		background-size: 100% 100%;
		overflow: hidden;
		height: 100vh;
	}
</style>
<script type="text/javascript">
	import Navbar from './components/header/navbar'
	import Contents from './components/contents/index'
	import Playbar from './components/footer/playbar'
	// import Playbar from './components/footer/playbar'
	export default {
		name: 'App',
		data() {
			return {
				loding: true
			}
		},
		components: {
			Navbar,
			Contents,
			Playbar
		},
		// 路线更改时滚动到顶部
		watch: {
			$route() {
				// 路由视图内容
				let contents = document.getElementById('contents')
				// 歌曲详情页
				let playpage = document.querySelector('.playpage')
				contents.scrollTo(0,0)
				playpage.scrollTo(0,0)
			}
		}
	}
</script>
