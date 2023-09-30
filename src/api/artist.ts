import request from '../utils/request'
//获取歌手详情
export function fetchSingerDetails(id: string): Promise<any> {
  return request({ method: 'get', url: `/artist/detail?id=${id}` })
}
//获取歌手全部歌曲
export function fetchAllSongBySingerId(id: string): Promise<any> {
  return request({ method: 'get', url: `/artist/songs?id=${id}` })
}
//获取歌手热门的50首歌曲
export function fetchFiftySongs(id: string): Promise<any> {
  return request({ method: 'get', url: `/artist/top/song?id=${id}` })
}
//获取歌手描述
export function fetchSingerDes(id: string): Promise<any> {
  return request({ method: 'get', url: `/artist/desc?id=${id}` })
}
