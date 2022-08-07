//批量将key-value键值对添入localstorage
export function addLocalStorage(items: Array<{ key: string, value: string }>): void {
    items.forEach((item) => {
        localStorage.setItem(item.key, item.value);
    })
}

