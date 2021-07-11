<template>
	<div class="songlist">
		<!-- highlight-current-row高亮显示选中行 -->
		<el-table :data="songlist" style="width: 95%;margin:0 auto">
			<el-table-column type="index" label="序号" width="60px" align="center"> </el-table-column>
			<el-table-column :show-overflow-tooltip="true" label="歌曲" width="400px" align="left" header-align="center">
				<template slot-scope="scope">
					<img :src="scope.row.image" style="height: 50px;width: 50px;" />
					<span style="margin-left: 10%;">{{scope.row.name}}</span>
					<i class="iconfont dj-icon-zanting" style="cursor: pointer; margin-left: 3%;"
						@click="playSong(scope,songlist)" title="播放"></i>
					<i class="iconfont dj-icon-bofangMV" style="cursor: pointer; margin-left: 3%;"
						v-if="scope.row.mv!==0" @click="playMv(scope.row.mv)" title="MV"></i>
				</template>
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="singer" label="歌手" width="300px" align="center">
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
	import { mapActions } from 'vuex'
	export default {
		name: 'songlist',
		props: {
			songlist: {
				type: Array
			}
		},
		watch: {
			// 正在播放的选中样式在搜索其他歌曲时清除
			songlist(){
				let tr = document.getElementsByTagName('tbody')[0].childNodes
				for (let i = 0, trs = tr.length; i < trs; i++) {
					tr[i].className = 'el-table__row'
				}
			}
		},
		methods: {
			// 播放歌曲
			playSong(scope,list) {
				// 渲染选中
				// console.log(scope)
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
				let id = scope.row.id
				this.$api.get(`/song/url?id=${id}`).then(res=>{
					// console.log('nes',res.data[0].url)
					list[index].url = res.data[0].url
					// this.$message.success(res.data[0].url)
					this.selectPlay({list,index})
				})
			},
			// 播放mv
			async playMv(id) {
				await this.$api.get(`/mv/url?id=${id}`).then(res => {
					this.$message.success(res.data.url)
				}).catch(err => {
					this.$message.error(err)
				})
			},
			...mapActions([
				// 点击选择播放
				'selectPlay',
			])
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
