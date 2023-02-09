import { observable, makeObservable, action, computed } from "mobx";
import { Signal } from "./constants";
import {transUsTime } from "../utils/help";

class PlayController{
    //以下属性皆为正在播放的音乐的属性
    @observable private isplay: boolean = false;//播放按钮的状态
    @observable private playstate: boolean = false;//是否可以播放
    @observable private currentTime: number = 0;//播放音乐时间
    @observable private volume: number = 0.01;//音量
    @observable private isLock: boolean = false;//是否锁住播放条
    @observable private timer: ReturnType<typeof setInterval> | number | null = null;//定时器
    @observable private audioRef: any;//audio元素
    @observable showVolume: boolean = false;//显示隐藏音量条
    @observable collect: boolean = false;//是否收藏
    @observable showBar: boolean = false;//展开收起播放条
    @observable olyric:Map<number,string> = new Map();//原歌词
    @observable tlyric: Map<number,string> = new Map();//翻译歌词

    constructor() {
        makeObservable(this);
    }
    /**
     * @desc 初始化操作
     */
    @action init(audio:any) {
        try {
            this.audioRef = audio;
            this.volume = Number(localStorage.getItem("volume")!);
            this.audioRef.current.volume = this.volume;
            let lyric = JSON.parse(localStorage.getItem("lyric")!);
            this.olyric = lyric.olyric;
            this.tlyric = lyric.tlyric;
        } catch (err:any) {
            console.info(err.message);
        }
    }
    /**
     * @desc currentTime
     */
    @action setTime(time:number) {
        this.currentTime = time;
    }
    @computed get time() {
        return this.currentTime;
    }
     /**
     * @desc 当前音乐是否可以播放
     */
      @action changeState(state?: boolean) {
        if (typeof state === "boolean") {
            this.playstate = state;
        } else {
            this.playstate = !this.playstate;
        }
        if (this.playstate) {
            PubSub.publish(Signal.PlayMusic);
        }
    }
    /**
     * @desc 获取当前音乐的播放状态
     */
    @computed get state() {
        return this.playstate;
    }
    /**
     * @desc 播放暂停按钮切换
     */
    @action playPause() {
        this.audioRef.current.pause();
        this.isplay = !this.isplay;
    }
    @action play() {
        this.isplay = true;
    }
    @action pause() {
        this.isplay = false;
    }
    
    @computed get isPlay() {
        return this.isplay;
    }
    /**
     * @desc 改变音量
     */
    @action changeVolume(num: number) {
        let volume = num * 0.01;
        this.volume = volume;
        localStorage.setItem("volume", volume+"");
        this.audioRef.current.volume = volume;
    }
    @computed get voice() {
        return this.volume * 100;
    }
    @computed get showSloud() {
        return this.showVolume;
    }
    @action showVoice(isshow:boolean=true) {
        if (!isshow) {
            this.showVolume = isshow;
            return;
        }
        this.showVolume = !this.showVolume;
    }
    @action showCollect() {
        this.collect = !this.collect;
    }
    /**
     * @desc 收起播放条
     */
    @action shrink() {
        this.showBar = false;
    }
    /**
     * @desc 展开播放条
     */
    @action expend() {
        this.showBar = true;
    }
    /**
     * @desc 歌词
     */
    @action handleLyric(olyricStr: string, tlyricStr: string) {
        let timeOlyric = new Map<number,string>();
        let timeTlyric = new Map<number,string>();
        olyricStr.split("\n").forEach(str => {
            let start = str.indexOf("[");
            let end = str.indexOf("]");
            if (start !== -1 && end !== -1 && end > start) {
                timeOlyric.set(transUsTime(str.substring(start + 1, end)), str.substring(end + 1));
            }
        });
        tlyricStr.split("\n").forEach(str => {
            let start = str.indexOf("[");
            let end = str.indexOf("]");
            let flag1 = str.substring(start, end).includes(".");
            let flag2 = str.substring(start, end).includes(":");
            if (start !== -1 && end !== -1 && end > start&&flag1&&flag2) {
                timeTlyric.set(transUsTime(str.substring(start + 1, end)), str.substring(end + 1));
            } else {
                timeTlyric.set(0, str.substring(end + 1));
            }
        })
        this.olyric = timeOlyric;
        this.tlyric = timeTlyric;
        const lyric = { olyric: timeOlyric, tlyric: timeTlyric };
        localStorage.setItem("lyric", JSON.stringify(lyric));
    }
}
const playcontroller = new PlayController();
export default playcontroller;