<template>
<<<<<<< HEAD
	<div class="songlist" v-if="songlist">
		<!-- highlight-current-row高亮显示选中行 -->
		<div class="playall">
			<div class="playallitem" :class="!(subscribed=='djtc')?'collplayall':''" @click="playAllsong(songlist)">
				<i class="iconfont dj-icon-zanting"></i> 播放全部
			</div>
			<div v-if="!(subscribed=='djtc')" :class="subscribed?'collected':'collectitem'" @click="collect()">
				<i class="iconfont" :class="subscribed?'dj-icon-yishoucang':'dj-icon-weishoucang'"></i> {{collectText}}
			</div>
		</div>
		<el-table :data="songlist" style="width: 95%;margin:0 auto">
			<!-- 序号 -->
			<el-table-column type="index" label="序号" width="60px" align="center"> </el-table-column>
			<!-- 歌名 -->
			<el-table-column :show-overflow-tooltip="true" label="歌曲" :width="width1" align="left"
				header-align="center">
				<template slot-scope="scope">
					<!-- <img :src="scope.row.image" style="height: 50px;width: 50px;"/> -->
					<!-- 懒加载 -->
					<el-image :key="scope.row.image" :src="scope.row.image"
						style="height: 50px;width: 50px;vertical-align: middle;" lazy>
						<div slot="placeholder" class="image-slot flex-center flex-column">
							<i class="el-icon-loading"></i>
						</div>
						<div slot="error" class="image-slot flex-center">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
					<span style="margin-left: 10%;cursor: pointer;"
						@click="playSong(scope,songlist)">{{scope.row.name}}</span>
					<i class="iconfont dj-icon-zanting" style="cursor: pointer; margin-left: 3%;"
						@click="playSong(scope,songlist)" title="播放"></i>
					<i class="iconfont dj-icon-bofangmv" style="cursor: pointer; margin-left: 3%;"
						v-if="scope.row.mv!=''" @click="toDetail(scope.row.mv)" title="MV"></i>
					<i class="iconfont dj-icon-huiyuan" style="cursor: pointer; margin-left: 3%;color: #fbcc21;"
						v-if="scope.row.fee==1" title="会员"></i>
				</template>
			</el-table-column>
			<!-- 歌手 -->
			<el-table-column :show-overflow-tooltip="true" prop="singer" label="歌手" :width="width2" align="center">
			</el-table-column>
			<!-- 专辑 -->
			<el-table-column prop="album" :show-overflow-tooltip="true" label="专辑" :width="width3" align="center">
			</el-table-column>
			<!-- 时长 -->
			<el-table-column prop="duration" label="时间" align="center">
				<template slot-scope="scope">
					<!-- 秒转00:00 -->
					{{ handle.SecondTime(scope.row.duration) }}
				</template>
			</el-table-column>
=======
	<div class="songlist">
		<el-table :data="songlist" style="width: 100%" @row-click="playSong" stripe>
			<el-table-column type="index" label=" " width="50px"> </el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="name" label="音乐标题" width="280px">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="artists[0].name" label="歌手" width="236px">
			</el-table-column>
			<el-table-column prop="album.name" :show-overflow-tooltip="true" label="专辑" width="214px">
			</el-table-column>
			<el-table-column prop="duration" label="时长">
				<template slot-scope="scope">
					{{ scope.row.duration | timeFormatFilter }}
				</template>
			</el-table-column>
			<el-table-column label="操作"> </el-table-column>
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
		</el-table>
	</div>
</template>

