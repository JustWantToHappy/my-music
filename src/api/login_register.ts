import request from '../utils/request'
//检验手机号是否已经注册
export function hasRegistered(phone: string, ctcode: string): Promise<any> {
  return request({
    method: 'get',
    url: `/cellphone/existence/check?phone=${phone}&countrycode=${ctcode}`,
  })
}
//发送验证码
export function sendCode(phone: string, ctcode: string): Promise<any> {
  let time = new Date().getTime()
  return request({
    method: 'get',
    url: `/captcha/sent?phone=${phone}&ctcode=${ctcode}&timestamp=${time}`,
  })
}
//注册
export function registerByPhone(
  phone: string,
  password: string,
  nickname: string,
  captcha: string,
  countrycode: string,
): Promise<any> {
  let time = new Date().getTime()
  return request({
    method: 'post',
    url: `/register/cellphone?phone=${phone}&password=${password}&captcha=${captcha}&nickname=${nickname}&countrycode=${countrycode}&timestamp=${time}`,
  })
}

const cookie="NMTID=00Ot-j1cGnRymXi6kdRuRcMOj82Fz8AAAGK5WD_Sw; _iuqxldmzr_=32; _ntes_nnid=4543fa11f447f66a82dd5c080b84e9bd,1696065455030; _ntes_nuid=4543fa11f447f66a82dd5c080b84e9bd; WEVNSM=1.0.0; WNMCID=ztaozb.1696065459155.01.0; ntes_utid=tid._.H20kKF9lEJpEQlVRVQbB2a1ifUJH24W3._.0; sDeviceId=YD-ECdIK7Eplg1BFgVRVUbBnPx3fFJD28Hs; WM_TID=dlpbHkAcv+lEFFBUQAOFzbhjLRNYMDTu; JSESSIONID-WYYY=4yHgEPHJ37Rr6Z/1mTK6oQNRcJXTqTcqIcoZOJTAucr66Hx\\2GjowYaxPU9CJ4DM9YPZ6+S5Joj442oOOF4OOQh\\nxKZIwd\\RuowAl\\8VzAaeQRYM4D1pbTY7vbAhanZR+30EuGraaYx\\AUEMzerS9plxpRizTRKhmcnu4ApNNGgPTMV:1696239791673; __snaker__id=V5bUCCRYFcOcW0J2; WM_NI=BMqcmitFDV5mxj6DDjvrZ8WuOx71/V7hBKGebRyHs4c80yE4qPI00eEKxU52EpVoYINifUmxEWKI8ChFxUhNVqp2xAQCIVxs394bJZsGTH/7qWAFbDmrNIBr1F1liDduRFg=; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb2b665ba8ca8b6cc6a97eb8aa6d14b968f9f82c83994b3fa9bcd5cafecafb1e12af0fea7c3b92a8293bf84f063b89a8cb7b867bcb6faa5c762b6ae96d9d67f8da8f9d2ae5ef5b88eacc66fa28eb7a9f240a1e8009ac840b39087d1b36f8795b8b6b83a87b09a90dc438eb7aab6f074878985aabb49ac9ab8b6eb4696afc0d3fb4b939d87b7fb79f1e7fc83c952b1999ca9ae3db3898fa7e150afae82aac17af39aff8dec50a8ab9ea7e637e2a3; YD00000558929251:WM_NI=GwWl3ocwFUd5LEVqGXOLFwfGSWJYk6pxnSOuVLEd1d2eR3qJpLL7Ja8reo/0DZHsf2FwXEqNDR+sgtQ8DCIqGKoRdBKP854Z1DbzrbRq8f9nZEMftpW049TX/g3edDPJR2w=; YD00000558929251:WM_NIKE=9ca17ae2e6ffcda170e2e6ee96aa59bb86feb0f04dba928bb7d14b869a8bacc162a2ede18fcd41bbaafcacef2af0fea7c3b92a85a9998db265a1a98ab6e73f909b9a92c6548d948a98e54d918986baea3eb4a8a2b4ce7f96948b85b470f2bb9ed4f442b49484d8c96bfcaeab90ae3c88868894e53a86a998a6f446888ee594e68093e88ca4cc7b8595a1b3e74a8990f8d6b752f39cae9bf16a92aff887bc669a9b8387f77c95f0fcdad754edb9fd86e75094969ed3f637e2a3; YD00000558929251:WM_TID=JDlFT/W8YrFEBEUQAFLAzLj+jcKi/4Ow; ntes_kaola_ad=1; gdxidpyhxdE=fn0BLpZc18mHmrb4pruIEsBnwvEiKl8ZLqdZTDXsawgpOlBCrxE8ezjqR6ReNvzVwhqTTmW/mJeudt63CEApSoT9mbNz+vQnQQE6YuhTRSqS7EH6bWZ99Q5jyjrkGccm7LYSUWqJ\\qlpe1KZ3dSNiYKdPWrKdaqc0rkw81R3/NI\\nMjo:1696239741650; NTES_P_UTID=3bYoCf55b7qeys6QTqMlAh1yhrejIRUX|1696238970; S_INFO=1696238970|0|3&80##|justwanttohappy; P_INFO=justwanttohappy@163.com|1696238970|0|music|00&99|gud&1696238723&music#gud&440300#10#0#0|&0|music&cloudmusic|justwanttohappy@163.com; __csrf=434c2f6504da2a7c331931ab3efa7594"
//邮箱登录
export function emailLogin(email: string, password: string): Promise<any> {
  return request({
    method: 'post',
    url: `/login?email=${email}&password=${password}?cookie=${cookie}`,
  })
}
