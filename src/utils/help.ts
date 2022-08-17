import React from "react";
import { musicIsUse } from "../api/songlist"
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
        if (st < 10) {
            str += "0";
        }
        str += st;
        return str;
    }
}
//判断容器内的图片全部加载完毕
export const getImgsLoadEnd = (arr: Array<any>, srcName: string, myRef: React.RefObject<any>) => {
    if (arr && arr?.length > 0) {
        const promises = arr.map(list => {
            return new Promise((resolve, reject) => {
                let loadImg = new Image();
                loadImg.src = list[srcName];
                loadImg.onload = () => {
                    let style = myRef.current?.style;
                    (style as CSSStyleDeclaration).opacity = '1';
                    resolve("此图片加载完毕")
                }
            })
        })
        Promise.all(promises).then(res => {
            console.log("加载完成")
        }).catch(err => {
            console.log("网络异常或者其他程序异常,", err);
        })
    }
}
//将00:00:000格式时间转为us级别
export function transUsTime(time: string): number {
    try {
        let arr = time.split(":");
        let num1 = Number(arr[0]) * 60 * 1e6;
        let brr = arr[1].split(".");
        let num2 = Number(brr[0]) * 1e6;
        let num3 = Number(brr[1]) * 1000;
        return num1 + num2 + num3;
    } catch (e) {
        console.log(e);
    }
    return 0;
}
//节流函数
export function throttle(fn: Function, delay: number): Function {
    let timer: any;
    return function () {
        var args = arguments;
        if (timer) {
            return;
        }
        timer = setTimeout(function() {
            fn.apply(window, args);
        }, delay)
    }

}