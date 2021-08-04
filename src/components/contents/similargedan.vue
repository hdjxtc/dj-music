<template>
	<div class="similarplaylist" v-if="similarplaylist">
		<div class="title">
			<span>相似歌单</span>
		</div>
		<ul>
			<li v-for="(item,index) of similarplaylist" :key="index">
				<div class="author">
					<img :src="item.coverImgUrl" :alt="item.nickname" :title="item.nickname" />
				</div>
				<div class="info">
					<h2 class="ellipsis" :title="item.name" @click="toPlaylist(item.id)">{{item.name}}</h2>
					<span @click="toUser(item.userId)"><small>by {{item.creator.nickname}}</small></span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'similargedan',
		props: {
			similarplaylist: {
				type: Array
			}
		},
		methods: {
			// 跳转到用户界面
			toUser(id) {
				this.$router.push({
					name: 'personalpage',
					query: {
						id
					}
				})
			},
			// 跳转歌单页面
			toPlaylist(id) {
				this.$router.push({
					name: 'playlistdetail',
					query: {
						id: id
					}
				})
			},
		},
	}
</script>

<style scoped>
	.title {
		height: 20px;
		margin-bottom: 20px;
		margin-left: 32px;
		text-align: left;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.title span {
		border-left: 3px solid rgb(250, 40, 0);
		padding-left: 1rem;
		font-weight: 700;
	}

	ul li {
		list-style: none;
		display: flex;
		margin-bottom: 15px;
		cursor: pointer;
	}

	.author {
		width: 50px;
		height: 50px;
		border-radius: 3px;
		margin-right: 15px;
	}

	.author img {
		width: 100%;
		border-radius: 3px;
	}

	.info {
		height: 50px;
		font-size: 14px;
		text-align: left;
		margin-top: 3px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.info h2 {
		width: 100%;
		font-size: 13px;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.info h2:hover,
	.info span:hover {
		text-decoration: underline;
	}
</style>
