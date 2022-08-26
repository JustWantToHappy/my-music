import request from "../utils/request"
//获取首页推荐mv
export function getRecommondmv(pageNums: number = 8): Promise<any> {
    return request({
        url: `/mv/first?limit=${pageNums}`, method: "get"
    })
}
//最热歌单
export function getHightSongLists(limit: number = 16, cat?: string, offset?: number, order?: string): Promise<any> {
    if (cat !== undefined) {
        return request({
            url: `/top/playlist/highquality?limit=${limit}&cat=${cat}&offset=${offset}&order=${order}`,
            method: "get"
        })
    } else {
        return request({ method: "get", url: `/top/playlist/highquality?limit=${limit}` });
    }
}
//新碟上架
export function getNewDiscs(limit: number = 9): Promise<any> {
    return request({
        url: `/album/new?area=ALL&limit=${limit}`,
        method: "get"
    })
}
//精品歌单标签列表，包括语种以及场景、风格等
export function getPlayListTags(): Promise<any> {
    return request({ method: "get", url: "/playlist/highquality/tags" });
}