<script>
<<<<<<< HEAD
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
=======
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	export default {
		name: 'songlist',
		props: {
			songlist: {
				type: Array
			},
<<<<<<< HEAD
			width1: {
				type: Number
			},
			width2: {
				type: Number
			},
			width3: {
				type: Number
			},
			subscribed: {
				type: [Boolean,String],
				default: 'djtc'
			}
		},
		computed: {
			...mapGetters([
				'currentSong'
			]),
			collectText() {
				return this.subscribed ? '已收藏' : '收藏'
			}
		},
		watch: {
			// 正在播放的选中样式在搜索其他歌曲时清除
			// 切换其他页后切回判断对应歌曲渲染
			songlist(newsong) {
				// 改变DOM数据后延迟执行的回调,解决执行过快dom还没还没生成，找不到对应dom导致渲染不上和报错TypeError: Cannot read property 'id' of undefined"
				this.$nextTick(() => {
					let indexs = 999
					newsong.map((item, index) => {
						if (this.currentSong.id == item.id) {
							// console.log('在这相等',index)
							indexs = index
						}
					})

					let tr = document.getElementsByTagName('tbody')[0].childNodes
					for (let i = 0, trs = tr.length; i < trs; i++) {
						if (i == indexs) {
							tr[i].className += ' isplay'
						} else {
							tr[i].className = 'el-table__row'
						}
					}
				})
			},
			// 上一首下一首切换时对应的渲染
			currentSong(newsong) {
				// console.log(newsong)
				this.$nextTick(() => {
					let indexs = 999
					this.songlist.map((item, index) => {
						if (newsong.id == item.id) {
							indexs = index
						}
					})

					let tr = document.getElementsByTagName('tbody')[0].childNodes
					for (let i = 0, trs = tr.length; i < trs; i++) {
						if (i == indexs) {
							tr[i].className += ' isplay'
						} else {
							tr[i].className = 'el-table__row'
						}
					}
				})
			},
		},
		methods: {
			// 播放歌曲
			playSong(scope, list) {
				// 渲染选中
				let tr = document.getElementsByTagName('tbody')[0].childNodes
				let index = scope.$index
				for (let i = 0, trs = tr.length; i < trs; i++) {
					if (i == index) {
						tr[i].className += ' isplay'
					} else {
						tr[i].className = 'el-table__row'
					}
				}
				// console.log(index)
				// console.log(scope)
				// console.log(songlist)
				let loginstate = JSON.parse(window.localStorage.getItem('loginStatu'))
				if (loginstate == null || false) {
					if (scope.row.fee == 1) {
						this.$message.warning('此歌曲非会员只能试听哦~')
					}
				}
				let id = scope.row.id
				let timestamp = new Date().getTime()
				this.$api.get(`/check/music?id=${id}&timestamp=${timestamp}`).then(res=>{
					if(res.success) {
						this.$api.get(`/song/url?id=${id}`).then(res => {
							// console.log(res)
							if (res.code == 200) {
								list[index].url = res.data[0].url
								this.selectPlay({
									list,
									index
								})
							}
						}).catch(err => {
							this.$message.error('播放错误，请稍后重试')
							console.log(err)
							for (let i = 0, trs = tr.length; i < trs; i++) {
								tr[i].className = 'el-table__row'
							}
						})
					} else {
						this.$message.warning('亲爱的,暂无版权~')
						for (let i = 0, trs = tr.length; i < trs; i++) {
							tr[i].className = 'el-table__row'
						}
					}
					
				}).catch(err=>{
					console.log(err)
					this.$message.warning('亲爱的,暂无版权~')
					for (let i = 0, trs = tr.length; i < trs; i++) {
						tr[i].className = 'el-table__row'
					}
				})
			},
			// 播放全部歌曲
			playAllsong(list) {
				this.playAll(list)
			},
			// 视频详情
			toDetail(id) {
				// 播放视频暂停播放
				this.upplaYing(false)
				// mv
				this.$router.push({
					name: 'mvdetail',
					query: {
						id
					}
=======
			songCounts: {
				type: Number
			},

		},
		methods: {
			// 播放歌曲
			playSong(item, index) {
				this.selectPlay({
					list: this.songs,
					index
				})
			},
			// 停止播放歌曲
			pauseSong() {
				this.pausePlay()
			},
			// 播放全部
			playAllSong() {
				this.playAll({
					list: this.songs
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
				})
			},
			// 收藏歌单
			async collect() {
<<<<<<< HEAD
				this.$emit('collect')
			},
			...mapMutations([
				'upplaYing',
			]),
			...mapActions([
				// 点击选择播放
				'selectPlay',
				// 播放全部
				'playAll'
			])
=======
				this.$emit('collectArtist')
			},
			// 分页跳转,向父组件传递参数page为当前页数
			pageChange(page) {
				this.$emit("pageChange", page);
			},
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
		},
	}
</script>

<style scoped>
<<<<<<< HEAD
	.songlist {
		margin: 0 auto;
	}

	.songlist .el-table {
		opacity: .7;
	}

	.el-table {
		color: #000;
	}

	.playall {
		width: 100%;
		height: 50px;
		margin: 0 auto;
		position: relative;
	}

	.playall .playallitem {
		position: absolute;
		right: 0;
		bottom: 15px;
		background: #FA2800;
		border-radius: 50px;
		padding: 5px 10px;
		cursor: pointer;

	}
	.playall .collplayall {
		right: 110px;
	}

	/* 未收藏 */
	.playall .collectitem {
		position: absolute;
		right: 0;
		bottom: 15px;
		background: #ccc;
		border-radius: 50px;
		padding: 5px 10px;
		cursor: pointer;
	}

	.playall .collectitem i {
		color: #000;
	}

	/* 已收藏 */
	.playall .collected {
		position: absolute;
		right: 0;
		bottom: 15px;
		background: #FA2800;
		border-radius: 50px;
		padding: 5px 10px;
		cursor: pointer;
		color: #f4f4f4;
	}

	.playall .collected i {
		color: #f4f4f4;
	}

	.playallitem,
	.playall i {
		color: #f4f4f4;
	}

	.playall:hover .playallitem,
	.playall i {
		color: #fff;
	}
=======
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
</style>
