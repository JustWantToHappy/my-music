//将毫秒级别的时间转换为分秒级
export function transTime(time: number): string {
    return `${Math.floor(time / 1000 / 60)}分${Math.round(time / 1000) % 60}秒`
}