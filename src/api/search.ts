import request from "../utils/request";
//回车后获取的搜索结果
export function getSearchContent(keywords: string, currentPage: number, limit: number = 30, type: number = 1): Promise<any> {
    //偏移量
    let offset = (currentPage - 1) * limit;
    return request({ method: "get", url: `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}&type=${type}` })
}