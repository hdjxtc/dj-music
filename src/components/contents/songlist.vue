<template>
	<div class="songlist" v-if="songlist">
		<!-- highlight-current-row高亮显示选中行 -->
		<el-table :data="songlist" style="width: 95%;margin:0 auto">
			<el-table-column type="index" label="序号" width="60px" align="center"> </el-table-column>
			<el-table-column :show-overflow-tooltip="true" label="歌曲" :width="width1" align="left" header-align="center">
				<template slot-scope="scope">
					<!-- <img :src="scope.row.image" style="height: 50px;width: 50px;"/> -->
					<!-- 懒加载 -->
					<el-image :key="scope.row.image" :src="scope.row.image" style="height: 50px;width: 50px;vertical-align: middle;" lazy>
						<div slot="placeholder" class="image-slot flex-center flex-column">
							<i class="el-icon-loading"></i>
						</div>
						<div slot="error" class="image-slot flex-center">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
					<span style="margin-left: 10%;cursor: pointer;" @click="playSong(scope,songlist)">{{scope.row.name}}</span>
					<i class="iconfont dj-icon-zanting" style="cursor: pointer; margin-left: 3%;"
						@click="playSong(scope,songlist)" title="播放"></i>
					<i class="iconfont dj-icon-bofangmv" style="cursor: pointer; margin-left: 3%;"
						v-if="scope.row.mv!==0" @click="toDetail(scope.row.mv)" title="MV"></i>
					<i class="iconfont dj-icon-huiyuan" style="cursor: pointer; margin-left: 3%;color: #fbcc21;"
						v-if="scope.row.fee==1" title="会员"></i>
				</template>
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="singer" label="歌手" :width="width2" align="center">
			</el-table-column>
			<el-table-column prop="album" :show-overflow-tooltip="true" label="专辑" :width="width3" align="center">
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
	import {mapGetters,mapMutations,mapActions} from 'vuex'
	export default {
		name: 'songlist',
		props: {
			songlist: {
				type: Array
			},
			width1: {
				type: Number
			},
			width2: {
				type: Number
			},
			width3: {
				type: Number
			},
		},
		computed:{
			...mapGetters([
				'currentSong'
			])
		},
		watch: {
			// 正在播放的选中样式在搜索其他歌曲时清除
			// 切换其他页后切回判断对应歌曲渲染
			songlist(newsong) {
				// 改变DOM数据后延迟执行的回调,解决执行过快dom还没还没生成，找不到对应dom导致渲染不上和报错TypeError: Cannot read property 'id' of undefined"
				this.$nextTick(() => {
					let indexs = 999
					newsong.map((item,index)=>{
						if(this.currentSong.id==item.id){
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
			currentSong(newsong){
				// console.log(newsong)
				this.$nextTick(() => {
					let indexs = 999
					this.songlist.map((item,index)=>{
						if(newsong.id==item.id){
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
				if(loginstate==null||false){
					if(scope.row.fee==1){
						this.$message.warning('此歌曲非会员只能试听哦~')
					}
				}
				let id = scope.row.id
				this.$api.get(`/song/url?id=${id}`).then(res => {
					// console.log(res)
					if(res.code==200){
						list[index].url = res.data[0].url
						this.selectPlay({
							list,
							index
						})
					}
				}).catch(err=>{
					this.$message.error('播放错误，请稍后重试')
					console.log(err)
					for (let i = 0, trs = tr.length; i < trs; i++) {
						tr[i].className = 'el-table__row'
					}
				})
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
				})
			},
			...mapMutations([
				'upplaYing',
			]),
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
