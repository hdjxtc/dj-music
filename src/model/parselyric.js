/**格式化歌词 */
export function parseLyric(lrc_s) {
	if (lrc_s) {
		lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => p1 + '\n[')
		const lyric = lrc_s.split('\n')
		const lrc = []
		const lyricLen = lyric.length
		for (let i = 0; i < lyricLen; i++) {
			const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g)
			const lrcText = lyric[i].replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '').replace(
				/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '').replace(/^\s+|\s+$/g, '')

			if (lrcTimes) {
				const timeLen = lrcTimes.length
				for (let j = 0; j < timeLen; j++) {
					const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j])
					const min2sec = oneTime[1] * 60
					const sec2sec = parseInt(oneTime[2])
					const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) :
						0
					const lrcTime = min2sec + sec2sec + msec2sec
					lrc.push([lrcTime, lrcText])
				}
			}
		}
		lrc.sort((a, b) => a[0] - b[0])
		return lrc
	} else {
		return []
	}
}
