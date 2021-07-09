<template>
	<div class="loginbox">
		<div class="formbg shadow">
			<div class="formbox">
				<img src="../assets/img/logo.png" class="logo" />
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
					<div class="login-input">
						<el-form-item prop="phone">
							<el-input class="login-text" type="text" placeholder="请输入网易云音乐手机号" v-model="ruleForm.phone">
							</el-input>
							<span class="login-symbol icos">
								<i class="el-icon-mobile-phone"></i>
							</span>
						</el-form-item>
					</div>
					<div class="login-input">
						<el-form-item prop="password">
							<!-- keyup.enter.native    组件里使用keyup必须要加native -->
							<el-input class="login-text" type="password" placeholder="请输入密码" v-model="ruleForm.password"
								@keyup.enter.native="login('ruleForm')"></el-input>
							<span class="login-symbol icos">
								<i class="el-icon-lock"></i>
							</span>
						</el-form-item>
					</div>
					<div class="login-footer">
						<div class="login-btn-wrap">
							<el-button class="login-btn" type="primary" :loading="loginLoading"
								@click="login('ruleForm')">登录
							</el-button>
						</div>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'login',
		data() {
			return {
				// 表单数据对象
				ruleForm: {
					phone: '',
					password: ''
				},
				// 表单验证规则
				rules: {
					phone: [{
						required: true,
						message: '手机号都没有！',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码呢！',
						trigger: 'blur'
					}]
				},
				loginLoading: false
			}
		},
		methods: {
			// 点击登录按钮
			login(forminfo) {
				this.$refs[forminfo].validate(valid => {
					if (valid) {
						let {
							phone,
							password
						} = this.ruleForm
						this.loginAsync(phone, password)
					} else {
						this.$message.error('请输入手机号与密码！')
					}
				})
			},
			// 调用登录接口
			loginAsync(phone, password) {
				this.loginLoading = true
				const res = this.$api.get("/login/cellphone", {
					params: {
						phone: phone,
						password: password,
						// withCredentials: true,
					}
				}).then(res => {
					// console.log(res)
					if (res.code === 200) {
						this.getUserDetail(res.profile.userId)
						window.localStorage.setItem('cookie', res.cookie)
						window.localStorage.setItem('token', res.token)
						window.localStorage.setItem('loginStatu', true)
						// this.setLoginStatu(true)
					} else {
						this.loginLoading = false
						this.$message.error(res.msg)
					}
				}).catch(() => {
					this.loginLoading = false
					this.$message.error('似乎出了什么问题啊，啧啧啧!!!')
				})
			},
			// 获取个人信息
			async getUserDetail(uid) {
				try {
					const res = await this.$api.get("/user/detail", {
						params: {
							uid: uid
						}
					})
					// console.log(res)
					if (res.code === 200) {
						this.loginLoading = false
						let userInfo = res.profile
						// 等级
						userInfo.level = res.level
						// 累计听歌数量
						userInfo.listenSongs = res.listenSongs
						// 创建时间
						userInfo.createTime = res.createTime
						// 创建天数
						userInfo.createDays = res.createDays
						window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
						// this.setUserInfo(res.profile)
						this.$message({
							message: '登录成功',
							type: 'success'
						})
						setTimeout(() => {
							this.loginLoading = false
							this.$router.push({
								path: '/'
							})
						}, 1000)
					}
				} catch (error) {
					console.log(error)
				}
			},
		}
	}
</script>

<style scoped>
	.loginbox {
		width: 100%;
		height: 100%;
	}

	.formbg {
		width: 33%;
		height: 48%;
		margin: 15% auto;
		background: rgba(249, 249, 249, .6);
	}

	.formbox {
		width: 70%;
		margin: 0 auto;
	}

	.icos {
		position: absolute;
		left: 3%;
	}

	.logo {
		padding: 15% 0;
	}

	.login-btn {
		font-size: 15px;
		line-height: 1.5;
		color: #fff;
		text-transform: uppercase;
		width: 100%;
		height: 42px;
		border-radius: 3px;
		border: 0;
		background: #5dd5c8;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25px;
	}

	@media screen and (max-width: 992px) {
		.formbg {
			width: 50%;
			margin: 30% auto;
		}
	}

	@media screen and (max-width: 768px) {
		.formbg {
			width: 70%;
			margin: 40% auto;
		}
	}

	@media screen and (max-width: 576px) {
		.formbg {
			width: 100%;
			height: 100%;
			margin: 0;
			padding-top: 40%;
		}
	}
</style>
