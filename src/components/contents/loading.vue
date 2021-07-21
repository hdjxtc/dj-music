<template>
	<div class="loading flex-column">
		<div class="loader"></div>
		<span v-if="loadingText != ''">{{ loadingText }}</span>
	</div>
</template>

<script>
	export default {
		name: 'loading',
		props: {
			loadingText: {
				type: String,
				default: '~努力加载中~'
			}
		},
	}
</script>

<style scoped>
	.flex-column{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.loading span {
		margin-top: -30px;
		font-size: 12px;
		margin-bottom: 30px;
	}

	.loader {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		margin: 3em;
		display: inline-block;
		position: relative;
		vertical-align: middle;
		background: #33e6ff;
	}

	.loader,
	.loader:before,
	.loader:after {
		animation: loader 1s infinite ease-in-out;
	}

	.loader:before,
	.loader:after {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
	}

	@-moz-keyframes loader {
		from {
			transform: scale(0);
			opacity: 1;
		}

		to {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-webkit-keyframes loader {
		from {
			transform: scale(0);
			opacity: 1;
		}

		to {
			transform: scale(1);
			opacity: 0;
		}
	}

	@-o-keyframes loader {
		from {
			transform: scale(0);
			opacity: 1;
		}

		to {
			transform: scale(1);
			opacity: 0;
		}
	}

	@keyframes loader {
		from {
			transform: scale(0);
			opacity: 1;
		}

		to {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
