<template>
	<div class="videobox">
		<div class="filter shadow">
			<!-- 下拉 -->
			<div class="title flex-center" @click="openFilter">
				{{currenttag}}
				<i class="el-icon-arrow-down" :style="showFilter?'transform: rotate(0)':''"></i>
				<transition name="fade">
					<div class="filter-box shadow" v-if="showFilter">
						<ul>
							<li v-for="item of tags" :key="item.id" :class="currenttag == item.name ? 'active' : ''"
								@click="choosetag(item.id, item.name)">
								{{ item.name }}
							</li>
						</ul>
					</div>
				</transition>
			</div>
			<!-- 热门类别 -->
			<div class="hot-tag flex-row">
				<p>分类：</p>
				<ul class="flex-center">
					<li v-for="item of hottags" :key="item.id" :class="currenttag == item.name ? 'active' : ''"
						@click="choosetag(item.id, item.name)">
						{{ item.name }}
					</li>
				</ul>
			</div>
			<div class="all" :class="currenttag == '全部' ? 'active' : ''" @click="choosetag('', '全部')">
				全部
			</div>
		</div>
		<!-- 视频列表 -->
		<Videolist :videos="videos" :isVideo="true" />
		<!-- 切换 -->
		<div class="page bottom-action">
			<!-- 没有总条数，用分页拿不到total -->
			<button :disabled="offset == 0" class="btn flex-center trainsition" @click="prev">
				上一页
			</button>
			<button :disabled="!hasmore" class="btn flex-center trainsition" @click="next">
				下一页
			</button>
		</div>
	</div>
