<template>
	<div class="playbox">
		<div class="filter shadow">
			<!-- 下拉标签 -->
			<div class="title flex-center" @click="openFilter">
				{{ currenttag }}
				<i class="el-icon-arrow-down" :style="showFilter?'transform: rotate(0)':''"></i>
				<transition name="fade">
					<div class="filter-box shadow" v-if="showFilter">
						<div class="item" v-for="item of cateList" :key="item.key">
							<h2>
								<i class="iconfont" :class="item.icon"></i>{{ item.type }}
							</h2>
							<ul>
								<li :class="currenttag == sub.name ? 'active' : ''" v-for="sub of item.list"
									:key="sub.name" @click="chooseCat(sub.name)">
									{{ sub.name }}
								</li>
							</ul>
						</div>
					</div>
				</transition>
			</div>
			<!-- 热门标签 -->
			<div class="hot-tag flex-row">
				<p>热门标签：</p>
				<ul class="flex-center">
					<li v-for="item of hotCategories" :key="item.id" :class="currenttag == item.name ? 'active' : ''"
						@click="chooseCat(item.name)">
						{{ item.name }}
					</li>
				</ul>
			</div>
			<div class="type">
				<div class="item" :class="currenttag == '全部' ? 'active' : ''" @click="chooseCat('全部')">
					全部
				</div>
			</div>
		</div>
		<!-- 歌单列表 -->
		<Gedanlist :playList="playList" v-loading="loading" />
		<Feny :total="pageTotal" @pageChange="pageChange"/>
	</div>
