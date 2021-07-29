<template>
	<div class="searchbox">
		<div style="margin: 30px 0;position: relative;">
			<el-input placeholder="请输入内容" v-model="keyword" class="input-with-select shadow inputsize" clearable
				@keyup.enter.native="search(type)" @focus="isshow = true" @blur="blur">
				<el-button slot="append" icon="el-icon-search" @click="search(type)"></el-button>
			</el-input>
			<!-- 搜索推荐 -->
			<div class="commentbox" v-if="isshow">
				<div class="item" v-if="commentsongs.length>0">
					<h4 class="tag">
						<i class="iconfont dj-icon-yinfu1"></i>
						<span style="margin-left: 5px;">单曲</span>
					</h4>
					<ul>
						<li class="tags" v-for="item of commentsongs" :key="item.id" @click="getSongDetail(item.id)">
							<!-- 匹配关键字 -->
							<p v-if="item.name.split(keyword).length>1">
								<span style="color: #13b8ff;">{{keyword}}</span>
								<span>{{item.name.split(keyword)[1]}} - {{item.artists[0].name}}</span>
							</p>
							<p v-else>
								{{item.name}} - {{item.artists[0].name}}
							</p>
						</li>
					</ul>
				</div>
				<div class="item" v-if="commentartists.length>0">
					<h4 class="tag">
						<i class="iconfont dj-icon-yonghu"></i>
						<span style="margin-left: 5px;">歌手</span>
					</h4>
					<ul style="background: #efefef;">
						<li class="tags" v-for="item of commentartists" :key="item.id" @click="toSingerdetail(item.id)">
							<!-- 匹配关键字 -->
							<p v-if="item.name.split(keyword).length>1">
								<span style="color: #13b8ff;">{{keyword}}</span>
								<span>{{item.name.split(keyword)[1]}}</span>
							</p>
							<p v-else>
								{{item.name}}
							</p>
						</li>
					</ul>
				</div>
				<div class="item" v-if="commentalbums.length>0">
					<h4 class="tag">
						<i class="iconfont dj-icon-zhuanji"></i>
						<span style="margin-left: 5px;">专辑</span>
					</h4>
					<ul>
						<li class="tags" v-for="item of commentalbums" :key="item.id" @click="toAlbumdetail(item.id)">
							<!-- 匹配关键字 -->
							<p v-if="item.name.split(keyword).length>1">
								<span style="color: #13b8ff;">{{keyword}}</span>
								<span>{{item.name.split(keyword)[1]}} - {{item.artist.name}}</span>
							</p>
							<p v-else>
								{{item.name}} - {{item.artist.name}}
							</p>
						</li>
					</ul>
				</div>
				<div class="item" v-if="commentplaylists.length>0">
					<h4 class="tag">
						<i class="iconfont dj-icon-gedan" style="font-size: 17px;"></i>
						<span style="margin-left: 5px;">歌单</span>
					</h4>
					<ul style="background: #efefef;">
						<li class="tags" v-for="item of commentplaylists" :key="item.id" @click="toPlaydetail(item.id)">
							<!-- 匹配关键字 -->
							<p v-if="item.name.split(keyword).length>1">
								<span>{{item.name.split(keyword)[0]}}</span>
								<span style="color: #13b8ff;">{{keyword}}</span>
								<span>{{item.name.split(keyword)[1]}}</span>
							</p>
							<p v-else>
								{{item.name}}
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="tis" v-if="type==1">
			<b class="keyword">{{keyword}}</b>，共找到 <b class="num">{{songCount}}</b> 条单曲
		</div>
		<div class="tis" v-if="type==100">
			<b class="keyword">{{keyword}}</b>，共找到 <b class="num">{{artistCount}}</b> 个歌手
		</div>
		<div class="tis" v-if="type==10">
			<b class="keyword">{{keyword}}</b>，共找到 <b class="num">{{albumCount}}</b> 张专辑
		</div>
		<div class="tis" v-if="type==1014">
			<b class="keyword">{{keyword}}</b>，共找到 <b class="num">{{videoCount}}</b> 个视频
		</div>
		<div class="tis" v-if="type==1000">
			<b class="keyword">{{keyword}}</b>，共找到 <b class="num">{{playlistCount}}</b> 个歌单
		</div>
		<el-tabs type="card" @tab-click="changeType">
			<!-- 单曲 -->
			<el-tab-pane label="单曲">
				<Songlist :songlist="songList" :width1="400" :width2="300" :width3="300" />
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
				<Albumlist :albums="albums" />
				<div class="feny" v-if="albumCount">
					<Feny :total="albumCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
			<!-- 视频 -->
			<el-tab-pane label="视频">
				<Videolist :videos="videos" :isVideo="false" />
				<div class="feny" v-if="videoCount">
					<Feny :total="videoCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
			<!-- 歌单 -->
			<el-tab-pane label="歌单">
				<Gedanlist :playList="playList" />
				<div class="feny" v-if="playlistCount">
					<Feny :total="playlistCount" @pageChange="pageChange" />
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {
		createSong,
		createVideo
	} from '@/model/song'
	import {
		mapActions
	} from 'vuex'
	import Songlist from '@/components/contents/songlist'
	import Singerlist from '@/components/contents/singerlist'
	import Albumlist from '@/components/contents/albumlist'
	import Gedanlist from '@/components/contents/gedanlist'
	import Videolist from '@/components/contents/videolist'
	import Feny from '@/components/contents/feny'
	export default {
		data() {
			return {
				// 各类型数量
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
				// 搜索推荐需要的数据
				// 是否显示
				isshow: false,
				// 单曲
				commentsongs: [],
				// 歌手
				commentartists: [],
				// 专辑
				commentalbums: [],
				// 歌单
				commentplaylists: [],
				// 顺序
				commentorder: []
			};
		},
		components: {
			Songlist,
			Singerlist,
			Albumlist,
			Videolist,
			Gedanlist,
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
		watch: {
			keyword(newval) {
				// 不为空才请求
				// console.log(newval)
				let timestamp = new Date().getTime()
				this.$api.get(`/search/suggest?keywords=${newval}&timestamp=${timestamp}`).then(res => {
					// console.log(res)
					// 单曲
					if (res.result.songs != undefined) {
						this.commentsongs = res.result.songs
					} else {
						this.commentsongs = []
					}
					// 歌手
					if (res.result.artists != undefined) {
						this.commentartists = res.result.artists
					} else {
						this.commentartists = []
					}
					// 专辑
					if (res.result.albums != undefined) {
						this.commentalbums = res.result.albums
					} else {
						this.commentalbums = []
					}
					// 歌单
					if (res.result.playlists != undefined) {
						this.commentplaylists = res.result.playlists
					} else {
						this.commentplaylists = []
					}

				}).catch(err => {
					console.log(err)
				})
				// 为空时清空之前的数据
				if (newval == '') {
					this.commentsongs = []
					this.commentartists = []
					this.commentalbums = []
					this.commentplaylists = []
				}
			},
			// 监听导航栏输入框里的搜索
			$route(newobj, oldobj) {
				// console.log(newobj, oldobj)
				if (newobj.query.keyword !== oldobj.query.keyword) {
					this.keyword = newobj.query.keyword
					this.search(this.type)
				}
			}
		},
		methods: {
			// 搜索
			search(type) {
				if (this.keyword.split(' ').join('').length !== 0) {
					this.$message({
						message: '请稍后！',
						duration: 1000
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
					// 获取到歌曲信息
					let res = await this.$api.get("/song/detail", {
						params: {
							ids: ids,
							timestamp: timestamp
						}
					})
					// console.log(res.songs)
					this.songList = this.normalizeSongs(res.songs)
					// console.log(this.songList)
				} catch (err) {
					this.$message.error(err)
				}
			},
			// 处理歌曲
			normalizeSongs(list) {
				// 处理后的歌曲信息
				let ret = []
				list.map((item) => {
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
			// 关闭搜索推荐容器
			blur() {
				setTimeout(() => {
					this.isshow = false
				}, 200)
			},
			// 播放搜索推荐歌曲
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
					this.playSong(this.hanlesonglist(res.songs), 0)
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
			// 前往歌手详情页
			toSingerdetail(id) {
				this.$router.push({
					name: 'singerdetail',
					query: {
						id: id
					}
				})
				// this.setSinger(item)
			},
			// 前往专辑详情页
			toAlbumdetail(id) {
				this.$router.push({
					name: 'albumdetail',
					query: {
						id
					}
				})
			},
			// 前往歌单详情页
			toPlaydetail(id) {
				this.$router.push({
					name: 'playlistdetail',
					query: {
						id: id
					}
				})
			}
		},
	}
</script>

<style>
	/* 搜索框大小 */
	.inputsize {
		width: 35% !important;
	}

	@media screen and (max-width: 992px) {
		.inputsize {
			width: 50% !important;
		}
	}
	@media screen and (max-width: 768px) {
		.inputsize {
			width: 70% !important;
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
		color: #767676;
		text-align: left;
		margin: 0 0 1% 2.5%;
	}

	.num {
		color: #c20c0c;
	}

	.keyword {
		color: #409EFF;
		font-size: 18px;
		font-weight: normal
	}

	.singer-list {
		display: flex;
		flex-wrap: wrap;
		padding: 2rem;
	}

	.searchbox .playall {
		width: 95%;
	}

	/* 搜索推荐 */
	.commentbox {
		width: 30.5%;
		background: #F9F9F9;
		position: absolute;
		left: 32.5%;
		border-radius: 3px;
		padding-left: 15px;
		overflow: hidden;
		z-index: 3;
	}
	@media screen and (max-width: 992px) {
		.commentbox {
			width: 41.5%;
			left: 25.5%;
		}
	}
	@media screen and (max-width: 768px) {
		.commentbox {
			width: 58.5%;
			left: 15.5%;
		}
	}
	@media screen and (max-width: 576px) {
		.commentbox {
			width: 69.8%;
			left: 15.1%;
			padding-left: 0;
		}
		.commentbox .item .tag {
			font-size: 12px!important;
		}	
		.commentbox .item .tags p{
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			width: 95%;
		}
		.commentbox .item .tags {
			white-space: nowrap;
			font-size: 12px;
		}
	}


	/* 第一个类别的标题 */
	.commentbox .item:nth-of-type(1) .tag {
		padding-top: 10px;
	}

	/* 最后一个类别的最后一条数据 */
	.commentbox .item:last-child .tags:last-child {
		border-bottom: none;
	}

	/* 每个类别的最后一条数据 */
	.commentbox .item .tags:last-child {
		border-bottom: 1px solid #ccc;
	}

	.commentbox ul {
		list-style: none;
		padding-left: 0;
		margin-bottom: 0;
		width: 100%;
		text-align: left;
	}

	.commentbox ul li {
		font-size: 13px;
		color: #202227;
		padding: 10px 0 10px 15px;
	}

	.commentbox .item {
		display: flex;

	}

	.commentbox .item .tag {
		width: 20%;
		padding: 10px 15px 10px 0;
		margin-bottom: 0;
		border-right: 1px solid #ccc;
		font-size: 13px;
		color: #202227;
		white-space: nowrap;
	}

	.commentbox .item .tags {
		cursor: pointer;
	}

	.commentbox .item .tags p{
		margin-bottom: 0;
	}

	.commentbox .item .tags:hover {
		background: #c5c5c5;
	}
</style>
