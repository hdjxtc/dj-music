<template>
	<div class="footbox">
		<footer>
			<div class="logo"></div>
			<div class="message"></div>
			<div class="copy">
				<p>
					<span class="mr5">Copyright © 2021 DJ</span><br>
					<a href="https://djtc.vip/dj-music">dj-music 演示站</a>
					<span>. Designed by</span>
					<a href="https://djtc.vip" target="_blank"> djtc</a>
				</p>
			</div>
		</footer>
	</div>
</template>

<script>
	export default {
		name: 'Footer'
	}
</script>

<style scoped>
	footer {
		width: 100%;
		height: 190px;
		background: #f9f9f9;
	}

	footer .logo {
		height: 70px;
		margin: 0 auto;
		background: url(../../assets/img/dj-music.png) no-repeat center;
		border-bottom: 1px dotted #c1bebe;
	}

	footer .message {
		width: 1000px;
		margin: 15px auto 0;
		color: #fffada;
	}
	
	a{
		text-decoration: none;
		color: #6d7685;
	}
	
	p{
		color: #6d7685;
		font-size: .95rem;
	}
</style>
