import request from "../utils/request"
//获取首页推荐mv
export function getRecommondmv(pageNums: number = 8): Promise<any> {
    return request({
        url: `/mv/first?limit=${pageNums}`, method: "get"
    })
}
//精选歌单
export function getHightSongLists(limit: number = 8): Promise<any> {
    return request({
        url: `/top/playlist/highquality?limit=${limit}`,
        method: "get"
    })
}
//新碟上架
export function getNewDiscs(limit: number = 10): Promise<any> {
    return request({
        url: `/album/new?area=ALL&limit=${limit}`,
        method: "get"
    })
}