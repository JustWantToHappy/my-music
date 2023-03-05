//工具函数
//将File文件转为dataURL字符串
export const fileToDataURL = (file: File): Promise<string> => {
    var promise = new Promise<string>((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            return resolve(e.target?.result as string);
        }
    });
    return promise;
}
//将dataURL转为Image对象
export const dataURLToImage = (dataURL: string | null | undefined): Promise<HTMLImageElement> => {
    var img = new Image();
    var promise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.src = dataURL as string;
        img.onload = function () {
            return resolve(img);
        }
    });
    return promise;
}
//将歌曲播放次数转换单位
export const transPlayCount = (count: number): string => {
    if (count < 1e5) {
        return String(count);
    } else if (count < 1e8) {
        return Math.floor(count / 1e4) + "万";
    }
    return Math.floor(count / 1e8) + "亿";
}
//将阿拉伯数字转为汉字
export const transNumber = (count: number): string => {
    const arr = ['一', '二', '三', '四', '五', '六', '天'];
    let str: string = "";
    arr.forEach((ele: string, index: number) => {
        if (index + 1 === count) {
            str = ele;
        }
    })
    return str;
}
/**
 * 用于处理用户滚动后停止延迟(防抖)
 */
export  function delayedExcution(fn:Function,delay:number) {
    let timer: ReturnType<typeof setTimeout>|null;
    return function () {
        const args = arguments;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}