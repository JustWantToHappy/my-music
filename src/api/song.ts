import request from "../utils/request"
export function getLyricBySongId(id:number):Promise<any>{
    return request({method:"get",url:`/lyric?id=${id}`});
}