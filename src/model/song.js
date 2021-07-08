/** 歌曲处理方法 */

import handle from './handle'

export function createSong(musicData) {
	return {
		id: musicData.id,
		singer: filterSinger(musicData.ar || musicData.artists),
		name: musicData.name,
		album: musicData.al ? musicData.al.name : musicData.album.name,
		duration: handle.formatSecond(musicData.dt || musicData.duration),
		image: musicData.al ? musicData.al.picUrl : musicData.album.artist.img1v1Url,
		url: `https://music.163.com/song/media/outer/url?id=${musicData.id}.mp3`,
		playCount: musicData.playCount || '',
		score: musicData.score || ''
	}
}

// 歌手处理
function filterSinger(singer) {
	let ret = []
	if (!singer) {
		return ''
	}
	singer.map(item => {
		ret.push(item.name)
	})
	// console.log(ret)
	return ret.join(' / ')
}


/** 视频处理方法 */
export function createVideo(videoData) {
	if (videoData.duration > 0) {
		videoData.duration = handle.formatTime(videoData.duration)
	}
	return {
		id: videoData.id,
		nickName: videoData.nickName,
		name: videoData.name,
		playCount: videoData.playCount,
		duration: videoData.duration,
		image: videoData.image,
		isLive: videoData.isLive
	}
}
