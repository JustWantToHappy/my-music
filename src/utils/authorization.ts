//批量将key-value键值对添入localstorage
export function addLocalStorage(items: Array<{ key: string, value: string }>): void {
    items.forEach((item) => {
        localStorage.setItem(item.key, item.value);
    })
}
//批量清除localstorage中的key-value
export function deleteLocalStorage(keys: Array<string>) {
    keys.forEach(key => {
        localStorage.removeItem(key);
    })
}

