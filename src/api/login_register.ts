import request from "../utils/request"
//检验手机号是否已经注册
export function hasRegistered(phone: string, ctcode: string): Promise<any> {
    return request({ method: "get", url: `/cellphone/existence/check?phone=${phone}&countrycode=${ctcode}` });
}
//发送验证码
export function sendCode(phone: string, ctcode: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "get", url: `/captcha/sent?phone=${phone}&ctcode=${ctcode}&timestamp=${time}` });
}
//注册
export function registerByPhone(phone: string, password: string, nickname: string, captcha: string, countrycode: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "post", url: `/register/cellphone?phone=${phone}&password=${password}&captcha=${captcha}&nickname=${nickname}&countrycode=${countrycode}&timestamp=${time}` })
}
//邮箱登录
export function emailLogin(email: string, password: string): Promise<any> {
    let time = new Date().getTime();
    return request({ method: "post", url: `/login?email=${email}&password=${password}&timestamp=${time}` });
}


