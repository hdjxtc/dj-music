<template>
	<div class="navbars">
		<nav class="navbar navbar-light shadow navbar-expand-lg">
			<div class="logo">
				<router-link :to="{name: 'home'}" tag="a"></router-link>
			</div>
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
							@keyup.enter="search()">
					</div>
					<div class="search form-inline search-pos" v-else>
						<input type="search" placeholder="  搜索音乐/视频/歌手/歌单" class="form-control" v-model="keyword"
							@keyup.enter="search()">
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

			<div class="nav-mb">
				<el-drawer :visible.sync="drawer" direction="rtl" size="70%">
					<div class="titile">
						<span class="line">
							用户
						</span>
					</div>
					<div class="author">
						<div class="authorimg" v-if="loginStatu">
							<img :src="userInfo.avatarUrl" @click="innerDrawer = true">
						</div>
						<div class="authorimg" v-else @click="login">
							<el-avatar icon="el-icon-user-solid" :size="70"></el-avatar>
						</div>

						<div class="authorname" v-if="loginStatu" @click="innerDrawer = true">
							{{userInfo.nickname}}
						</div>
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
	import {mapGetters,mapMutations} from 'vuex'
	export default {
		name: 'navbar',
		data() {
			return {
				keyword: '',
				hots: [],
				drawer: false,
				innerDrawer: false,
			}
		},
		watch:{
			drawer(){
				this.upisDrawer(this.drawer)
			}
		},
		computed: {
			...mapGetters([
				'loginStatu',
				'userInfo',
			])
		},
		mounted() {
			// 解决了第一次进来的初始值与退出登录的值一样,点退出登录数据没改变getters不更新的bug
			this.$store.commit('upStatu', this.loginStatu)
			this.$store.commit('upUserinfo', this.userInfo)
		},
		methods: {
			...mapMutations([
				'upisDrawer'
			]),
			// 搜索
			search() {
				// 空格和未输入	this.keyword.split(' ').join('').length
				if (this.keyword.split(' ').join('').length !== 0) {
					this.drawer = false
					this.$router.push("/search?keyword=" + this.keyword).catch((err) => {
						console.log(err);
					})
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
				this.$store.commit('upStatu',false)
				this.$store.commit('upUserinfo',null)
			},
		},
	}
</script>

<style scoped>
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
	.active a{
		color: #fa2800!important;
	}
</style>
