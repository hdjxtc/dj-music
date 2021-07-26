<template>
	<div class="singerdetailbox">
		<div class="top">
			<!-- 遮罩 -->
			<div class="top-box">
				<div class="avata">
					<!-- 头像 -->
					<img :src="detail.img1v1Url" />
					<!-- 等级 -->
					<div class="level flex-center" v-show="level">
						<i class="iconfont icon-level" :class="level" style="color: #FA2800;font-size: 25px;"></i>
					</div>
				</div>
				<!-- 姓名 -->
				<p class="nickname">
					{{ detail.name }}
					<i class="iconfont" :class="gender" style="font-size: 25px;"></i>
				</p>
				<!-- 描述 -->
				<div class="desc ellipsis-two" v-html="detail.briefDesc"></div>
				<!-- 信息 -->
				<ul class="info flex-center">
					<li>
						<p class="num">{{ detail.musicSize }}</p>
						<p class="text">单曲数</p>
					</li>
					<li>
						<p class="num">{{ detail.albumSize }}</p>
						<p class="text">专辑数</p>
					</li>
					<li>
						<p class="num">{{ detail.mvSize }}</p>
						<p class="text">MV数</p>
					</li>
					<li v-show="detail.followeds">
						<p class="num">{{ detail.followeds }}</p>
						<p class="text">粉丝</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="bottom">
			<el-tabs type="card">
				<!-- 作品 -->
				<el-tab-pane label="作品">
					<Songlist :songlist="songs" :width1="400" :width2="300" :width3="300" />
				</el-tab-pane>
				<!-- 专辑 -->
				<el-tab-pane label="专辑">
					<Albumlist :albums="albums" />
				</el-tab-pane>
				<!-- MV -->
				<el-tab-pane label="MV">
					<Videolist :videos="mvs" :isVideo="false" />
				</el-tab-pane>
				<!-- 歌手详情 -->
				<el-tab-pane label="歌手详情">
					<div class="info-box">
						<h2 class="title">{{ detail.name }}简介</h2>
						<div class="profile" v-html="singerDesc.briefDesc"></div>
						<div class="introduction">
							<div class="item" v-for="item of singerDesc.introduction" :key="item.ti">
								<h3 class="sub-title">{{ item.ti }}</h3>
								<p v-html="item.txt"></p>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<!-- 相似歌手 -->
				<el-tab-pane label="相似歌手">
					<ul class="singer-list" v-if="singers.length > 0">
						<Singerlist v-for="(item,index) of singers" :key="index" :item="item" />
					</ul>
					<Empty v-else />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import Songlist from '@/components/contents/songlist'
	import Albumlist from '@/components/contents/albumlist'
	import Videolist from '@/components/contents/videolist'
	import Singerlist from '@/components/contents/singerlist'
	import {
		createSong,
		createVideo
	} from '@/model/song'
	export default {
		name: 'singerdetail',
		data() {
			return {
				// 歌手基本信息
				singerDetail: {},
				// 歌手用户信息
				userDetail: {},
				// 热门单曲
				songs: [],
				// 专辑
				albums: [],
				// 歌手MV
				mvs: [],
				// 歌手简介
				singerDesc: {},
				// 相似歌手
				singers: [],
				// 歌手id
				singerId: '',
				// 分页偏移
				offset: 0,
			}
		},
		components: {
			Songlist,
			Albumlist,
			Videolist,
			Singerlist
		},
		watch: {
			$route() {
				// 滚动条滚零
				let contents = document.getElementById('contents')
				contents.scrollTo(0,0)
				let id = this.$route.query.id || this.videoId
				if (id) {
					this.initialize(id)
				}
			}
		},
		computed: {
			detail() {
				return Object.assign(this.singerDetail, this.userDetail)
			},
			// 设置歌手性别
			gender() {
				if (this.detail.gender > 0) {
					return this.detail.gender === 1 ?
						'dj-icon-nan nan' :
						'dj-icon-nv nv'
				} else {
					return ''
				}
			},
			// 设置歌手等级
			level() {
				if (this.detail.level > 0) {
					return 'dj-icon-v' + this.detail.level
				} else {
					return ''
				}
			}
		},
		methods: {
			// 获取歌手基本信息和热门50首单曲
			async getArtists(id) {
				try {
					let res = await this.$api.get(`/artists?id=${id}`)
					// console.log(res)
					if (res.code === 200) {
						this.singerDetail = res.artist
						if (res.artist.accountId) {
							this.getUserDetail(res.artist.accountId)
						}
					}
					this.songs = this.normalizeSongs(res.hotSongs)
					this.getArtistAlbum(id)
					this.getArtistMv(id)
				} catch (error) {
					console.log(error)
				}
			},
			// 获取(歌手)用户信息
			async getUserDetail(uid) {
				let detail = {}
				try {
					let res = await this.$api.get(`/user/detail?uid=${uid}`)
					// console.log(res)
					let profile = res.profile
					if (res.code === 200) {
						// 等级
						detail.level = res.level
						// 粉丝
						detail.followeds = profile.followeds
						// 性别
						detail.gender = profile.gender
						this.userDetail = detail
					}
				} catch (error) {
					detail.level = ''
					detail.followeds = ''
					detail.gender = ''
					this.userDetail = detail
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
			// 获取歌手专辑
			async getArtistAlbum(id) {
				let params = {
					id: this.singerId || id,
					limit: this.detail.albumSize,
					offset: this.offset
				}
				try {
					let res = await this.$api.get(`/artist/album`, {
						params: params
					})
					if (res.code === 200) {
						this.albums = res.hotAlbums
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取歌手MV
			async getArtistMv(id) {
				let params = {
					id: this.singerId || id,
					limit: this.detail.mvSize,
					offset: this.offset
				}
				try {
					let res = await this.$api.get(`artist/mv`, {
						params: params
					})
					if (res.code === 200) {
						this.mvs = this.normalizeVideos(res.mvs)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 处理视频
			normalizeVideos(list) {
				let ret = []
				list.map(item => {
					if (item.id) {
						ret.push(
							createVideo({
								id: item.id,
								nickName: item.artistName,
								name: item.name,
								playCount: item.playCount,
								duration: item.duration,
								image: item.imgurl16v9
							})
						)
					}
				})
				return ret
			},
			// 获取歌手简介
			async getArtistDesc(id) {
				try {
					let res = await this.$api.get(`/artist/desc?id=${id}`)
					if (res.code === 200) {
						if (res.introduction.length > 0) {
							res.introduction.map(item => {
								item.txt = item.txt.replace(/(\r\n|\n|\r)/gm, '<br />')
							})
						}
						this.singerDesc = res
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取相似歌手
			async getArtistSimi(id) {
				try {
					let res = await this.$api.get(`/simi/artist?id=${id}`)
					if (res.code === 200) {
						this.singers = res.artists
					}
				} catch (error) {
					console.log(error)
				}
			},
			//初始化
			initialize(id) {
				this.albums = []
				this.mvs = []
				this.singerId = Number(id)
				this.getArtists(id)
				// this.getUserDetail(id)
				this.getArtistDesc(id)
				this.getArtistSimi(id)
			}
		},
		created() {
			let id = this.$route.query.id || this.singer.id
			if (id) {
				this.initialize(id)
			}
		},
	}
</script>

<style scoped>
	.top-box ul {
		margin-bottom: 0;
		padding-left: 0;
		list-style: none;
	}

	p {
		margin-bottom: 0;
	}

	.flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.singerdetailbox {
		background-size: cover;
	}

	.singerdetailbox .top {
		width: 100%;
		margin-bottom: 150px;
	}

	.singerdetailbox .top-box {
		width: 100%;
		height: 100%;
		padding-top: 50px;
	}

	/* 头像 */
	.singerdetailbox .avata {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		position: relative;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 50px;
		transition: .3s;
	}

	.singerdetailbox .avata:hover {
		box-shadow: 0px 5px 20px 0px rgb(255 255 255 / 80%);
	}

	.singerdetailbox .avata img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: #fff;
		border: 3px solid rgba(255, 255, 255, .6);
	}

	/* 等级 */
	.singerdetailbox .level {
		width: 100%;
		height: 25px;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, .8);
	}

	/* 名字 */
	.singerdetailbox .nickname {
		margin-top: 20px;
		font-size: 24px;
		font-weight: 700;
		color: #0d274f;
		line-height: 24px;
		margin-bottom: 30px;
	}

	/* 描述 */
	.singerdetailbox .desc {
		margin: 0 auto 24px;
		width: 80%;
		height: 48px;
		font-size: 14px;
		color: #585858;
		line-height: 24px;
	}

	.singerdetailbox .ellipsis-two {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	/* 计数 */
	.singerdetailbox .num {
		margin-bottom: 8px;
		font-size: 24px;
		line-height: 24px;
		color: #ff5500;
	}
	.singerdetailbox .text {
		font-size: 14px;
		color: #585858;
		line-height: 24px;
	}
	.singerdetailbox .info li {
		margin: 0 5%;
		text-align: center;
	}
	
	/* 歌手详情 */
	.singerdetailbox .info-box {
		padding: 3rem;
	}
	.singerdetailbox .info-box .profile{
		margin-bottom: 50px;
		font-size: 14px;
		color: #4a4a4a;
		line-height: 30px;
	}
	.singerdetailbox .info-box .title{
		font-size: 18px;
		font-weight: 600;
		position: relative;
		margin-bottom: 30px;
	}
	.singerdetailbox .info-box .title::after{
		content: '';
		width: 5%;
		height: 2px;
		background: #fa2800;
		position: absolute;
		left: 49.3%;
		bottom: -10px;
		margin-left: -20px;
	}
	.singerdetailbox .info-box .introduction{
		text-align: left;
		font-size: 14px;
		color: #4a4a4a;
		line-height: 30px;
	}
	.singerdetailbox .info-box .sub-title {
		margin: 20px 0 10px 0;
		font-size: 18px;
		font-weight: 600;
		color: #1f2d3a;;
	}
	
	@media screen and (max-width: 386px) {
		.singerdetailbox .info li {
			margin: 0 2%;
		}
	}
</style>
