<template>
	<div class="list">
		<el-col :xs="24" :sm="24" :md="24" :lg="12" v-for="(item,index) in songList" :key="index">
			<div class="item">
				<div class="wrapper flex-centers shadow">
					<div class="index-container flex-centers">
						<span class="num">{{ handle.addZero(index + 1, 2) }}</span>
						<div class="boFang hidden-xs">
							<i class="el-icon-video-play" @click="playSong(songList,index)"></i>
						</div>
					</div>
					<div class="avatar" @click="playSong(songList,index)">
						<img :src="item.image">
					</div>
					<div class="info">
						<p class="name ellipsi">{{item.name}}</p>
						<p class="ellipsi">
							<span>{{item.singer}}</span>
						</p>
					</div>
					<p class="album hidden-xs">《{{item.album }}》</p>
					<p class="duration transition hidden-sm">
						{{ handle.SecondTime(item.duration) }}
					</p>
				</div>
			</div>
		</el-col>
	</div>
</template>

<script>
	import {createSong} from '@/model/song'
	import {mapActions} from 'vuex'
	export default {
		name: 'newmusic',
		data() {
			return {
				//音乐列表
				songList: [],
			};
		},
		created() {
			this.getNewSongs();
		},
		methods: {
			// // 获取推荐新音乐
			async getNewSongs() {
				try {
					const res = await this.$api.get("/personalized/newsong");
					let list = []
					res.result.map(item => {
						list.push(item.id)
					})
					// console.log('list',list)
					this.getSongDetail(list)
				} catch (error) {
					console.log(error)
				}
			},
			// 获取歌曲信息，拿歌曲作者、图片等
			async getSongDetail(lists) {
				try {
					let timestamp = new Date().valueOf()
					lists = lists.join(',')
					const res = await this.$api.get("/song/detail", {
						params: {
							ids: lists,
							timestamp: timestamp
						},
					});
					this.songList = this.hanlesonglist(res.songs)
					// console.log(this.songList)
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
			// 调用vuex的Actions改数据
			...mapActions([
				'selectPlay',
			])
		},
	}
</script>

<style scoped>
	p {
		margin-bottom: 0;
	}

	img {
		width: 50px;
		height: 50px;
	}

	.ellipsi {
		overflow: hidden;
		text-overflow: ellipsi;
		white-space: nowrap;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 63px;
		margin-left: 3.7rem;
	}

	.flex-centers {
		display: flex;
		align-items: center;
	}

	.list .item {
		flex: 0 0 50%;
		max-width: 50%;
		margin-bottom: 20px;
		height: 80px;
		padding: 0 15px 30px;
	}

	.list .item .wrapper {
		width: 213%;
		height: 80px;
		background-color: #fff;
		justify-content: start;
		padding: 0 10%;
		border-radius: 2px;
		position: relative;
	}

	.list .item .wrapper .bg {
		width: 100%;
		height: 80%;
		position: absolute;
		background-repeat: no-repeat;
		background-size: cover;
		top: 50%;
		left: 0;
		margin: -32px 0 0 0;
		opacity: 0.08;
		filter: blur(10px);
		z-index: -1;
	}

	.list .item .wrapper .index-container {
		width: 30px;
		margin-right: 10px;
	}

	.list .item .wrapper .index-container .num {
		color: #4a4a4a;
		font-weight: bold;
	}

	.list .item .wrapper .avatar {
		width: 55px;
		height: 55px;
		border-radius: 5px;
		position: relative;
		margin-right: 30px;
		cursor: pointer;
	}

	.list .item .wrapper .avatar img {
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}

	.list .item .wrapper .info {
		width: 25%;
	}

	.list .item .wrapper .info .name {
		font-size: 12px;
		color: #333;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.list .item .wrapper .info .author,
	.ellipsi span {
		font-size: 12px;
		color: #666;
		font-weight: bold;
	}

	.list .item .wrapper .album {
		font-size: 12px;
		color: #333;
		font-weight: bold;
		margin-left: 10%;
		flex: 1;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.list .item .wrapper .duration {
		font-size: 14px;
		color: #333;
		font-weight: bold;
		margin-left: 15%;
	}

	.list .item .wrapper .tools {
		width: 25%;
		height: 100%;
		padding-left: 4.28%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		opacity: 0;
		position: absolute;
		right: 4%;
		top: 0;
	}

	.list .item .wrapper .tools i {
		font-size: 20px;
		cursor: pointer;
		display: block;
		color: #666;
	}

	.flex-centers:hover .boFang {
		transform: translateY(0);
	}

	.boFang {
		width: 35px;
		position: absolute;
		/* bottom: 43px; */
		left: 2.5%;
		font-size: 1.5rem;
		background: #fff;
		transform: translateX(170%);
		transition: 0.2s;
		cursor: pointer;
	}

	.boFang i {
		color: rgba(255, 85, 0, 0.9);
	}

	.bigBox:hover .boFang {
		transform: translateY(0);
	}

	@media screen and (max-width: 768px) {
		.hidden-sm {
			display: none;
		}
	}

	@media screen and (max-width: 521px) {
		.hidden-xs {
			display: none;
		}

		.info {
			width: 60% !important;
			padding-left: 20%;
		}

		.wrapper {
			width: 225% !important;
		}
	}

	@media screen and (max-width: 376px) {
		.avatar {
			margin: 0 !important;
			margin-top: 1%;
		}

		.index-container {
			width: 20px !important;
			margin-right: 0 !important;
		}

		.wrapper {
			width: 230% !important;
		}

		.info {
			padding-left: 10% !important;
		}

		.info .name,
		.ellipsi {
			font-size: 12px !important;
		}
	}

	@media screen and (max-width: 361px) {
		.list {
			margin-left: 2rem;
		}

		.wrapper {
			width: 265% !important;
		}
	}

	@media screen and (max-width: 315px) {
		.wrapper {
			width: 305% !important;
		}

		.wrapper .avatar {
			width: 28px;
			height: 30px;
		}

		.info .name {
			margin-bottom: 0
		}

		.list {
			margin-left: 1.2rem;
		}
	}
</style>
