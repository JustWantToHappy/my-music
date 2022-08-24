import request from "../utils/request"
//获取歌曲歌词
export function getLyricBySongId(id:number):Promise<any>{
    return request({method:"get",url:`/lyric?id=${id}`});
}