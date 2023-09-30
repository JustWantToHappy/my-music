import request from '../utils/request'
//获取排行榜,通过榜单id然后调用获取歌单详情接口
export function fetchTopListDetail(): Promise<any> {
  return request({ method: 'get', url: '/toplist/detail' })
}
