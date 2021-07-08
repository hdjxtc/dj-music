<template>
	<div class="empty flex-column">
		<img src="../../assets/img/dj-music.png" alt="">
		<p>{{ emptyText }}</p>
	</div>
</template>

<script>
	export default {
		name: 'empty',
		props: {
			emptyText: {
				type: String,
				default: '哎呀，这里什么都没有~'
			}
		},
	}
</script>

<style scoped>
	.empty {
		width: 100%;
	}

	img {
		width: 300px;
	}
</style>
