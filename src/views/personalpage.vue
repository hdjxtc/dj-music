<template>
	<div class="personalpagebox">
		<div class="left shadow">
			<div class="infobox">
				<div class="avata">
					<!-- 头像 -->
					<img :src="userProfile.avatarUrl">
				</div>
				<div class="info">
					<div class="name">
						<!-- 昵称 -->
						<h2>
							<span>{{userProfile.nickname}}</span>
							<!-- 等级 -->
							<i :class="'iconfont dj-icon-v' + userDetail.level"
								style="color: #FA2800;font-size: 30px;margin: 0 10px;vertical-align: middle;"></i>
						</h2>
					</div>
					<ul class="data">
						<li>
							<p class="num">{{ userProfile.eventCount }}</p>
							<p class="text">动态</p>
						</li>
						<li>
							<p class="num">{{ userProfile.newFollows }}</p>
							<p class="text">关注</p>
						</li>
						<li>
							<p class="num">{{ userProfile.followeds }}</p>
							<p class="text">粉丝</p>
						</li>
					</ul>
					<div class="area">
						<span v-if="provinceName!=''">所在地区：{{ provinceName }}</span>
						<span v-if="cityName!=''">- {{ cityName }}</span>
					</div>
					<div class="age">
						年龄：{{age}}
						<i class="iconfont" :class="userProfile.gender==1?'dj-icon-nan nan':'dj-icon-nv nv'"
							style="font-size: 20px;vertical-align: middle;"></i>
					</div>
				</div>
			</div>
			<div class="listenmusic flex-between">
				<p class="flex-row title">
					听歌排行 <span>（累积听歌{{ userDetail.listenSongs }}首）</span>
				</p>
				<div class="tab flex-row">
					<span :class="type == 1 ? 'active' : ''" @click="changeType(1)">最近一周</span>
					<span class="line"></span>
					<span :class="type == 0 ? 'active' : ''" @click="changeType(0)">所有时间</span>
				</div>
			</div>
			<Songlist v-if="songs.length > 0" :songlist="songs" :width1="300" :width2="200" :width3="200" />
			<Empty v-else />
		</div>
		<div class="right shadow">
			<div class="createplaylist">
				<span class="title">
					{{isMe}}创建的歌单
				</span>
				<Gedanlist :playList="myCreatelist" :num="2" />
			</div>
			<div class="collectionsplaylist">
				<span class="title">
					{{isMe}}收藏的歌单
				</span>
				<Gedanlist :playList="mycollectionlist" :num="2" />
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {createSong} from '@/model/song'
	import axios from 'axios'
	import Gedanlist from '@/components/contents/gedanlist'
	import Songlist from '@/components/contents/songlist'
	export default {
		name: 'personalpage',
		data() {
			return {
				// 用户详情
				userDetail: {},
				userProfile: {},
				// 地区
				provinceName: '',
				cityName: '',
				// 我创建的歌单
				myCreatelist: [],
				// 我收藏的歌单
				mycollectionlist: [],
				// 歌曲列表
				songs: [],
				type: 1,
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			age() {
				return this.handle.getAstro(this.userProfile.birthday)
			},
			isMe() {
				let userid = this.$route.query.id
				if (userid) {
					if (this.userProfile.gender == 1) {
						return '他'
					} else {
						return '她'
					}
				} else {
					return '我'
				}
			}
		},
		components: {
			Gedanlist,
			Songlist
		},
		watch: {
			$route(newval) {
				// 滚动条滚零
				let contents = document.getElementById('contents')
				contents.scrollTo(0, 0)
				if (newval.query.id) {
					this.getUserDetail(newval.query.id)
				} else {
					this.getUserDetail(this.userInfo.userId)
				}
			}
		},
		methods: {
			// 获取用户详情
			async getUserDetail(id) {
				try {
					let timestamp = new Date().getTime()
					let res = await this.$api.get(`/user/detail?uid=${id}&timestamp=${timestamp}`)
					if (res.code === 200) {
						// console.log(res)
						this.userDetail = res
						this.userProfile = res.profile
						this.initialize()
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取省市
			getArea() {
				// 高德地图api,行政区域查询
				axios
					.get('https://restapi.amap.com/v3/config/district', {
						params: {
							key: '884069cb342eae584fc9266ad762207e',
							keywords: this.userProfile.province,
							subdistrict: 1,
							// 不返回行政区边界坐标点
							extensions: 'base'
						}
					})
					.then(response => {
						// console.log(response)
						if (response.data.status == 1 && response.data.info == 'OK') {
							let districts = response.data.districts[0] || ''
							let subDistricts = response.data.districts[0].districts || ''
							this.provinceName = districts.name
							subDistricts.map(item => {
								if (item.adcode == this.userProfile.city) {
									this.cityName = item.name
								}
							})
						}
					})
					.catch(function(error) {
						console.log(error)
					})
			},
			// 获取用户歌单
			async getUserArtist() {
				try {
					let timestamp = new Date().getTime()
					let res = await this.$api.get(
						`/user/playlist?uid=${this.userProfile.userId}&timestamp=${timestamp}`)
					if (res.code === 200) {
						// console.log(res)
						let list = res.playlist
						let myCreatelist = []
						let mycollectionlist = []
						list.map(item => {
							// 创建收藏分别存储
							if (item.userId === this.userProfile.userId) {
								myCreatelist.push(item)
							} else {
								mycollectionlist.push(item)
							}
						})
						this.myCreatelist = myCreatelist
						this.mycollectionlist = mycollectionlist
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取用户播放记录
			async getUserRecord() {
				try {
					let timestamp = new Date().getTime()
					let res = await this.$api.get(
						`/user/record?uid=${this.userProfile.userId}&type=${this.type}&timestamp=${timestamp}`)
					if (res.code === 200) {
						// 最近一周
						if (this.type == 1) {
							this.songs = this.normalizeSongs(res.weekData)
						}
						// 全部
						else {
							this.songs = this.normalizeSongs(res.allData)
						}
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 处理歌曲
			normalizeSongs(list) {
				let ret = []
				list.map(item => {
					item.song.playCount = item.playCount
					item.song.score = item.score
					if (item.song.id) {
						ret.push(createSong(item.song))
					}
				})
				return ret
			},
			// 修改一周数据或者全部
			changeType(type) {
				this.type = type
				this.getUserRecord()
			},
			// 初始化
			initialize() {
				this.getArea()
				this.getUserRecord()
				this.getUserArtist()
			},
		},
		mounted() {
			// 滚动条滚零
			let contents = document.getElementById('contents')
			contents.scrollTo(0, 0)
			let userid = this.$route.query.id
			if (userid) {
				this.getUserDetail(userid)
			} else {
				if (this.userInfo == null) {
					this.$message.warning('请先登录！')
					return
				}
				this.getUserDetail(this.userInfo.userId)
			}
		}
	}
</script>

<style scoped>
	ul {
		list-style: none;
		padding-left: 0;
	}

	p {
		margin-bottom: 0;
	}

	.flex-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 0 !important;
	}

	/* 总盒 */
	.personalpagebox {
		display: flex;
		align-items: flex-start;
	}

	/* 左栏 */
	.personalpagebox .left {
		/* width: 950px; */
		width: 72%;
		margin-right: 20px;
		padding: 1rem;
	}

	/* 右栏 */
	.personalpagebox .right {
		width: 350px;
		padding: 15px;
	}

	/* 信息栏 */
	.personalpagebox .infobox {
		display: flex;
		align-items: center;
	}

	/* 头像 */
	.personalpagebox .infobox .avata {
		width: 180px;
		height: 180px;
		margin-right: 30px;
	}

	.personalpagebox .infobox .avata img {
		width: 100%;
		height: 100%;
		padding: 3px;
		border: 1px solid #ccc;
	}

	/* 数据 */
	.personalpagebox .infobox .data {
		display: flex;
	}

	.personalpagebox .infobox .data li {
		margin: 0 40px 0 0;
	}

	/* 名 */
	.personalpagebox .infobox .info h2,
	.personalpagebox .infobox .area,
	.personalpagebox .infobox .age {
		text-align: left;
	}

	.personalpagebox .infobox .info h2 {
		font-size: 22px;
	}

	.personalpagebox .text,
	.area,
	.age {
		font-size: 14px;
		color: #585858;
		line-height: 24px;
	}

	/* 标题 */
	.personalpagebox .title {
		text-align: left;
		border-left: 3px solid #fa2800;
		height: 20px;
		padding-left: 1rem;
		margin-bottom: 15px;
		font-weight: bold;
		display: flex;
		align-items: center;
	}

	.personalpagebox .listenmusic {
		padding: 20px;
		margin-top: 50px;
		padding-left: 5px;
	}

	.personalpagebox .listenmusic span {
		font-weight: 100;
		color: #666;
		font-size: 12px;
	}

	.personalpagebox .listenmusic .line {
		width: 1px;
		height: 13px;
		background: #999;
		display: block;
		margin: 0 10px;
	}

	.personalpagebox .listenmusic .tab {
		cursor: pointer;
	}

	.personalpagebox .listenmusic .active {
		color: #FA2800;
	}

	@media screen and (max-width: 1200px) {
		.personalpagebox {
			display: block;
		}
		
		.personalpagebox .left,.personalpagebox .right {
			width: 100%;
		}
	}

	@media screen and (max-width: 476px) {
		.personalpagebox .left .infobox {
			display: block;
		}
	}
</style>
