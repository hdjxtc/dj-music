<template>
	<div id="app">
		<div class="container">
			<div class="header" v-if="!$route.meta.isLogin">
				<Navbar />
			</div>
			<div class="content">
				<Contents />
			</div>
			<div class="container playbar">
				<Playbar/>
			</div>
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

	* {
		margin: 0;
		padding: 0;
	}

	.container {
		padding: 0 !important;
		background-color: rgba(255, 255, 255, 0.6);
	}
	.el-drawer__header>:first-child{
		flex: 0!important;
	}
	
	/* 返回顶部 */
	.el-backtop{
		background: none!important;
		box-shadow: none!important;
	}
	
	/* 登录输入框 */
	.el-input__inner{
		padding-left: 10%!important;
	}
	.el-button--primary{
		margin-top: 5%!important;
	}
	
	/* 是否播放渲染播放样式 */
	.isplay{
		transition: .3s;
		color: red;
		background-color: #ecf5ff!important;
	}
	.isplay td div i:nth-of-type(1){
		color: red;
	}
	
	/* 播放条 */
	.playbar{
		width: 86%;
		height: 65px;
		background: #f9f9f9;
		position: fixed;
		bottom: 0;
	}
</style>
<script type="text/javascript">
	import Navbar from './components/header/navbar'
	import Contents from './components/contents/index'
	import Playbar from './components/footer/playbar'
	// import Playbar from './components/footer/playbar'
	export default {
		name: 'App',
		data(){
			return{
				loding: true
			}
		},
		components: {
			Navbar,
			Contents,
			Playbar
		},
	}
</script>