</template>
<script>
	import Gedanlist from '@/components/contents/gedanlist'
	import Feny from '@/components/contents/feny'
	export default {
		data() {
			return {
				// 当前类别
				currenttag: '全部',
				// 热门类别
				hotCategories: [],
				// 所有类别
				cateList: [],
				// 歌单列表
				playList: [],
				// 总条数
				pageTotal: 0,
				// 是否打开下拉菜单
				showFilter: false,
				// 获取数量
				limit: 30,
				// 偏移量
				offset: 0,
				// 加载动画
				loading: false,
				// 类别标题
				typeList: [{
						key: 0,
						value: '语种',
						icon: 'dj-icon-yuyan'
					},
					{
						key: 1,
						value: '风格',
						icon: 'dj-icon-changjing'
					},
					{
						key: 2,
						value: '场景',
						icon: 'dj-icon-yundong'
					},
					{
						key: 3,
						value: '情感',
						icon: 'dj-icon-qinggan'
					},
					{
						key: 4,
						value: '主题',
						icon: 'dj-icon-zhuti'
					}
				],
			}
		},
		components: {
			Gedanlist,
			Feny
		},
		methods: {
			// 分页跳转
			pageChange(page) {
				this.offset = (page - 1) * this.limit;
				this.getPlayList()
			},
			// 打开下拉标签
			openFilter() {
				this.showFilter = !this.showFilter
			},
			// 选择分类
			chooseCat(cat) {
				this.currenttag = cat
				// 将请求标签更改后重新请求数据
				this.getPlayList()
			},
			// 获取歌单分类
			async getCatList() {
				try {
					let res = await this.$api.get(`/playlist/catlist`)
					if (res.code === 200) {
						// 类别
						this.categories = res.categories
						// console.log(res)
						this.cateList = this.categoryGroup(res.sub, 'category')
						// console.log(this.cateList)
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 根据分类进行分组
			categoryGroup(list, field) {
				var obj = {}
				for (var i = 0; i < list.length; i++) {
					for (let item in list[i]) {
						// 拿出category值
						if (item == field) {
							// 拿出类别做成键
							obj[list[i][item]] = {
								// 判断是否存在，赋初值
								list: obj[list[i][item]] ? obj[list[i][item]].list : [],
							}
						}
					}
					// 添加对应的类别到一组
					obj[list[i][field]].list.push(list[i])
					// console.log(obj)
				}
				var att = []
				// 添加对应类别标题和icon
				for (let item in obj) {
					let type = ''
					let category = ''
					let icon = ''
					this.typeList.map(jitem => {
						// console.log(jitem)
						// 将标题、icon、list拼接添加到新数组中
						if (jitem.key == obj[item].list[0].category) {
							type = jitem.value
							category = jitem.key
							icon = jitem.icon
						}
					})
					att.push({
						type,
						category,
						icon,
						list: obj[item].list
					})
					// console.log(att)
				}
				return att
			},
			// 获取热门歌单分类
			async getHotlist() {
				try {
					let res = await this.$api.get(`/playlist/hot`)
					if (res.code === 200) {
						this.hotCategories = res.tags
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 获取歌单列表 默认全部
			async getPlayList() {
				// 开启动画
				this.loading = true
				let params = {
					cat: this.currenttag,
					limit: this.limit,
					offset: this.offset
				}
				try {
					let res = await this.$api.get(`/top/playlist`,{params: params})
					if (res.code === 200) {
						this.playList = res.playlists
						this.pageTotal = res.total
						this.loading = false
					}
					// console.log(res)
				} catch (error) {
					console.log(error)
				}
			},
		},
		mounted() {
			// 判断是不是点击歌单详情页的标签跳转的
			let cat = this.$route.query.cat
			// console.log(cat)
			if (cat) {
				this.currenttag = cat
			}
			this.getHotlist()
			this.getCatList()
			this.getPlayList()
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
	.playbox .filter {
		width: 80%;
		height: 40px;
		display: flex;
		align-items: center;
		margin-top: 30px;
		margin-bottom: 20px;
		padding-right: 20px;
		margin-left: 3rem;
		border-radius: 5px 0px 5px 5px;
	}

	.playbox .filter .title {
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

	.playbox .filter .title::after {
		content: '';
		width: 1px;
		height: 20px;
		margin-left: 12px;
		background: #e7e7e7;
		opacity: 0;
	}

	.playbox .filter .title>i {
		transform: rotate(-90deg);
		margin-left: 10px;
		font-size: 18px;
	}

	.playbox .filter .title .filter-box {
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
	
	.playbox .filter .title .filter-box .item {
		margin-bottom: 20px;
	}

	.playbox .filter .title .filter-box .item h2 {
		display: flex;
		align-items: center;
		font-size: 15px;
		margin-bottom: 15px;
		color: #161e27;
	}

	.playbox .filter .title .filter-box .item h2 i {
		font-size: 18px;
		margin-right: 5px;
		margin-top: -1px;
	}

	.playbox .filter .title .filter-box .item ul {
		display: flex;
		flex-wrap: wrap;
	}

	.playbox .filter .title .filter-box .item ul li {
		padding: 8px 18px;
		background: #f7f7f7;
		border-radius: 16px;
		margin: 0 10px 10px 0;
		cursor: pointer;
		font-size: 12px;
		color: #161e27;
		transition: all 0.4s;
	}

	.playbox .filter .title .filter-box .item ul li:hover {
		color: #fff;
		background: #fa2800;
	}

	.playbox .filter .title .filter-box .item ul li.active {
		color: #fff;
		background: #fa2800;
	}

	.playbox .filter .hot-tag {
		flex: 1;
	}

	.playbox .filter .hot-tag ul li {
		margin: 0 5px;
		padding-right: 10px;
		cursor: pointer;
	}

	.playbox .filter .hot-tag ul li:hover {
		color: #888;
	}

	.playbox .filter .hot-tag ul li.active {
		color: #fa2800;
	}

	.playbox .filter .type {
		display: flex;
	}

	.playbox .filter .type .item {
		margin-left: 20px;
		background: #f7f7f7;
		color: #161e27;
		padding: 5px 10px;
		font-size: 12px;
		border-radius: 3px;
		transition: all 0.4s;
		cursor: pointer;
	}

	.playbox .filter .type .item.active {
		background: #fa2800;
		color: #fff;
	}

	.playbox .filter .type .item.active:hover {
		color: #fff;
	}

	.playbox .filter .type .item:hover {
		color: #666;
	}
	@media screen and (max-width: 992px) {
		.hot-tag {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow-x: scroll;
		}
	
		.playbox .filter .title .filter-box {
			width: 570px;
			right: -481px;
		}
	}
	
	@media screen and (max-width: 768px) {
		.playbox .filter .title .filter-box {
			width: 440px;
			right: -351px;
		}
	}
	
	@media screen and (max-width: 501px) {
		.playbox .filter .title .filter-box {
			width: 380px;
			right: -291px;
		}
	}
	
	@media screen and (max-width: 451px) {
		.playbox .filter .title .filter-box {
			width: 340px;
			right: -251px;
		}
	}
	
	@media screen and (max-width: 401px) {
		.playbox .filter .title .filter-box {
			width: 300px;
			right: -208px;
		}
	}
	
	@media screen and (max-width: 361px) {
		.playbox .filter .title .filter-box {
			width: 280px;
			right: -181px;
		}
	}
	@media screen and (max-width: 331px) {
		.playbox .filter .title .filter-box {
			width: 250px;
			right: -151px;
		}
	}
</style>
