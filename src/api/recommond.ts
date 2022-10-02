import request from "../utils/request"
//获取首页推荐mv
export function getRecommondmv(pageNums: number = 8): Promise<any> {
    return request({
        url: `/mv/first?limit=${pageNums}`, method: "get"
    })
}
//最热歌单
export function getHightSongLists(limit: number = 15): Promise<any> {
    return request({ method: "get", url: `/top/playlist/highquality?limit=${limit}` });
}
//新碟上架
export function getNewDiscs(limit: number = 12): Promise<any> {
    return request({
        url: `/album/new?area=ALL&limit=${limit}`,
        method: "get"
    })
}
//根据不同标签获取歌单
export function fetchSongLists(order: string = 'hot', cat: string, limit: number, offset: number): Promise<any> {
    return request({ method: "get", url: `/top/playlist?order=${order}&cat=${cat}&limit=${limit}&offset=${offset}` });
}