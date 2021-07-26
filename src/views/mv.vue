<template>
	<div class="mvbox">
		<!-- 标签 -->
		<div class="filter">
			<ul class="tag-lang">
				<li v-for="item of areaList" :key="item.value" :class="area == item.value ? 'active' : ''"
					@click="chooseType('area', item.value)">
					{{ item.label }}
				</li>
			</ul>
			<ul class="tag-lang tag-type">
				<li v-for="item of classifys" :key="item.value" :class="classify == item.value ? 'active' : ''"
					@click="chooseType('classify', item.value)">
					{{ item.label }}
				</li>
			</ul>
			<ul class="tag-lang">
				<li v-for="item of sortList" :key="item.value" :class="sort == item.value ? 'active' : ''"
					@click="chooseType('sort', item.value)">
					{{ item.label }}
				</li>
			</ul>
		</div>
		<!-- mv列表 -->
		<More @scroll-state="load">
			<Videolist :videos="mvs" :isVideo="false"/>
		</More>
		<!-- 加载更多动画 -->
		<div v-if="loading" class="load-bottom">
			<Loading />
		</div>
	</div>
</template>
<script>
	import { createVideo } from '@/model/song'
	import More from '@/components/contents/more'
	import Loading from '@/components/contents/loading'
	import Videolist from '@/components/contents/videolist'
	export default {
		name: 'mvs',
		data() {
			return {
				// 地区
				area: '全部',
				areaList: [{
						value: '全部',
						label: '全部'
					},
					{
						value: '内地',
						label: '内地'
					},
					{
						value: '港台',
						label: '港台'
					},
					{
						value: '欧美',
						label: '欧美'
					},
					{
						value: '日本',
						label: '日本'
					},
					{
						value: '韩国',
						label: '韩国'
					}
				],
				// 分类
				classify: '全部',
				classifys: [{
						value: '全部',
						label: '全部'
					},
					{
						value: '官方版',
						label: '官方版'
					},
					{
						value: '原生',
						label: '原生'
					},
					{
						value: '现场版',
						label: '现场版'
					},
					{
						value: '网易出品',
						label: '网易出品'
					}
				],
				// 排序
				sort: '上升最快',
				sortList: [{
						value: '上升最快',
						label: '上升'
					},
					{
						value: '最热',
						label: '最热'
					},
					{
						value: '最新',
						label: '最新'
					}
				],
				// 请求参数
				params: {
					// 返回数量
					limit: 30,
					// 偏移数量
					offset: 0,
					// 分类
					type: '全部',
					// 语种
					area: '全部',
					order: '上升最快'
				},
				mvs: [],
				// 是否显示加载动画
				loading: false,
				// 是否还有数据
				loadStatus: true
			}
		},
		components: {
			Loading,
			Videolist,
			More
		},
		mounted() {
			this.getMvAll()
		},
		methods: {
			// 选择分类
			chooseType(type, val) {
				this.$message.info('请稍后~')
				if (type == 'area') {
					this.area = val
					this.params.area = val
				} else if (type == 'classify') {
					this.classify = val
					this.params.type = val
				} else if (type == 'sort') {
					this.sort = val
					this.params.order = val
				}
				this.params.offset = 0
				this.loadStatus = true
				// 重新置空
				this.mvs = []
				this.getMvAll()
			},
			// 获取mv列表
			async getMvAll() {
				try {
					this.loadStatus = false
					let props = this.params
					let res = await this.$api.get(`/mv/all`,{params: props})
					if (res.code === 200) {
						// console.log(res)
						// 拼接数据
						this.mvs = this.mvs.concat(this.normalizeVideos(res.data))
						// 是否还有更多
						if (res.hasMore) {
							this.loading = true
							this.loadStatus = true
							this.params.offset += 30
						} else {
							this.loading = false
						}
					}
				} catch (error) {
					this.$message.error(error)
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
								image: item.cover
							})
						)
					}
				})
				return ret
			},
			// 加载更多
			load() {
				if (this.loadStatus) {
					setTimeout(() => {
						this.getMvAll()
					}, 500)
				}
			}
		},
	}
</script>

<style scoped>
	ul {
		list-style: none;
	}

	.mvbox li:hover {
		color: #fa2800;
		transition: all 0.4s;
	}

	.mvbox .tag-en {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
	}

	.mvbox .tag-en li {
		width: 56px;
		height: 28px;
		margin-right: 14px;
		text-align: center;
		line-height: 29px;
		border-radius: 50%;
		font-size: 13px;
		color: #333;
		cursor: pointer;
	}

	.mvbox .tag-en li:first-child,
	.mvbox .tag-en li.last-child {
		width: 56px;
		border-radius: 14px;
	}

	.mvbox .tag-en li.active {
		background: #fa2800;
		;
		font-weight: 700;
		color: #fff;
	}

	.mvbox .tag-en li:hover {
		color: #fa2800;
		;
		transition: all 0.4s;
	}

	.mvbox .tag-lang {
		display: flex;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.mvbox .tag-lang li {
		width: 56px;
		height: 28px;
		color: #4e6f8f;
		line-height: 29px;
		font-size: 13px;
		text-align: center;
		border-radius: 14px;
		cursor: pointer;
		margin-right: 6px;
	}

	.mvbox .tag-lang li.active {
		background: #fa2800;
		font-weight: 700;
		color: #fff;
	}

	.mvbox .tag-type li {
		width: auto;
		padding: 0 15px;
	}

	.mvbox .singer-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 30px;
		margin: 30px -15px 0;
	}
	@media screen and (max-width: 425px) {
		.mvbox .tag-lang li {
			width: 52px;
		}
		.mvbox .tag-type li {
			padding: 0;
		}
	}
	@media screen and (max-width: 331px) {
		ul{
			padding-left: 0!important;
		}
	}
</style>
