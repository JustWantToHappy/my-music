import request from '../utils/request'
//获取用户详细信息
export function fetchUserDetail(id: number | string): Promise<any> {
  let time = new Date().getTime()
  return request({
    method: 'get',
    url: `/user/detail?uid=${id}&timestamp=${time}`,
  })
}
//获取用户歌单
export function fetchUserSongList(id: string): Promise<any> {
  let time = new Date().getTime()
  return request({
    method: 'get',
    url: `/user/playlist?uid=${id}&timestamp=${time}`,
  })
}
//新建歌单
export function createNewSongList(name: string): Promise<any> {
  let time = new Date().getTime()
  return request({
    method: 'get',
    url: `/playlist/create?name=${name}&timestamp=${time}`,
  })
}
//删除歌单
export function deleteSongList(id: number): Promise<any> {
  let time = new Date().getTime()
  return request({
    method: 'get',
    url: `/playlist/delete?id=${id}&timestamp=${time}`,
  })
}
//上传歌单封面
export function updateCoverImage(
  id: string,
  cookie: string,
  formdata: FormData,
  imageSize: number = 400,
): Promise<any> {
  return request({
    method: 'post',
    url: `/playlist/cover/update?id=${id}&cookie=${cookie}&imgSize=${imageSize}&timestamp=${Date.now()}`,
    headers: { 'Content-Type': 'multipart/formdata' },
    data: formdata,
    withCredentials: true,
  })
}
//更新歌单信息
export function updateSongList(
  id: string,
  name: string,
  desc?: string,
  tags?: string,
): Promise<any> {
  return request({
    method: 'get',
    url: `/playlist/update?id=${id}&name=${name}&desc=${desc}&tags=${tags}`,
  })
}
//将歌曲添加到歌单或者从歌单中移出,pid表示歌单id,songId表示歌曲id
export function addOrDeleteSongFromSongList(
  op: string,
  pid: string,
  songId: number,
  cookie?: string,
): Promise<any> {
  return request({
    method: 'get',
    url: `/playlist/tracks?op=${op}&pid=${pid}&tracks=${songId}&cookie=${cookie}&timestamp=${Date.now()}`,
  })
}
