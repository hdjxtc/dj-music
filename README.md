# dj-music

## 预览地址
[dj-music](https://djtc.vip/dj-music)

## 目录结构
##### | --dist 生成打包后的文件
##### | --node_modules 安装的依赖包
##### | --public 静态资源会被输出到目录dist
##### | --src
##### |   |--api 与后端交互使用相关方法和配置
##### |   |   |--request.js 封装请求，拦截器等等 （axios，fetch）
##### |   |   |--config.js 配置不同环境下接口地址
##### |   |--assets 存放静态资源，图片等
##### |   |--model
##### |   |   |--song.js 处理歌曲视频数据
##### |   |   |--handle.js 封装的工具函数
##### |   |--components 公用组件
##### |   |--router vue-router相关配置
##### |   |   |--index.js 所有路由
##### |   |--views 所有的路由视图组件
##### |   |--app.vue 顶层路由
##### |   |--main.js 入口文件

## 安装运行
```shell
$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi
$ cd NeteaseCloudMusicApi
$ npm install
$ npm start
$ 成功后访问localhost:3000是否正常，正常下一步
$ git clone git@gitee.com:lxhcool/desktop-nicemusic.git
$ cd desktop-nicemusic
$ npm install
$ npm run serve
```

## 打包上线
```shell
$ https://github.com/Binaryify/NeteaseCloudMusicApi 构建后端服务（这个需要自行解决，不知道的建议找后端的朋友帮忙）
$ 构建成功后打开是这样的界面就代表ok了（https://nicemusic-api.lxhcool.cn/）
$ 构建后会有接口地址，在项目src/api/config.js中将production下面的接口地址修改成自己的api地址
$ cd desktop-nicemusic
$ npm install
$ npm run build
$ 生成dist文件夹，将里面的内容上传到自己的服务器就可以了
```

##对应接口
#####登录
```js
	说明 : 调用此接口登录成功后返回对应的userId、cookie、token等
	必选参数 :
		phone: 手机号码
		password: 密码
	可选参数 :
		countrycode: 国家码，用于国外手机号登录，例如美国传入：1
		md5_password: md5加密后的密码,传入后 password 将失效
	接口地址 : /login/cellphone
	调用例子 : /login/cellphone?phone=xxx&password=yyy /login/cellphone?phone=xxx&md5_password=yyy
```
#####获取用户详情
```js
	说明 : 登录后调用此接口 , 传入用户id, 可以获取用户详情
	必选参数 : uid : 用户id
	接口地址 : /user/detail
	调用例子 : /user/detail?uid=32953014
```
#####搜索
```js
	说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐/专辑/歌手/歌单/用户,关键词可以多个,以空格隔开,如 "周杰伦 搁浅"(不需要登录),搜索获取的mp3url不能直接用,可通过/song/url接口传入歌曲id获取具体的播放链接
	必选参数 : keywords : 关键词
	可选参数 : 
		limit : 返回数量 , 默认为 30
		offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
		type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
	接口地址 : /search 或者 /cloudsearch(更全)
	调用例子 : /search?keywords= 海阔天空 /cloudsearch?keywords= 海阔天空
```
#####轮播图
```js
	说明 : 调用此接口 , 可获取 banner( 轮播图 ) 数据
	可选参数 :
		type:资源类型,对应以下类型,默认为 0 即PC
			0: pc
			1: android
			2: iphone
			3: ipad
	接口地址 : /banner
	调用例子 : /banner, /banner?type=2
```
#####歌单
```js
	说明 : 调用此接口 , 可获取网友精选碟歌单
	可选参数 : 
		order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
		cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
		limit: 取出歌单数量 , 默认为 50
		offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
	接口地址 : /top/playlist
	调用例子 : /top/playlist?limit=10&order=new
```
#####推荐歌单
```js
	说明 : 调用此接口 , 可获取推荐歌单
	可选参数 : 
		limit: 取出数量 , 默认为 30 (不支持 offset)
	接口地址 : /personalized
	调用例子 : /personalized?limit=1
```
#####推荐新歌曲
```js
	说明 : 调用此接口 , 可获取推荐新音乐
	可选参数 : limit: 取出数量 , 默认为 10 (不支持 offset)
	接口地址 : /personalized/newsong
	调用例子 : /personalized/newsong
```
#####获取歌曲详情
```js
	说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情
	必选参数 : ids: 音乐 id, 如 ids=347230
	接口地址 : /song/detail
	调用例子 : /song/detail?ids=347230,/song/detail?ids=347230,347231
```