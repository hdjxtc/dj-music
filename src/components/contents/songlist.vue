<template>
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
		</el-table>
	</div>
</template>

<script>
	export default {
		name: 'songlist',
		props: {
			songlist: {
				type: Array
			},
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
		},
	}
</script>

<style scoped>
</style>
