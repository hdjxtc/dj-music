<template>
	<div class="similarsongbox" v-if="similarsongs">
		<div class="title">
			<span>相似歌曲</span>
		</div>
		<ul>
			<li v-for="(item,index) of similarsongs" :key="index">
				<div class="author">
					<img :src="item.album.picUrl || item.cover" alt="404" />
				</div>
				<div class="info">
					<h2 class="ellipsis" :title="item.name" @click="playsong(item.id)">{{item.name}}</h2>
					<span @click="toSinger(item.id)"><small>{{singer[index]}}</small></span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'similarsong',
		data() {
			return {
				singer: [],
			}
		},
		props: {
			similarsongs: {
				type: Array
			}
		},
		methods: {
			// 播放歌曲
			playsong(id) {
				console.log(id)
			},
			// 跳转歌手页面
			toSinger(id) {
				this.$router.push({
					name: 'singerpage',
					query: {
						id: id
					}
				})
				// this.setSinger(item)
			},
		},
		watch: {
			similarsongs(news) {
				news.map(item => {
					item.artists.map(items => {
						this.singer.push(items.name)
					})
				})
			}
		}
	}
</script>

<style scoped>
	.similarsongbox {
		margin-top: 50px;
	}

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
	}

	.info h2 {
		width: 100%;
		font-size: 13px;
		margin-bottom: 10px;
		font-weight: 600;
	}

	.info h2:hover,
	.info span:hover {
		text-decoration: underline;
	}
</style>
