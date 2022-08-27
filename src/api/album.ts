import request from "../utils/request"
//获取专辑内容
export function fetchAlbumContent(id: string): Promise<any> {
    return request({ method: 'get', url: `/album?id=${id}` });
}