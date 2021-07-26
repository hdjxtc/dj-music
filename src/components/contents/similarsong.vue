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
					<h2 class="ellipsis" :title="item.name" @click="getSongDetail(item.id)">{{item.name}}</h2>
					<span @click="toSinger(item.artists[0].id)"><small>{{singer[index]}}</small></span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import {mapActions} from 'vuex'
	import {createSong} from '@/model/song'
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
			// 获取歌曲信息，拿歌曲作者、图片等
			async getSongDetail(id) {
				try {
					let timestamp = new Date().getTime()
					const res = await this.$api.get("/song/detail", {
						params: {
							ids: id,
							timestamp: timestamp
						},
					});
					this.playSong(this.hanlesonglist(res.songs),0)
				} catch (error) {
					console.log(error)
				}
			},
			// 处理歌曲
			hanlesonglist(list) {
				let ret = []
				list.map(item => {
					if (item.id) {
						ret.push(createSong(item))
					}
				})
				return ret
			},
			// 播放歌曲
			playSong(list, index) {
				try {
					let id = list[index].id
					this.$api.get(`/song/url?id=${id}`).then(res => {
						list[index].url = res.data[0].url
						// console.log(res)
						this.selectPlay({
							list,
							index
						})
					})
				} catch (error) {
					console.log(error)
				}
			},
			...mapActions([
				'selectPlay',
			]),
			// 跳转歌手页面
			toSinger(id) {
				this.$router.push({
					name: 'singerdetail',
					query: {
						id: id
					}
				})
			},
		},
		watch: {
			similarsongs(news) {
				if(news){
					news.map(item => {
						item.artists.map(items => {
							this.singer.push(items.name)
						})
					})
				}
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
