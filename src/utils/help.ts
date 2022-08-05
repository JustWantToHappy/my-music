//将毫秒级别的时间转换为分秒级
export function transTime(time: number, type: number): string {
    if (type === 1) {
        return `${Math.floor(time / 1000 / 60)}分${Math.round(time / 1000) % 60}秒`
    } else {
        let mt = Math.floor(time / 1000 / 60);
        let st = Math.round(time / 1000) % 60;
        let str = "";
        if (mt < 10) {
            str += "0";
        }
        str += mt;
        str += ":";
        if (st <10) {
            str += "0";
        }
        str += st;
        return str;
    }
}

