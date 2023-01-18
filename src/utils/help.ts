import { addOrDeleteSongFromSongList } from "../api/user"
import PubSub from "pubsub-js";
import { message } from "antd"
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

//将00:00:000格式时间转为us级别
export function transUsTime(time: string): number {
    if (time === "")
        return 0;
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
//根据id从歌单中删除歌曲
export async function removeSongFromSongList(songListId: string, songId: number) {
    try {
        let cookie = localStorage.getItem("cookies");
        let res = await addOrDeleteSongFromSongList("del", songListId, songId, cookie as string);
        if (res.status === 200) {
            PubSub.publish("getSongList");
            message.success("删除成功!", 1);
        }
    } catch (e) {
        console.log(e);
    }
}
//当图片资源都加载完毕后，然后将图片真正的url给img元素
export function getRealURL(imgs: string[], elements: HTMLCollectionOf<Element>) {
    const promises = imgs.map((src, index: number) => {
        return new Promise((resolve, reject) => {
            let loadImg = new Image();
            loadImg.src = src;
            loadImg.onload = () => {
                elements.length>0 && elements[index].setAttribute("src", src);
            }
        })
    })
    Promise.all(promises).then(res => {
        //图片全部加载完毕
    }).catch(err => {
        //程序出现其他异常
    })
}

//图片懒加载,判断类名为className的图片是否加载完成。
export function loadImageLazy(classname:string) {
     //获取所有图片
     const imgs = document.getElementsByClassName(classname);
     //获取可视高度
     const viewHeight = window.innerHeight || document.documentElement.clientHeight;
     for (let i = 0; i < imgs.length; i++) {
         let distance = viewHeight - imgs[i].getBoundingClientRect().top;
         if (distance >= 0 && imgs[i].getBoundingClientRect().top >= 0) {
             imgs[i].setAttribute("src", imgs[i].getAttribute("data-src") as string);
         }
     }
}