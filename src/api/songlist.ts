import request from "../utils/request"
export function fetchList(id: number): Promise<any> {
    return request.get("/playlist/detail");
}