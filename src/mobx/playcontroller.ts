import { observable, makeObservable, action, computed } from "mobx";
import { Signal } from "./constants";

class PlayController{
    //以下属性皆为正在播放的音乐的属性
    @observable private playstate: boolean = false;//是否可以播放
    @observable private currentTime: number = 0;//播放音乐时间
    @observable private volume: number = 0.01;//音量
    @observable  showVolume: boolean = false;//显示隐藏音量条
    @observable private isPlay: boolean = false;//展开收起播放条
    @observable private isLock: boolean = false;//是否锁住播放条
    @observable private timer: ReturnType<typeof setInterval> | number | null = null;//定时器
    @observable private url: string | null = null;//url地址
    @observable private audioRef: any;
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
        } catch (err) {
            console.info(err);
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
     * @desc 如果播放列表有正在播放的歌曲，获取歌曲url
     */
    set URL(url:string) {
        this.url = url;
        // this.resetTimer();
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
    
}
const playcontroller = new PlayController();
export default playcontroller;