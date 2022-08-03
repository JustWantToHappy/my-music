import request from "../utils/request"
//歌单详细信息
export function fetchList(id: number): Promise<any> {
    return request.get(`/playlist/detail?id=${id}`);
}
//歌单中每首歌基本信息
export function getListSong(id: number): Promise<any> {
    return request.get(`/playlist/track/all?id=${id}`)
}