</template>
<script>
	import {createVideo} from '@/model/song'
	import Videolist from '@/components/contents/videolist'
	export default {
		name: 'videos',
		data() {
			return {
				// 当前类别
				currenttag: '全部',
				// 当前类别id
				currentId: '',
				// 热门类别
				hottags: [],
				// 所有类别
				tags: [],
				// 视频列表
				videos: [],
				// 偏移
				offset: 0,
				// 是否还有更多
				hasmore: true,
				// 是否打开下拉标签
				showFilter: false,
			}
		},
		components: {
			Videolist
		},
		methods: {
			// 展开视频标签
			openFilter() {
				this.showFilter = !this.showFilter
			},
			// 下一页
			next() {
				this.offset += 1
				if (this.currentId) {
					this.getVideoOther(this.currentId)
				} else {
					this.getVideoAll()
				}
			},
			// 上一页
			prev() {
				this.offset -= 1
				if (this.currentId) {
					this.getVideoOther(this.currentId)
				} else {
					this.getVideoAll()
				}
			},
			// 获取视频热门类别
			async getVideoCategory() {
				try {
					let res = await this.$api.get(`/video/category/list`)
					if (res.code === 200) {
						// console.log(res)
						let list = res.data.filter(item => {
							// 过滤掉mv标签
							return item.id !== 1000
						})
						this.hottags = list
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取所有视频类别标签
			async getVideoTag() {
				try {
					let res = await this.$api.get(`video/group/list`)
					if (res.code === 200) {
						// console.log(res)
						let list = res.data.filter(item => {
							return item.id !== 1000
						})
						this.tags = list
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取全部视频列表
			async getVideoAll() {
				try {
					let res = await this.$api.get(`/video/timeline/all?offset=${this.offset}`)
					if (res.code === 200) {
						// console.log(res)
						this.videos = this.normalizeVideos(res.datas)
						// 是否还有数据
						if (res.hasmore) {
							this.hasmore = true
						} else {
							this.hasmore = false
						}
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取视频标签/分类下的视频
			async getVideoOther(id) {
				try {
					let res = await this.$api.get(`/video/group?id=${id}&offset=${this.offset}`)
					if (res.code === 200) {
						this.videos = this.normalizeVideos(res.datas)
						if (res.hasmore) {
							this.hasmore = true
						} else {
							this.hasmore = false
						}
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 处理视频
			normalizeVideos(list) {
				let ret = []
				list.map(item => {
					let res = item.data
					let liveRes = item.data.liveData || null
					// 如果没有vid则是直播
					if (res.vid) {
						ret.push(
							createVideo({
								id: res.vid,
								nickName: res.creator.nickname,
								name: res.title,
								playCount: res.playTime,
								duration: res.durationms,
								image: res.coverUrl,
							})
						)
					} else {
						ret.push(
							createVideo({
								id: liveRes.liveRoom.liveRoomNo,
								nickName: liveRes.liveUser.nickName,
								name: liveRes.liveRoom.title,
								playCount: liveRes.liveRoom.popularity,
								duration: liveRes.liveRoom.liveStatus == 1 ? '正在直播' : '直播已关闭',
								image: liveRes.liveRoom.coverUrl,
								isLive: true
							})
						)
					}
				})
				return ret
			},
			// 选择分类
			choosetag(id, name) {
				this.$message.info('请稍后~')
				this.offset = 0
				this.hasmore = true
				this.currenttag = name
				if (id) {
					this.currentId = id
					this.getVideoOther(id)
				} else {
					this.getVideoAll()
				}
			}
		},
		mounted() {
			this.getVideoCategory()
			this.getVideoTag()
			this.getVideoAll()
		}
	}
</script>

<style scoped>
	ul {
		list-style: none;
		margin-bottom: 0;
		padding-left: 0;
	}

	p {
		margin-bottom: 0;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.videobox .filter {
		width: 80%;
		height: 40px;
		margin-top: 30px;
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		padding-right: 20px;
		margin-left: 2rem;
		border-radius: 5px 0px 5px 5px;
	}

	.videobox .filter .title {
		width: auto;
		height: 100%;
		padding: 0 5px 0 15px;
		background: #fa2800;
		border-radius: 5px 0px 5px 5px;
		color: #fff;
		cursor: pointer;
		position: relative;
		margin-right: 15px;
		position: relative;
	}

	.videobox .filter .title::after {
		content: '';
		width: 1px;
		height: 20px;
		margin-left: 12px;
		background: #e7e7e7;
		opacity: 0;
	}

	.videobox .filter .title>i {
		transform: rotate(-90deg);
		margin-left: 10px;
		font-size: 18px;
	}

	.videobox .filter .title .filter-box {
		width: 720px;
		height: 400px;
		overflow-y: scroll;
		background: #fff;
		border-radius: 5px;
		color: #000;
		position: absolute;
		right: -631px;
		top: 50px;
		z-index: 100;
		padding: 15px 10px 0 16px;
	}

	.filter-box::-webkit-scrollbar {
		width: 0;
		height: 4px;
	}

	.filter-box::-webkit-scrollbar-track {
		border-radius: 3px;
		background: rgba(135, 245, 255, 0.2);
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 255, 0.18);
	}

	.filter-box::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: linear-gradient(45deg, #66e3ff, #6dcaf4, #66e3ff);
		-webkit-box-shadow: inset 0 0 10px rgba(78, 255, 0, 0.2);
	}

	.videobox .filter .title .filter-box ul {
		display: flex;
		flex-wrap: wrap;
	}

	.videobox .filter .title .filter-box ul li {
		padding: 8px 18px;
		background: #f7f7f7;
		border-radius: 16px;
		margin: 0 10px 10px 0;
		cursor: pointer;
		font-size: 12px;
		color: #161e27;
		transition: all 0.4s;
	}

	.videobox .filter .title .filter-box ul li:hover {
		color: #fff;
		background: #fa2800;
	}

	.videobox .filter .title .filter-box ul li.active {
		color: #fff;
		background: #fa2800;
	}

	.videobox .filter .hot-tag {
		flex: 1;
	}

	.videobox .filter .hot-tag ul li {
		margin: 0 5px;
		padding-right: 10px;
		cursor: pointer;
	}

	.videobox .filter .hot-tag ul li:hover {
		color: #888;
	}

	.videobox .filter .hot-tag ul li.active {
		color: #fa2800;
	}

	.videobox .filter .all {
		background: #f7f7f7;
		color: #161e27;
		padding: 5px 10px;
		font-size: 12px;
		border-radius: 3px;
		transition: all 0.4s;
		cursor: pointer;
	}

	.videobox .filter .all.active {
		background: #fa2800;
		color: #fff;
	}

	.videobox .page .btn {
		padding: 7px 10px;
		border-radius: 3px;
		background: #fa2800;
		color: #fff;
		margin: 0 10px;
		cursor: pointer;
		border: 0;
	}

	.videobox .page .btn.active {
		background: #fa2800;
		color: #fff;
	}

	.videobox .page .btn:hover {
		background: #fa2800;
		color: #fab6b6;
	}

	.videobox .page .btn:disabled {
		color: #fff;
		background-color: #fab6b6;
		border-color: #fab6b6;
	}

	.videobox .bottom-action {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		margin-top: -3rem;
	}

	@media screen and (max-width: 992px) {
		.hot-tag {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow-x: scroll;
		}

		.videobox .filter .title .filter-box {
			width: 570px;
			right: -481px;
		}
	}

	@media screen and (max-width: 768px) {
		.videobox .filter .title .filter-box {
			width: 440px;
			right: -351px;
		}
	}

	@media screen and (max-width: 491px) {
		.videobox .filter .title .filter-box {
			width: 380px;
			right: -291px;
		}
	}

	@media screen and (max-width: 431px) {
		.videobox .filter .title .filter-box {
			width: 340px;
			right: -251px;
		}
	}

	@media screen and (max-width: 391px) {
		.videobox .filter .title .filter-box {
			width: 300px;
			right: -208px;
		}
	}

	@media screen and (max-width: 351px) {
		.videobox .filter .title .filter-box {
			width: 280px;
			right: -181px;
		}
	}
</style>
