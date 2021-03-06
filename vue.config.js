module.exports = {
	lintOnSave: false,
	// lintOnSave: process.env.NODE_ENV !== 'production',
	publicPath: './', //打包生成的静态文件的路径起点
	productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
	configureWebpack: {
		// other webpack options to merge in ...
	},
	devServer: {
		host: '0.0.0.0',
		// public: '192.168.1.198:8868',
		port: 8868,
		hot: true, // 热加载
		// hotOnly: true, // 不刷新页面，只做热更新
		disableHostCheck: true, //允许访问hostname不是配置内的
		open: true,
		proxy: { // 解决跨域问题
			'/api': {
				// 为了将/api 替换成 https://wyy.djtc.vip/  https://autumnfish.cn/   https://nicemusic-api.lxhcool.cn/
				target: 'https://wyy.djtc.vip/',
				// 允许跨域
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	},
};
