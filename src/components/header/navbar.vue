<template>
	<div class="navbars">
		<nav class="navbar navbar-light shadow navbar-expand-lg">
			<div class="logo">
				<router-link :to="{name: 'home'}" tag="a"></router-link>
			</div>
			<!-- 搜素推荐 -->
			<div class="searchrecommend" v-if="isshow">
				<!-- <span class="searchclose" @click="isshow = false">关闭<i class="el-icon-switch-button"></i></span> -->
				<div style="clear: both;"></div>
				<div class="title historytitle" v-if="getSearchhistory.length > 0">
					<p>
						<i class="iconfont dj-icon-jiaoyin" title="热门搜索" style="margin-right: 10px;color: #FA2800;"></i>
						历史搜索
					</p>
					<p class="clear" @click="clearSearch">清空</p>
				</div>
				<div class="historylist" v-if="getSearchhistory.length > 0">
					<ul class="history">
						<li class="tags" v-for="(item,index) of getSearchhistory" :key="item">
							<span @click="searchhot(item)" class="historyitem">{{item}}</span>
							<i class="el-icon-close delete" @click="delsearchhistory(index)"></i>
						</li>
					</ul>
				</div>
				<!-- 热门搜索 -->
				<div class="title">
					<i class="iconfont dj-icon-resou" title="热门搜索" style="margin-right: 10px;color: #FA2800;"></i>
					热门搜索
				</div>
				<div class="list" :class="getSearchhistory.length > 0?'ishistory':''">
					<div class="hotlist-row" v-for="(item,index) of hots" :key="index"
						@click="searchhot(item.searchWord)">
						<span class="num">{{index + 1 }}</span>
						<div class="songinfo">
							<p class="ellipsi song">{{item.searchWord}}</p>
							<p class="ellipsi ellipsis">{{item.content}}</p>
						</div>
					</div>
				</div>
			</div>
			<!-- pc -->
			<div class="nav-pc navpc-lg">
				<div class="collapse navbar-collapse">
					<ul class="navbar-nav">
						<li class="nav-item" :class="$route.path=='/home'?'active':''">
							<router-link :to="{ name: 'home' }" tag="a" class="nav-link">发现音乐</router-link>
						</li>
						<li class="nav-item" :class="$route.path=='/ranking'?'active':''">
							<router-link :to="{ name: 'ranking' }" tag="a" class="nav-link">排行榜</router-link>
						</li>
						<li class="nav-item" :class="$route.path=='/playlist'?'active':''">
							<router-link :to="{ name: 'playlist' }" tag="a" class="nav-link">歌单</router-link>
						</li>
						<li class="nav-item" :class="$route.path=='/singer'?'active':''">
							<router-link :to="{ name: 'singer' }" tag="a" class="nav-link">歌手</router-link>
						</li>
						<li class="nav-item" :class="$route.path=='/video'?'active':''">
							<router-link :to="{ name: 'video' }" tag="a" class="nav-link">视频</router-link>
						</li>
						<li class="nav-item" :class="$route.path=='/mv'?'active':''">
							<router-link :to="{ name: 'mv' }" tag="a" class="nav-link">MV</router-link>
						</li>
					</ul>
					<div class="search form-inline search-poss" v-if="loginStatu">
						<input type="search" placeholder="  搜索音乐/视频/歌手/歌单" class="form-control" v-model="keyword"
							@keyup.enter="search()" @focus="isshow = true" @blur="close">
					</div>
					<div class="search form-inline search-pos" v-else>
						<input type="search" placeholder="  搜索音乐/视频/歌手/歌单" class="form-control" v-model="keyword"
							@keyup.enter="search()" @focus="isshow = true" @blur="close">
					</div>
					<div class="userbox">
						<div class="is-login flex-row" v-if="loginStatu">
							<el-avatar class="avatar" :src="userInfo.avatarUrl"></el-avatar>
							<!-- command指令，点击选项时触发对应事件 -->
							<el-dropdown trigger="click" @command="handleCommand">
								<span class="el-dropdown-link">
									{{ userInfo.nickname }}
									<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item icon="el-icon-user" command="personal">
										个人主页
									</el-dropdown-item>
									<el-dropdown-item divided icon="el-icon-switch-button" command="signout">
										退出登录
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
						<div class="login" @click="login" v-else>
							登录
						</div>
					</div>
				</div>
			</div>
			<!-- 移动 -->
			<div class="nav-mb">
				<el-drawer :visible.sync="drawer" direction="rtl" size="70%">
					<div class="titile">
						<span class="line">
							用户
						</span>
					</div>
					<div class="author">
						<!-- 登录后 -->
						<div class="authorimg" v-if="loginStatu">
							<img :src="userInfo.avatarUrl" @click="innerDrawer = true">
						</div>
						<!-- 未登录 -->
						<div class="authorimg" v-else @click="login">
							<el-avatar icon="el-icon-user-solid" :size="70"></el-avatar>
						</div>
						<!-- 登录后 -->
						<div class="authorname" v-if="loginStatu" @click="innerDrawer = true">
							{{userInfo.nickname}}
						</div>
						<!-- 未登录 -->
						<div class="authorname" v-else @click="login">
							登录
						</div>
						<el-drawer :append-to-body="true" :visible.sync="innerDrawer" size="50%">
							<ui class="innerDrawer">
								<li class="nav-link el-icon-user" style="margin-left: 5%" @click="personal">个人主页</li>
								<li class="nav-link el-icon-switch-button" style="margin-left: 5%" @click="signout">退出登录
								</li>
							</ui>
						</el-drawer>
					</div>

					<div class="titile">
						<span class="line">
							目录
						</span>
					</div>
					<ul class="navbar-nav navbar-nav-m">
						<li class="nav-item" @click="drawer = false" :class="$route.path=='/home'?'active':''">
							<router-link :to="{ name: 'home' }" tag="a" class="nav-link">发现音乐</router-link>
						</li>
						<li class="nav-item" @click="drawer = false" :class="$route.path=='/ranking'?'active':''">
							<router-link :to="{ name: 'ranking' }" tag="a" class="nav-link">排行榜</router-link>
						</li>
						<li class="nav-item" @click="drawer = false" :class="$route.path=='/playlist'?'active':''">
							<router-link :to="{ name: 'playlist' }" tag="a" class="nav-link">歌单</router-link>
						</li>
						<li class="nav-item" @click="drawer = false" :class="$route.path=='/singer'?'active':''">
							<router-link :to="{ name: 'singer' }" tag="a" class="nav-link">歌手</router-link>
						</li>
						<li class="nav-item" @click="drawer = false" :class="$route.path=='/video'?'active':''">
							<router-link :to="{ name: 'video' }" tag="a" class="nav-link">视频</router-link>
						</li>
						<li class="nav-item" @click="drawer = false" :class="$route.path=='/mv'?'active':''">
							<router-link :to="{ name: 'mv' }" tag="a" class="nav-link">MV</router-link>
						</li>
					</ul>

					<div class="titile">
						<span class="line">
							搜索
						</span>
					</div>
					<div class="search form-inline search-m">
						<input type="search" placeholder="  搜索音乐/视频/歌手/歌单" class="form-control" v-model="keyword"
							@keyup.enter="search()">
					</div>
				</el-drawer>
				<div type="primary" class="navbar-toggler border-0" @click="drawer = true">
					<!-- 三条杠 -->
					<!-- <span class="navbar-toggler-icon" @click="drawer = true" type="primary"></span> -->
					Menu
				</div>
			</div>
		</nav>
	</div>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		name: 'navbar',
		data() {
			return {
				// 关键词
				keyword: '',
				// 热搜列表
				hots: [],
				// 侧边栏
				drawer: false,
				innerDrawer: false,
				// 搜索推荐容器
				isshow: false

			}
		},
		watch: {
			drawer() {
				this.upisDrawer(this.drawer)
			},
			$route() {
				this.isshow = false
			}
		},
		computed: {
			...mapGetters([
				'loginStatu',
				'userInfo',
				'getSearchhistory'
			])
		},
		mounted() {
			// 解决了第一次进来的初始值与退出登录的值一样,点退出登录数据没改变getters不更新的bug
			this.$store.commit('upStatu', this.loginStatu)
			this.$store.commit('upUserinfo', this.userInfo)
			// 获取热门搜索
			this.getSearchHot()
		},
		methods: {
			// 搜索
			search() {
				// 空格和未输入	this.keyword.split(' ').join('').length
				if (this.keyword.split(' ').join('').length !== 0) {
					this.addSearchhistory(this.keyword)
					this.drawer = false
					this.$router.push("/search?keyword=" + this.keyword).catch((err) => {
						console.log(err);
					})
				}
			},
			// 点击热门/历史搜索搜索
			searchhot(keyword) {
				this.addSearchhistory(keyword)
				this.drawer = false
				this.$router.push("/search?keyword=" + keyword).catch((err) => {
					console.log(err);
				})
			},
			// 删除某一个搜索历史记录
			delsearchhistory(index) {
				setTimeout(() => {
					this.isshow = true
				}, 300.66)
				this.delSearchhistory(index)
			},
			// 清空搜索历史
			clearSearch() {
				setTimeout(() => {
					this.isshow = true
				}, 300.66)
				this.clearSearchhistory()
			},
			// 关闭热搜容器
			close() {
				setTimeout(() => {
					this.isshow = false
				}, 300)
			},
			// 获取热搜列表
			async getSearchHot() {
				try {
					let timestamp = new Date().getTime()
					// await暂停函数，拿到数据后才执行后面判断
					let res = await this.$api.get(`/search/hot/detail?timestamp=${timestamp}`)
					if (res.code === 200) {
						// console.log(res)
						this.hots = res.data
					}
				} catch (error) {
					console.log(error)
				}
			},
			// 登录
			login() {
				this.drawer = false
				this.$router.push({
					name: 'login'
				})
			},
			// 饿了么组件的下拉菜单指令事件
			handleCommand(command) {
				if (command == 'personal') {
					this.personal()
				} else {
					this.signout()
				}
			},
			// 个人主页
			personal() {
				// 收起两个抽屉
				this.drawer = false
				this.innerDrawer = false
				this.$router.push({
					name: 'personalpage'
				})
			},
			// 退出登录
			signout() {
				this.drawer = false
				this.innerDrawer = false
				// 清除本地存储
				window.localStorage.clear()
				// 清除cookie
				this.handle.clearCookie()
				this.$message({
					message: '退出成功',
					type: 'success'
				});
				// 更新store数据
				this.$store.commit('upStatu', false)
				this.$store.commit('upUserinfo', null)
			},
			...mapMutations([
				'upisDrawer',
				'addSearchhistory',
				'delSearchhistory',
				'clearSearchhistory'
			]),
		},
	}
