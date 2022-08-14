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
//检验手机号是否已经注册
export function hasRegistered(phone: string, ctcode: string): Promise<any> {
    return request({ method: "get", url: `/cellphone/existence/check?phone=${phone}&countrycode=${ctcode}` });
}
//发送验证码
export function sendCode(phone: string, ctcode: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/captcha/sent?phone=${phone}&ctcode=${ctcode}&timestamp=${time}` });
}
//验证验证码
export function verifyCode(phone: string, captcha: string, ctcode: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/captcha/verify?phone=${phone}&captcha=${captcha}&ctcode=${ctcode}&timestamp=${time}` })
}


