import request from '../utils/request'
export function getMVURL(id: string): Promise<any> {
  let time = Date.now()
  return request({ method: 'get', url: `/mv/url?id=${id}` })
}