</script>

<style scoped>
	p {
		margin-bottom: 0;
	}

	.form-inline .form-control {
		width: auto;
		border-radius: 10rem;
	}

	.navbar-collapse {
		flex-grow: 5;
	}

	.logo a {
		width: 157px;
		display: block;
		height: 35px;
		background: url(../../assets/img/logo.png) no-repeat center 3px;
		background-size: 146px 26px;
		margin: 0 25px;
	}

	li {
		margin-right: 15px;
	}

	li a {
		font-size: 14px;
		color: #4e6f8f !important;
		transition: .2s;
	}

	li a:hover {
		color: #1f2d3a !important;
		font-weight: bold;
	}

	.collapse {
		display: flex;
	}

	.navbar-nav {
		flex: 10;
	}

	.form-control {
		display: inline-block;
		margin-right: 10px;
		line-height: 0.5;
		font-size: 14px;
	}

	/* 未登录搜索定位 */
	.search-pos {
		cursor: pointer;
		position: absolute;
		right: 85px;
	}

	/* 登录搜索定位 */
	.search-poss {
		cursor: pointer;
		position: absolute;
		right: 145px;
	}

	/* 未登录头像盒定位 */
	.userbox {
		cursor: pointer;
		position: absolute;
		right: 35px;
		/* position: relative; */
		/* margin-right: -70vw; */
		/* margin-left: 1.5vw; */
	}

	.flex-row {
		margin-top: 5px;
	}

	.el-dropdown {
		bottom: 15px;
		left: 15px;
	}

	.el-popper {
		left: 84.6% !important;
	}

	.el-dropdown-menu__item {
		margin-right: 6px !important;
	}

	.navbar {
		background: #f9f9f9;
		position: relative;
	}

	.line {
		position: relative;
	}

	.line::after {
		content: '';
		height: 22%;
		left: 1px;
		right: 1px;
		background-color: #20f1f1;
		position: absolute;
		opacity: 0.6;
		bottom: -5px;
	}

	.titile {
		font-size: 1.125rem;
		margin: 5% 60% 5% 0;
	}

	.authorimg {
		width: 32%;
		margin: 5% 0 0 33%;
	}

	.authorimg img {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		border: 5px solid rgba(255, 255, 255, 0.4);
	}

	.authorname {
		margin-top: 5px;
		text-align: center;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin-right: 1%;
	}

	.navbar-nav-m {
		margin-left: 6%;
	}

	.search-m {
		margin: 10% 0 0 4%;
	}

	@media screen and (max-width: 992px) {
		.navpc-lg {
			display: none !important;
		}
	}

	.navbar-toggler {
		padding: .25rem 2rem !important;
	}

	.innerDrawer {
		text-align: center;
	}

	.active a {
		color: #fa2800 !important;
	}

	/* 搜索推荐 */
	.searchrecommend {
		width: 380px;
		height: 450px;
		background: #F9F9F9;
		position: absolute;
		right: 50px;
		top: 65px;
		border-radius: 3px;
		padding: 5px 15px 30px;
		overflow: hidden;
		z-index: 3;
	}

	/* 搜索推荐标题 */
	.searchrecommend .title {
		margin: 0 0 10px;
		display: flex;
		align-items: center;
		font-weight: 600;
	}

	/* 搜索容器关闭 */
	/* 	.searchrecommend .searchclose {
		color: #000;
		text-shadow: 1px 1px 0 rgb(255,255,255,.3);
		cursor: pointer;
		float: right;
		font-size: 13px;
		border: 1px solid rgba(106, 106, 106, 0.2);
		border-radius: 20px;
		padding: 2px 8px;
		margin-bottom: 10px;
	}
	.searchrecommend .searchclose:hover {
		color: red;
	} */

	/* 历史搜索标题 */
	.searchrecommend .historytitle {
		justify-content: space-between;
	}

	/* 清空按钮 */
	.searchrecommend .historytitle .clear {
		font-size: 14px;
		color: #6d7685;
		font-weight: 100;
		cursor: pointer;
	}

	.searchrecommend .historyitem:hover {
		color: red;
	}

	.searchrecommend .historytitle .clear:hover {
		color: red;
	}

	/* 热搜列表 */
	.searchrecommend .list {
		overflow: scroll;
		max-height: calc(100% - 35px);
		text-align: left;
	}

	/* 当出现历史搜索时 */
	.searchrecommend .ishistory {
		max-height: calc(100% - 25%);
	}

	.list::-webkit-scrollbar {
		width: 0;
		height: 3px;
	}

	/* 搜索历史 */
	.searchrecommend .historylist {
		overflow: scroll;
		max-height: calc(100% - 83%);
		text-align: left;
	}

	.historylist::-webkit-scrollbar {
		width: 0;
		height: 3px;
	}

	/* 删除按钮 */
	.searchrecommend .historylist .delete {
		padding-left: 5px;
	}

	.searchrecommend .historylist .delete:hover {
		color: red;
	}

	.searchrecommend .historylist .history {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	/* 搜索历史列表 */
	.searchrecommend .historylist .history .tags {
		margin-bottom: 10px;
		font-size: 12px;
		color: #6d7685;
		background-color: #f4f4f5;
		list-style: none;
		cursor: pointer;
		padding: .25rem;
	}

	.searchrecommend .hotlist-row {
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 13px;
		padding: 5px;
		border-radius: 3px;
		margin-bottom: 20px;
		cursor: pointer;
	}

	.searchrecommend .hotlist-row:hover {
		background: #f4f4f5;
	}

	/* 歌曲信息 */
	.searchrecommend .songinfo {
		width: 80%;
	}

	/* 超出省略号隐藏 */
	.searchrecommend .songinfo .ellipsi {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	/* 歌曲标题 */
	.searchrecommend .songinfo .song {
		font-weight: 600;
	}

	/* 介绍 */
	.searchrecommend .songinfo .ellipsis {
		font-size: 12px;
		color: #959595;
	}

	/* 序号 */
	.searchrecommend .num {
		font-size: 16px;
	}
</style>
