<template>
	<div class="lyricbox">
		<ul>
			<li v-for="(item,index) in lyricarray" :key="index" :class="index==lyricindex?'current':index==lyricindex+1?'next':''"> {{item[1]}}</li>
		</ul>
	</div>
</template>

<script>
	import {
		parseLyric
	} from '@/model/parselyric'
	export default {
		name: 'lyric',
		data() {
			return {
				//转换后的歌词数组
				lyricarray: [],
				// 当前歌词下标
				lyricindex: 0,
				// 歌词的最后一行的时间
				lasttime: 999,
			}
		},
		mounted(){
			// 设置默认值
			this.lyricarray = [[0,'暂无歌词']]
		},
		props: {
			// 歌词信息
			lyriclist: {
				type: String,
				default: '暂无歌词'
			},
			// 当前时间
			currenttime: {
				type: Number,
				default: 0
			},
			// 当前歌曲
			currentSong: {
				type: Object
			},
		},
		watch: {
			// 监听当前歌曲
			currentSong() {
				this.lyricarray = [[0,'暂无歌词']]
			},
			lyriclist() {
				// 格式化歌词
				this.lyricarray = parseLyric(this.lyriclist);
				if(this.lyricarray.length==0){
					this.lyricarray = [[0,'暂无歌词']]
				}else{
					// 将空数据去除
					this.lyricarray.map((item,index)=>{
						if(!item[1]){
							this.lyricarray.splice(index,1)
						}
						if(index==6){
							this.start = item[0]
						}
					})
					this.lasttime = this.lyricarray[this.lyricarray.length-1][0]
				}
			},
			currenttime(current) {
				// console.log(current)
				// 只有一条数据时不操作
				if(!(this.lyricarray.length==1)){
					// 当超过最后一条歌词的时间时不再操作，避免到最后一条时找不到下一行而报错
					if(!(current > this.lasttime)){
						// 歌词对应时间判断
						for (let i = 0; i < this.lyricarray.length; i++) {
							const row = this.lyricarray[i]
							const nextrow = this.lyricarray[i+1]
							// 如果歌曲current大于当前行歌曲时间，下一行不为空且current小于下一行时间
							if(current >= row[0] && row[1] && current < nextrow[0]){
								this.lyricindex = i
							}
						}
					}	
					// 渲染最后一行
					if(current > this.lasttime){
						this.lyricindex = this.lyricarray.length-1
					}
				}
			},
		}
	}
</script>

<style scoped>
	.lyricbox {
		position: relative;
		top: -16px;
	}
	.lyricbox ul li {
		list-style: none;
		font-size: 25px;
		letter-spacing: 5px;
		color: #fff;
		text-align: right;
		text-shadow: 2px 1px rgb(0 0 0 / 70%);
		position: absolute;
		top: 100px;
	}
	/* 当前歌词 */
	.lyricbox .current {
		font-size: 30px;
		color: #49ff17;
		text-shadow: 1px 1px rgb(0 0 0 / 70%);
		text-align: left;
		position: absolute;
		top: 0;
	}
	/* 当前歌词的下一句 */
	.lyricbox .next{
		position: absolute;
		top: 44.8px;
		right: 0;
	}
</style>
