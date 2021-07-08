<template>
	<div id="app">
		<div class="container">
			<div class="header" v-if="!$route.meta.isLogin">
				<Navbar />
			</div>
			<div class="content">
				<Contents />
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
		/* background: url(https://kdy.djtc.vip/djapi/bing) no-repeat; */
		background: url(./assets/img/bg.jpg) no-repeat;
		background-size: 100% 100%;
		overflow: hidden;
		height: 100vh;
	}

	* {
		margin: 0;
		padding: 0;
	}

/* 	.box {
		z-index: 999;
		background-color: rgba(255, 255, 255, 0.6);
		width: 1320px !important;
		height: 950px;
		margin: 0 auto;
		box-shadow: 0 0 30px #ccc;
	} */

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
</style>
<script type="text/javascript">
	import Navbar from './components/header/navbar'
	import Contents from './components/contents/index'
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
		},
	}
</script>
