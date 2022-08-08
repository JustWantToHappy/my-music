import request from "../utils/request"
//歌单详细信息
export function fetchList(id: number): Promise<any> {
    return request.get(`/playlist/detail?id=${id}`);
}
//歌单中每首歌基本信息
export function getListSong(id: number): Promise<any> {
    return request.get(`/playlist/track/all?id=${id}`)
}
//检查音乐是否可用,message属性为ok表示可以播放，message为'亲爱的,暂无版权'不可播放
export function musicIsUse(id:number):Promise<any>{
    return request.get(`check/music?id=${id}`);
}