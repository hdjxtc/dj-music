# dj-music 仿网易云音乐播放器

## 预览地址
[dj-music](https://djtc.vip/dj-music)

## 后台接口地址
[网易云音乐 Node.js API service](https://github.com/Binaryify/NeteaseCloudMusicApi)

## 目录结构
##### | --node_modules 安装的依赖包
##### | --public 存放不会变动的文件(第三方)，静态资源会被直接复制到目录dist，不会被压缩合并
##### | --src
##### |   |--api 与后端交互使用相关方法和配置
##### |   |--assets 放可能会变动的文件(自己的)，图片等，打包后会被压缩合并
##### |   |--common 常用到的数据、方法
##### |   |--components 公用组件
##### |   |   |--contents 内容部分用到的组件 
##### |   |   |--footer 脚部用到的组件
##### |   |   |--header 头部用到的组件
##### |   |--model 处理数据的模块方法
##### |   |--router vue-router相关配置
##### |   |--store vuex相关配置
##### |   |--views 所有路由视图
##### |   |--App.vue 顶层路由
##### |   |--main.js 入口文件

<!--  ## 实现功能 -->
[^_^]: # (自己体验，该有的基本都有，懒得整理了...)

## 运行安装
```shell
	$ git clone git@github.com:hdjxtc/dj-music.git
	$ cd dj-music
	$ npm install
	$ npm run serve
```

<!--
	## 使用到的对应接口
	1. 登录
		说明 : 调用此接口登录成功后返回对应的userId、cookie、token等
		必选参数 :
			phone: 手机号码
			password: 密码
		可选参数 :
			countrycode: 国家码，用于国外手机号登录，例如美国传入：1
			md5_password: md5加密后的密码,传入后 password 将失效
		接口地址 : /login/cellphone
		调用例子 : /login/cellphone?phone=xxx&password=yyy /login/cellphone?phone=xxx&md5_password=yyy

	2. 获取用户详情
		说明 : 登录后调用此接口 , 传入用户id, 可以获取用户详情
		必选参数 : uid : 用户id
		接口地址 : /user/detail
		调用例子 : /user/detail?uid=32953014
	
	3. 搜索
		说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐/专辑/歌手/歌单/用户,关键词可以多个,以空格隔开,如 "周杰伦 搁浅"(不需要登录),搜索获取的mp3url不能直接用,可通过/song/url接口传入歌曲id获取具体的播放链接
		必选参数 : keywords : 关键词
		可选参数 : 
			limit : 返回数量 , 默认为 30
			offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
			type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
		接口地址 : /search 或者 /cloudsearch(更全)
		调用例子 : /search?keywords= 海阔天空 /cloudsearch?keywords= 海阔天空
		
	4. 热搜列表(详细)
		说明 : 调用此接口,可获取热门搜索列表
		接口地址 : /search/hot/detail
		调用例子 : /search/hot/detail
		
	5. 搜索建议
		说明 : 调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单 ,mv 信息
		必选参数 : keywords : 关键词
		可选参数 : type : 如果传 'mobile' 则返回移动端数据
		接口地址 : /search/suggest
		调用例子 : /search/suggest?keywords= 海阔天空 /search/suggest?keywords= 海阔天空&type=mobile

	6. 获取歌曲详情
		说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(歌曲id、歌手、封面等)
		必选参数 : ids: 音乐 id, 如 ids=347230
		接口地址 : /song/detail
		调用例子 : /song/detail?ids=347230,/song/detail?ids=347230,347231

	7. 获取音乐 url
		说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,未登录状态或者非会员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
		注 : 部分用户反馈获取的 url 会 403,hwaphon找到的解决方案是当获取到音乐的 id 后，将 https://music.163.com/song/media/outer/url?id=id.mp3 以 src 赋予 Audio 即可播放
		必选参数 : id : 音乐 id
		可选参数 : br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
		接口地址 : /song/url
		调用例子 : /song/url?id=33894312 /song/url?id=405998841,33894312
		
	8. 音乐是否可用
		说明: 调用此接口,传入歌曲 id, 可获取音乐是否可用,返回 { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
		必选参数 : id : 歌曲 id
		可选参数 : br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
		接口地址 : /check/music
		调用例子 : /check/music?id=33894312	

	9. 轮播图
		说明 : 调用此接口 , 可获取 banner( 轮播图 ) 数据
		可选参数 :
			type:资源类型,对应以下类型,默认为 0 即PC
				0: pc
				1: android
				2: iphone
				3: ipad
		接口地址 : /banner
		调用例子 : /banner, /banner?type=2

	10. 推荐歌单
		说明 : 调用此接口 , 可获取推荐歌单
		可选参数 : 
			limit: 取出数量 , 默认为 30 (不支持 offset)
		接口地址 : /personalized
		调用例子 : /personalized?limit=1
		
	11. 推荐新歌曲
		说明 : 调用此接口 , 可获取推荐新音乐
		可选参数 : limit: 取出数量 , 默认为 10 (不支持 offset)
		接口地址 : /personalized/newsong
		调用例子 : /personalized/newsong
		
	12. 获取歌单详情
		说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可 以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
		必选参数 : id : 歌单 id
		可选参数 : s : 歌单最近的 s 个收藏者,默认为8
		接口地址 : /playlist/detail
		调用例子 : /playlist/detail?id=24381616
		
	13. 相关歌单推荐
		说明 : 调用此接口,传入歌单 id 可获取相关歌单(对应页面 https://music.163.com/#/playlist?id=1)
		必选参数 : id : 歌单 id
		接口地址 : /related/playlist
		调用例子 : /related/playlist?id=1
		
	14. 歌单收藏者
		说明 : 调用此接口 , 传入歌单 id 可获取歌单的所有收藏者
		必选参数 : id : 歌单 id
		可选参数 : 
			limit: 取出评论数量 , 默认为 20
			offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
		接口地址 : /playlist/subscribers
		调用例子 : /playlist/subscribers?id=544215255&limit=30
		
	15. 歌单评论
		说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该歌单的所有评论 ( 不需要 登录 )
		必选参数 : id: 歌单 id
		可选参数 : 
			limit: 取出评论数量 , 默认为 20
			offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
			before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
		接口地址 : /comment/playlist
		调用例子 : /comment/playlist?id=705123491	
		
	16. 收藏/取消收藏歌单
		说明 : 调用此接口 , 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
		必选参数 :
			t : 类型
				1:收藏
				2:取消收藏 
			id : 歌单 id
		接口地址 : /playlist/subscribe
		调用例子 : /playlist/subscribe?t=1&id=106697785 /playlist/subscribe?t=2&id=106697785	
		
	17. 获取用户/歌手详情
		说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
		必选参数 : uid : 用户 id
		接口地址 : /user/detail
		调用例子 : /user/detail?uid=32953014	
		
	18. 高德地图行政区域查询
		说明 : 调用此接口，传入查询关键字即可得到行政区域信息
		必选参数 : key : 用户在高德地图官网申请Web服务API类型KEY
		可选参数 :
			keywords : 
				规则：只支持单个关键词语搜索关键词支持：行政区名称、citycode、adcode
				例如，在subdistrict=2，搜索省份（例如山东），能够显示市（例如济南），区（例如历下区
				adcode信息可参考城市编码表获取
			subdistrict : 
				规则：设置显示下级行政区级数（行政区级别包括：国家、省/直辖市、市、区/县、乡镇/街道多级数据）
				可选值：0、1、2、3等数字，并以此类推
					0：不返回下级行政区；
					1：返回下一级行政区；
					2：返回下两级行政区；
					3：返回下三级行政区；
				需要在此特殊说明，目前部分城市和省直辖县因为没有区县的概念，故在市级下方直接显示街道。
				例如：广东-东莞、海南-文昌市
			extensions : 
				此项控制行政区信息中返回行政区边界坐标点； 
				可选值 :
					base : 不返回行政区边界坐标点；
					all : 只返回当前查询district的边界值，不返回子节点的边界值；
				目前不能返回乡镇/街道级别的边界值
				
	19. 获取用户歌单
		说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
		必选参数 : uid : 用户 id
		可选参数 :
			limit : 返回数量 , 默认为 30
			offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
		接口地址 : /user/playlist
		调用例子 : /user/playlist?uid=32953014
		
	20. 获取用户播放记录
		说明 : 登录后调用此接口 , 传入用户 id, 可获取用户播放记录
		必选参数 : uid : 用户 id
		可选参数 : type
			type=1 时只返回 weekData
			type=0 时返回 allData
		接口地址 : /user/record
		调用例子 : /user/record?uid=32953014&type=1
		
	21. 所有榜单内容摘要
		说明 : 调用此接口,可获取所有榜单内容摘要
		接口地址 : /toplist/detail
		调用例子 : /toplist/detail
	
	22. 歌单分类
		说明 : 调用此接口,可获取所有歌单分类,包含 category 信息
		接口地址 : /playlist/catlist
		调用例子 : /playlist/catlist

	23. 热门歌单分类
		说明 : 调用此接口,可获取热门歌单分类,包含 category 信息
		接口地址 : /playlist/hot
		调用例子 : /playlist/hot

	24. 歌单列表
		说明 : 调用此接口 , 可获取网友精选碟歌单
		可选参数 : 
			order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
			cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
			limit: 取出歌单数量 , 默认为 50
			offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
		接口地址 : /top/playlist
		调用例子 : /top/playlist?limit=10&order=new
		
	25. 歌手分类列表
		说明 : 调用此接口,可获取歌手分类列表
		可选参数 :
			limit : 返回数量 , 默认为 30
			offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0 initial: 按首字母索引查找参数,如 /artist/list?type=1&area=96&initial=b 返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1,#传0
			type 取值:
				-1:全部
				1:男歌手
				2:女歌手
				3:乐队
			area 取值:
				-1:全部
				7华语
				96欧美
				8:日本
				16韩国
				0:其他
		接口地址 : /artist/list
		调用例子 : /artist/list?type=1&area=96&initial=b /artist/list?type=2&area=2&initial=b
		
	26. 获取歌手单曲
		说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
		必选参数 : id: 歌手 id, 可由搜索接口获得
		接口地址 : /artists
		调用例子 : /artists?id=6452
		
	27. 获取歌手专辑
		说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
		必选参数 : id: 歌手 id
		可选参数 : 
			limit: 取出数量 , 默认为 50
			offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
		接口地址 : /artist/album
		调用例子 : /artist/album?id=6452&limit=30 ( 周杰伦 )
		
	28. 获取歌手 mv
		说明 : 调用此接口 , 传入歌手 id, 可获得歌手 mv 信息 , 具体 mv 播放地址可调 用/mv传入此接口获得的 mvid 来拿到 , 如 : /artist/mv?id=6452,/mv?mvid=5461064
		必选参数 : id: 歌手 id, 可由搜索接口获得
		接口地址 : /artist/mv
		调用例子 : /artist/mv?id=6452
		
	29. 获取歌手描述
		说明 : 调用此接口 , 传入歌手 id, 可获得歌手描述
		必选参数 : id: 歌手 id
		接口地址 : /artist/desc
		调用例子 : /artist/desc?id=6452 ( 周杰伦 )
		
	30. 获取相似歌手
		说明 : 调用此接口 , 传入歌手 id, 可获得相似歌手
		必选参数 : id: 歌手 id
		接口地址 : /simi/artist
		调用例子 : /simi/artist?id=6452 ( 对应和周杰伦相似歌手 )
		
	31. mv 地址
		说明 : 调用此接口 , 传入 mvid,可获取 mv 播放地址
		必选参数 : id: mvid
		可选参数 : r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
		接口地址 : /mv/url
		调用例子 :
			/mv/url?id=5436712 
			/mv/url?id=10896407&r=1080

	32. 获取 mv 详情
		说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 , 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
		必选参数 : mvid: mv 的 id
		接口地址 : /mv/detail
		调用例子 : /mv/detail?mvid=5436712
		
	33. 获取 mv 点赞转发评论数数据
		说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 点赞转发评论数数据
		必选参数 : mvid: mv 的 id
		接口地址 : /mv/detail/info
		调用例子 : /mv/detail/info?mvid=5436712
		
	34. 相似 mv
		说明 : 调用此接口 , 传入 mvid 可获取相似 mv
		必选参数 : mvid: mv id
		接口地址 : /simi/mv
		调用例子 : /simi/mv?mvid=5436712
		
	35. mv 评论
		说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 mv 的所有评论 ( 不需要 登录 )
		必选参数 : id: mv id
		可选参数 : 
			limit: 取出评论数量 , 默认为 20
			offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
			before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
		接口地址 : /comment/mv
		调用例子 : /comment/mv?id=5436712
		
	36. 发送/删除评论
		说明 : 调用此接口,可发送评论或者删除评论
		接口地址 : /comment
		1.发送评论
			必选参数
				t:
					1 发送
					2 回复
				type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
					0: 歌曲
					1: mv
					2: 歌单
					3: 专辑
					4: 电台
					5: 视频
					6: 动态
					id:对应资源 id
				content :要发送的内容
				commentId :回复的评论id (回复评论时必填)
			调用例子 : /comment?t=1&type=1&id=5436712&content=test (往广岛之恋 mv 发送评论: test)
			注意：如给动态发送评论，则不需要传 id，需要传动态的 threadId,如：/comment?t=1&type=6&threadId=A_EV_2_6559519868_32953014&content=test

		2.删除评论
			必选参数
				t:0 删除
				type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
					0: 歌曲
					1: mv
					2: 歌单
					3: 专辑
					4: 电台
					5: 视频
					6: 动态
			id:对应资源 id content :内容 id,可通过 /comment/mv 等接口获取
			调用例子 : /comment?t=0&type=1&id=5436712&commentId=1535550516319 (在广岛之恋 mv 删除评论)
			注意：如给动态删除评论，则不需要传 id，需要传动态的 `threadId`,如：`/comment?t=0&type=6&threadId=A_EV_2_6559519868_32953014&commentId=1419516382`
		
	37. 给评论点赞
		说明 : 调用此接口 , 传入 type, 资源 id, 和评论 id cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
		必选参数 : 
			id : 资源 id, 如歌曲 id,mv id
			cid : 评论 id
			t : 是否点赞 ,1 为点赞 ,0 为取消点赞
			type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
				0: 歌曲
				1: mv
				2: 歌单
				3: 专辑
				4: 电台
				5: 视频
				6: 动态
		接口地址 : /comment/like
		调用例子 : /comment/like?id=29178366&cid=12840183&t=1&type=0 对应给 https://music.163.com/#/song?id=29178366 最热门的评论点赞
		注意： 动态点赞不需要传入 id 参数，需要传入动态的 threadId 参数,如：/comment/like?type=6&cid=1419532712&threadId=A_EV_2_6559519868_32953014&t=0， threadId 可通过 /event，/user/event 接口获取	
		
	38. 资源点赞( MV,电台,视频)
		说明 : 调用此接口 , 可对 MV,电台,视频点赞
		必选参数 :
			type:资源类型,对应以下类型
				1: mv
				4: 电台
				5: 视频
				6: 动态
				t: 操作,1 为点赞,其他未取消点赞
			id: 资源 id
		接口地址 : /resource/like
		调用例子 : /resource/like?t=1&type=1&id=5436712
		注意：如给动态点赞，不需要传入 id，需要传入 threadId,可通过 event,/user/event 接口获取，如： /resource/like?t=1&type=6&threadId=A_EV_2_6559519868_32953014	
		
	39. 获取视频分类(热门)列表
		说明 : 调用此接口 , 可获取视频分类列表
		接口地址 : /video/category/list
		调用例子 : /video/category/list

	40. 获取视频标签(所有)列表
		说明 : 调用此接口 , 可获取视频标签列表
		接口地址 : /video/group/list
		调用例子 : /video/group/list
		
	41. 获取全部视频列表
		说明 : 调用此接口,可获取视频分类列表,分页参数只能传入offset
		可选参数 : offset: 默认0
		接口地址 : /video/timeline/all
		调用例子 : /video/timeline/all
		
	42. 获取视频标签/分类下的视频
		说明 : 调用此接口 , 传入标签/分类id,可获取到相关的视频,分页参数只能传入offset
		必选参数 : id: videoGroup 的 id
		可选参数 : offset: 默认0
		接口地址 : /video/group
		调用例子 : /video/group?id=9104
		
	43. 视频详情
		说明 : 调用此接口 , 可获取视频详情
		必选参数 : id: 视频 的 id
		接口地址 : /video/detail
		调用例子 : /video/detail?id=89ADDE33C0AAE8EC14B99F6750DB954D
		
	44. 获取视频播放地址
		说明 : 调用此接口 , 传入视频 id,可获取视频播放地址
		必选参数 : id: 视频 的 id
		接口地址 : /video/url
		调用例子 : /video/url?id=89ADDE33C0AAE8EC14B99F6750DB954D
		
	45. 获取视频点赞转发评论数数据
		说明 : 调用此接口 , 传入 vid ( 视频id ) , 可获取对应视频点赞转发评论数数据 必选参数 : vid: 视频id
		接口地址 : /video/detail/info
		调用例子 : /video/detail/info?vid=89ADDE33C0AAE8EC14B99F6750DB954D
		
	46. 相关视频
		说明 : 调用此接口 , 可获取相关视频
		必选参数 : id: 视频 的 id
		接口地址 : /related/allvideo
		调用例子 : /related/allvideo?id=89ADDE33C0AAE8EC14B99F6750DB954D
		
	47. 视频评论
		说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 视频 的所有评论 ( 不需要登录 )
		必选参数 : id: 视频的 id
		可选参数 : 
			limit: 取出评论数量 , 默认为 20
			offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
			before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
		接口地址 : /comment/video
		调用例子 : /comment/video?id=89ADDE33C0AAE8EC14B99F6750DB954D
		
	48. 全部 mv
		说明 : 调用此接口 , 可获取全部 mv
		可选参数 :
			area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部 type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
			order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
			limit: 取出数量 , 默认为 30
			offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
		接口地址 : /mv/all
		调用例子 : /mv/all?area=港台
		
	49. 获取歌词
		说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
		必选参数 : id: 音乐 id
		接口地址 : /lyric
		调用例子 : /lyric?id=33894312
		返回数据如下图 : 获取歌词
		
	50. 获取相似音乐
		说明 : 调用此接口 , 传入歌曲 id, 可获得相似歌曲
		必选参数 : id: 歌曲 id
		接口地址 : /simi/song
		调用例子 : /simi/song?id=347230 ( 对应 ' 光辉岁月 ' 相似歌曲 )
		
	51. 获取相似歌单
		说明 : 调用此接口 , 传入歌曲 id, 可获得相似歌单
		必选参数 : id: 歌曲 id
		接口地址 : /simi/playlist
		调用例子 : /simi/playlist?id=347230 ( 对应 ' 光辉岁月 ' 相似歌单 )
		
	52. 对歌单添加或删除歌曲
		说明 : 调用此接口 , 可以添加歌曲到歌单或者从歌单删除某首歌曲 ( 需要登录 )
		必选参数 :
			op: 从歌单增加单曲为 add, 删除为 del
			pid: 歌单 id tracks: 歌曲 id,可多个,用逗号隔开
		接口地址 : /playlist/tracks
		调用例子 : /playlist/tracks?op=add&pid=24381616&tracks=347231 ( 对应把歌曲添加到 ' 我 ' 的歌单 , 测试的时候请把这里的 pid 换成你自己的, id 和 tracks 不对可能会报 502 错误)

	53. 歌曲评论
		说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该音乐的所有评论 ( 不需要登录 )
		必选参数 : id: 音乐 id
		可选参数 : 
			limit: 取出评论数量 , 默认为 20
			offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
			before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
		接口地址 : /comment/music
		调用例子 : /comment/music?id=186016&limit=1 对应晴天评论
-->