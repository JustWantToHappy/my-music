import request from "../utils/request";
//获取用户歌单
export function fetchUserSongList(id: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: 'get', url: `/user/playlist?uid=${id}&timestamp=${time}` });
}
//新建歌单
export function createNewSongList(name: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/playlist/create?name=${name}&timestamp=${time}` })
}
//删除歌单
export function deleteSongList(id: number): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/playlist/delete?id=${id}&timestamp=${time}` });
}
//上传歌单封面
export function updateCoverImage(id: string, cookie: string, formdata: FormData, imageSize: number = 300, imgX = 0, imgY = 0): Promise<any> {
    return request({
        method: "post", url: `/playlist/cover/update?id=${id}&cookie=${cookie}&imgSize=${imageSize}&imgX=0&imgY=0&timestamp=${Date.now()}`, headers: { "Content-Type": "multipart/formdata" }, data: formdata, withCredentials: true
    });
}
//更新歌单信息
export function updateSongList(id: string, name: string, desc?: string, tags?: string) {
    return request({ method: "get", url: `/playlist/update?id=${id}&name=${name}&desc=${desc}&tags=${tags}` });
}