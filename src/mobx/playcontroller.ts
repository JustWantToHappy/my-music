import { observable, makeObservable, action, computed } from "mobx";
import { Signal } from "./constants";
class PlayController{
    @observable private playstate: boolean = false;//当前音乐是否可以播放
    @observable private currentTime: number = 0;//当前播放音乐时间
    @observable private timer: ReturnType<typeof setInterval> | number | null = null;//定时器
    @observable private url: string | null = null;//当前播放音乐的url地址
    constructor() {
        makeObservable(this);
        this.init();
    }
    /**
     * @desc 初始化操作
     */
    @action init() {

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
    
}
const playcontroller = new PlayController();
export default playcontroller;