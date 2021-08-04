/** 歌曲处理方法 */
<<<<<<< HEAD
=======

>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
import handle from './handle'

export function createSong(musicData) {
	return {
		id: musicData.id,
<<<<<<< HEAD
		fee: musicData.fee,
=======
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
		singer: filterSinger(musicData.ar || musicData.artists),
		name: musicData.name,
		album: musicData.al ? musicData.al.name : musicData.album.name,
		duration: handle.formatSecond(musicData.dt || musicData.duration),
		image: musicData.al ? musicData.al.picUrl : musicData.album.artist.img1v1Url,
		url: `https://music.163.com/song/media/outer/url?id=${musicData.id}.mp3`,
		playCount: musicData.playCount || '',
<<<<<<< HEAD
		score: musicData.score || '',
		mv: musicData.mv || '',
		albumid: musicData.al ? musicData.al.id : '',
		artistid: musicData.ar ? musicData.ar[0].id : ''
=======
		score: musicData.score || ''
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
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
<<<<<<< HEAD
=======
		nickName: videoData.nickName,
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
		name: videoData.name,
		playCount: videoData.playCount,
		duration: videoData.duration,
		image: videoData.image,
<<<<<<< HEAD
		isLive: videoData.isLive || false
=======
		isLive: videoData.isLive
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
	}
}
