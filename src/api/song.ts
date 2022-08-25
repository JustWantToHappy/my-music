import request from "../utils/request"
//获取歌曲歌词
export function getLyricBySongId(id: number): Promise<any> {
    return request({ method: "get", url: `/lyric?id=${id}` });
}
//获取每日推荐歌曲(登录状态下)
export function fetchMyRecommendSongs(): Promise<any> {
    return request({ method: "get", url: '/recommend/songs' });
}
