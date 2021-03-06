// 数据处理	

export default {
	// 补0方法
	addZero(num, len) {
		if (String(num).length > len) return num
		// -slice取出
		return (Array(len).join(0) + num).slice(-len)
	},
	//清除所有cookie函数
	clearCookie() {
		var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
		if (keys) {
			for (var i = keys.length; i--;) {
				document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
			}
		}
	},
	// 日期格式化
	dateFormat(str, type) {
		let date = new Date(str)
		let year = date.getFullYear()
		// getMonth获取到的月份是0-11，所以要加1
		let month = this.addZero(date.getMonth() + 1, 2)
		let day = this.addZero(date.getDate(), 2)
		let hour = this.addZero(date.getHours(), 2)
		let minute = this.addZero(date.getMinutes(), 2)
		let seconds = this.addZero(date.getSeconds(), 2)
		if (type == 'YYYY-MM-DD') {
			return `${year}-${month}-${day}`
		} else if (type == 'YYYY-MM-DD HH:MM:SS') {
			return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
		} else if (type == 'MM/DD  HH:MM:SS') {
			return `${month}/${day} ${hour}:${minute}:${seconds}`
		}
	},
	// 转换单位 如 100000 转为10万
	// 需要转化的数 num
	// 需要保留的小数位数 point
	tranNumber(num, point) {
		let numStr = num.toString()
		// 小于10万直接返回
		if (numStr.length < 6) {
			return numStr
		}
		//大于8位数是亿
		else if (numStr.length > 8) {
			// 取小数
			let decimal = numStr.substring(
				numStr.length - 8,
				numStr.length - 8 + point
			)
			return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
		}
		//6位数是十万，大于5就是大于等于10万(以10W分割 10W以下全部显示)
		else if (numStr.length > 5) {
			let decimal = numStr.substring(
				numStr.length - 4,
				numStr.length - 4 + point
			)
			return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
		}
	},
	// 转换成秒
	formatSecond(time) {
		// 取整
		time = ~~time
		// return parseInt(time/1000)
		var secondTime
		if (time < 10) {
			secondTime = '00:0' + time
		} else if (time < 60) {
			secondTime = '00:' + time
		} else {
			var m = ~~parseInt((time % (1000 * 60 * 60)) / (1000 * 60))
			// var m = ~~parseInt((time / (1000 * 60)) % 60)
			var s = ~~parseInt((time % (1000 * 60)) / 1000)
			// var s = ~~parseInt((time / 1000 ) % 60)
			secondTime = Number(m * 60 + s)
		}
		return secondTime
	},
	// 格式化时间(用于处理视频接口(song.js)得到的时间，接口返回的时间毫秒数)
	formatTime(time) {
		// 取整
		time = ~~time
		var formatTime
		if (time < 10) {
			formatTime = '00:0' + time
		} else if (time < 60) {
			formatTime = '00:' + time
		} else {
			// 视频接口里的时间没转为秒，所以要1000*60
			var m = ~~(time / (1000 * 60))
			if (m < 10) {
				m = '0' + m
			}
			var s = ~~((time / 1000) % 60)
			if (s < 10) {
				s = '0' + s
			}
			formatTime = m + ':' + s
		}
		return formatTime
	},
	// 秒转00:00（用于新歌推荐、进度条，歌曲信息里的时间已经用formatSecond转换为秒）
	SecondTime(interval) {
		// 按位或'|',数值为undefined或null或false时，直接返回0
		interval = interval | 0
		// 位运算会先转整数去掉小数位，相当于parseInt方法
		const m = (interval / 60) | 0
		const s = interval % 60
		return `${this.addZero(m, 2)}:${this.addZero(s, 2)}`
	},
	// 时间戳转换成几分钟前，几小时前，几天前
	formatMsgTime(dateTimeStamp) {
		var result = ''
		var minute = 1000 * 60
		var hour = minute * 60
		var day = hour * 24
		var month = day * 30
		var now = new Date().getTime()
		var diffValue = now - dateTimeStamp
		if (diffValue < 0) return
		var monthC = diffValue / month
		var weekC = diffValue / (7 * day)
		var dayC = diffValue / day
		var hourC = diffValue / hour
		var minC = diffValue / minute
		if (monthC >= 1) {
			result = '' + parseInt(monthC) + '月前'
		} else if (weekC >= 1) {
			result = '' + parseInt(weekC) + '周前'
		} else if (dayC >= 1) {
			result = '' + parseInt(dayC) + '天前'
		} else if (hourC >= 1) {
			result = '' + parseInt(hourC) + '小时前'
		} else if (minC >= 1) {
			result = '' + parseInt(minC) + '分钟前'
		} else {
			result = '刚刚'
		}
		return result
	},
	// 获取是几几后
	getAstro(timestamp) {
		// console.log(timestamp)
		let newDate = new Date(timestamp)
		// let newDate = new Date()
		// newDate.setTime(timestamp)
		let birthday = newDate.toLocaleDateString(timestamp)
		// console.log(birthday)
		let birthdayArr = birthday.split('/')
		let year = birthdayArr[0].substring(birthdayArr[0].length - 2) + '年'
		// console.log(birthdayArr)
		let month = birthdayArr[1]
		let day = birthdayArr[2]
		if (birthdayArr[0] == '1900') {
			return (
				'此人很懒，暂未设置~'
			)
		}
		// function getAstro(m, d) {
		// 	//各个星座的日期分界线，例如1月为："102223444433".charAt(0)即"1"，依此类推... 然后加上19(这里用- -19，因为'+'会当作字符串拼接操作而不是数学的加法)
		// 	let b = "102223444433".charAt(m - 1) - -19;
		// 	//如果日期小于分界线，就为1，否则为0
		// 	let sub = d < b ? 1 : 0;
		// 	//把月份换算成索引，得到0~12的数字，0 摩羯，1 水瓶，...，12是摩羯。
		// 	let x = m - sub;
		// 	//从索引*2的位置开始取出2个字符，即为星座名称
		// 	return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(x * 2, 2);
		// }
		return (
			year +
			' - ' +
			'魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
				month * 2 - (day < '102223444433'.charAt(month - 1) - -19) * 2,
				2
			) +
			'座'
		)
	},
}
