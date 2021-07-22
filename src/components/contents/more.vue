<template>
	<div class="morebox">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: 'more',
		methods: {
			//获取滚动条当前的位置
			getScrollTop() {
				var scrollTop = 0
				let contents = document.getElementById('contents')
				// documentElement 返回文档的根节点,解决ie怪异模式无法正确获取到滚动条
				if (document.documentElement && contents.scrollTop) {
					scrollTop = contents.scrollTop+5
				} else if (document.body) {
					scrollTop = document.body.scrollTop
				}
				return scrollTop
			},
			//获取当前可视范围的高度
			getClientHeight() {
				var clientHeight = 0
				let contents = document.getElementById('contents')
				if (document.body.clientHeight && contents.clientHeight) {
					clientHeight = Math.min(
						document.body.clientHeight,
						contents.clientHeight
					)
				} else {
					clientHeight = Math.max(
						document.body.clientHeight,
						contents.clientHeight
					)
				}
				return clientHeight
			},

			//获取文档完整的高度
			getScrollHeight() {
				let contents = document.getElementById('contents')
				return Math.max(
					document.body.scrollHeight,
					contents.scrollHeight
				)
			}
		},
		mounted() {
			//滚动事件触发
			var self = this
			let contents = document.getElementById('contents')
			contents.onscroll = function() {
				// 当前滚动条位置+可视范围
				if (
					self.getScrollTop() + self.getClientHeight() >=
					self.getScrollHeight()
				) {
					// console.log('到底了')
					self.$emit('scroll-state', true)
				}
			}
		},
	}
</script>

<style>
</style>
