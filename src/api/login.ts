import request from "../utils/request"
/* export function getQrcodeKey(): Promise<{ data: { code: number, unikey: string }, code: number }> {
    return request({ method: "get", url: "/login/qr/key" }) as any;
}
//获取二维码base64
export function qrcodeLogin(key: string): Promise<any> {
    return request({ method: "get", url: `/login/qr/create?key=${key}&qrimg=${key}` })
}
//检查二维码是否过期
export function checkIsOver(key: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/login/qr/check?key=${key}&timestamp=${time}` });
} */

export function sendCode(phone: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/captcha/sent?phone=${phone}&timestamp=${time}` });
}


