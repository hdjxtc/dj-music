<template>
	<div class="songlist">
		<el-table :data="songlist" style="width: 95%;margin:0 auto" highlight-current-row>
			<el-table-column type="index" label="序号" width="60px" align="center"> </el-table-column>
			<el-table-column :show-overflow-tooltip="true" label="歌曲" width="400px" align="left" header-align="center">
				<template slot-scope="scope">
					<img :src="scope.row.image" style="height: 50px;width: 50px;" />
					<span style="margin-left: 10%;">{{scope.row.name}}</span>
					<i class="el-icon-video-play" style="cursor: pointer; margin-left: 3%;" @click="playSong(scope.row.url)"></i>
					<i class="el-icon-video-camera" style="cursor: pointer; margin-left: 3%;" v-if="scope.row.mv!==0" :mvid="scope.row.mv" @click="playMv(scope.row.mv)"></i>
				</template>
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="singer" label="歌手" width="300px"
				align="center">
			</el-table-column>
			<el-table-column prop="album" :show-overflow-tooltip="true" label="专辑" width="300px" align="center">
			</el-table-column>
			<el-table-column prop="duration" label="时间" align="center">
				<template slot-scope="scope">
					<!-- 秒转00:00 -->
					{{ handle.SecondTime(scope.row.duration) }}
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		name: 'songlist',
		props: {
			songlist: {
				type: Array
			}
		},
		methods: {
			// 播放歌曲
			playSong(url) {
				this.$message.success(url)
			},
			// 停止播放歌曲
			pauseSong() {
				this.pausePlay()
			},
			// 播放全部
			playAllSong() {
				this.playAll({
					list: this.songs
				})
			},
			// 收藏歌单
			async collect() {
				this.$emit('collectArtist')
			},
			// 分页跳转,向父组件传递参数page为当前页数
			pageChange(page) {
				this.$emit("pageChange", page);
			},
			// 播放mv
			async playMv(id){
				await this.$api.get(`/mv/url?id=${id}`).then(res=>{
					this.$message.success(res.data.url)
				}).catch(err=>{
					this.$message.error(err)
				})
			}
		},
	}
</script>

<style scoped>
	.songlist {
		margin: 0 auto;
		opacity: .7;
	}

	.el-table {
		color: #000;
	}
</style>
