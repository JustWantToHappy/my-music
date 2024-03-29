import Cookies from 'js-cookie'
//批量将key-value键值对添入localstorage
export function addLocalStorage(
  items: Array<{ key: string; value: string }>,
): void {
  items.forEach((item) => {
    localStorage.setItem(item.key, item.value)
  })
}
//批量清除localstorage中的key-value
export function deleteLocalStorage(keys: Array<string>) {
  keys.forEach((key) => {
    localStorage.removeItem(key)
  })
}
//写入cookie
export function addCookies(cookie: string) {
  let arr = cookie.split('; ')
  arr.forEach((str) => {
    let brr = str.split('=')
    Cookies.set(brr[0], brr[1])
  })
}
//设置cookie
export function setCookie(key: string, value: string) {
  Cookies.set(key, value)
}
//得到cookie
export function getCookie(key: string): string | undefined {
  return Cookies.get(key)
}
//删除cookie
export function removeCookie(key: string) {
  Cookies.remove(key)
}
