<template>
	<div class="searchbox">
		<div style="margin: 30px 0">
			<el-input placeholder="请输入内容" v-model="keyword" class="input-with-select shadow inputsize" clearable
				@keyup.enter.native="search(type)">
				<el-button slot="append" icon="el-icon-search" @click="search(type)"></el-button>
			</el-input>
		</div>
		<div class="tis" v-if="type==1">
			搜索{{keyword}}，找到 <b class="num">{{songCount}}</b> 条单曲
		</div>
		<div class="tis" v-if="type==100">
			搜索{{keyword}}，找到 <b class="num">{{artistCount}}</b> 个歌手
		</div>
		<div class="tis" v-if="type==10">
			搜索{{keyword}}，找到 <b class="num">{{albumCount}}</b> 张专辑
		</div>
		<div class="tis" v-if="type==1014">
			搜索{{keyword}}，找到 <b class="num">{{videoCount}}</b> 个视频
		</div>
		<div class="tis" v-if="type==1000">
			搜索{{keyword}}，找到 <b class="num">{{playlistCount}}</b> 个歌单
		</div>
		<el-tabs type="card" @tab-click="changeType">
			<!-- 单曲 -->
			<el-tab-pane label="单曲">
				<Songlist :songlist="songList" />
				<div class="feny" v-if="songCount">
					<Feny :total="songCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
			<!-- 歌手 -->
			<el-tab-pane label="歌手">
				<ul class="singer-list">
					<Singerlist v-for="(item,index) of singers" :key="index" :item="item" />
				</ul>
				<div class="feny" v-if="artistCount">
					<Feny :total="artistCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
			<!-- 专辑 -->
			<el-tab-pane label="专辑">
				<Albumlist :albums="albums"/>
				<div class="feny" v-if="albumCount">
					<Feny :total="albumCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
			<!-- 视频 -->
			<el-tab-pane label="视频">
				<Videolist :videos="videos"/>
				<div class="feny" v-if="videoCount">
					<Feny :total="videoCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
			<!-- 歌单 -->
			<el-tab-pane label="歌单">
				<Gedanlist :playList="playList"/>
				<div class="feny" v-if="playlistCount">
					<Feny :total="playlistCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {createSong,createVideo} from '@/model/song'
	import Songlist from '@/components/contents/songlist'
	import Singerlist from '@/components/contents/singerlist'
	import Albumlist from '@/components/contents/albumlist'
	import Gedanlist from '@/components/contents/gedanlist'
	import Videolist from '@/components/contents/videolist'
	import Feny from '@/components/contents/feny'
	export default {
		data() {
			return {
				songCount: "",
				artistCount: "",
				albumCount: "",
				videoCount: "",
				playlistCount: "",
				// 搜索用到的数据
				keyword: "",
				limit: 30,
				offset: 0,
				type: 1,
				// 请求后处理过的数据
				songList: [],
				singers: [],
				albums: [],
				videos: [],
				playList: [],
			};
		},
		components: {
			Songlist,
			Singerlist,
			Albumlist,
			Gedanlist,
			Videolist,
			Feny
		},
		mounted() {
			// 从路由路径拿到传递的搜索关键词
			let keyword = this.$route.query.keyword
			if (keyword) {
				this.keyword = keyword
				this.search(this.type)
			}
		},
		methods: {
			// 搜索
			search(type) {
				if (this.keyword.split(' ').join('').length !== 0) {
					this.$message({
						message: '请稍后！',
						duration: 1500
					})
					this.$api.get(
							`/search?keywords=${this.keyword}&limit=${this.limit}&offset=${this.offset}&type=${type}`)
						.then(res => {
							if (res.code == 200) {
								switch (type) {
									// 单曲
									case 1: {
										let lists = res.result.songs
										let songid = []
										lists.map(item => {
											songid.push(item.id)
										})
										this.getMusicList(songid)
										break
									}
									// 歌手
									case 100: {
										this.singers = res.result.artists
										// console.log(this.singers)
										break
									}
									// 专辑
									case 10: {
										this.albums = res.result.albums
										// console.log(this.albums)
										break
									}
									// 视频
									case 1014: {
										this.videos = this.normalizeVideos(res.result.videos)
										// console.log(this.videos)
										break
									}
									// 歌单
									case 1000: {
										this.playList = res.result.playlists
										// console.log(this.playList)
										break
									}
								}
								// console.log(res)
								this.songCount = res.result.songCount;
								this.artistCount = res.result.artistCount;
								this.albumCount = res.result.albumCount;
								this.videoCount = res.result.videoCount;
								this.playlistCount = res.result.playlistCount;
							}
						})
						.catch(err => {
							this.$message.error(err)
						})
				}
			},
			//获取歌曲列表
			async getMusicList(songid) {
				let timestamp = new Date().valueOf()
				let ids = songid.join(',')
				try {
					let res = await this.$api.get("/song/detail", {
						params: {
							ids: ids,
							timestamp: timestamp
						}
					})
					this.songList = this.normalizeSongs(res.songs)
					// console.log(this.songList)
				} catch (err) {
					this.$message.error(err)
				}
			},
			// 处理歌曲
			normalizeSongs(list) {
				let ret = []
				list.map(item => {
					if (item.id) {
						ret.push(createSong(item))
					}
				})
				return ret
			},
			// 处理视频
			normalizeVideos(list) {
				let ret = []
				list.map(item => {
					if (item.vid) {
						ret.push(
							createVideo({
								id: item.vid,
								name: item.title,
								playCount: item.playTime,
								duration: item.durationms,
								image: item.coverUrl,
							})
						)
					}
				})
				return ret
			},
			// 分页跳转
			pageChange(page) {
				this.offset = (page - 1) * this.limit;
				this.search(this.type);
			},
			// 更改搜索类型
			changeType(tab) {
				if (tab.index == 0) {
					this.type = 1
					this.search(1)
				} else if (tab.index == 1) {
					this.type = 100
					this.search(100)
				} else if (tab.index == 2) {
					this.type = 10
					this.search(10)
				} else if (tab.index == 3) {
					this.type = 1014
					this.search(1014)
				} else {
					this.type = 1000
					this.search(1000)
				}
			},
		},
	}
</script>

<style>
	.inputsize {
		width: 35% !important;
	}

	@media screen and (max-width: 992px) {
		.inputsize {
			width: 50% !important;
		}
	}

	.el-tabs__header {
		margin-bottom: 0 !important;
	}

	.is-top {
		margin-left: 1.3%;
		padding-right: 1.8%;
	}

	.tis {
		font-size: 14px;
		color: #999;
		text-align: left;
		margin: 0 0 1% 2.5%;
	}

	.num {
		color: #c20c0c;
	}

	.singer-list {
		display: flex;
		flex-wrap: wrap;
		padding: 2rem;
	}
</style>
