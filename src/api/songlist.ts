import request from "../utils/request"
//歌单详细信息
export function fetchList(id: number): Promise<any> {
    return request.get(`/playlist/detail?id=${id}`);
}
//歌单中每首歌基本信息，好像无法频繁调用，此接口无法使用时间戳
export function getListSong(id: number): Promise<any> {
    return request.get(`/playlist/track/all?id=${id}`)
}
//检查音乐是否可用,message属性为ok表示可以播放，message为'亲爱的,暂无版权'不可播放
export function musicIsUse(id: number): Promise<any> {
    return request.get(`check/music?id=${id}`);
}
//获取每日推荐歌曲(登录状态下)
export function fetchMyRecommendSongs(): Promise<any> {
    return request({ method: "get", url: '/recommend/songs' });
}
//获取每日推荐歌单(登录状态下)
export function fetchMyRecommendSongList(): Promise<any> {
    return request({ method: "get", url: `/recommend/resource` });
}
