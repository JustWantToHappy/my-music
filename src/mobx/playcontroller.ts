import { observable, makeObservable, action, computed } from "mobx";
import { Signal } from "./constants";
class PlayController{
    @observable private playstate: boolean = false;//当前音乐播放or暂停
    @observable  time: number = 0;//当前播放音乐时间
    @observable private timer: ReturnType<typeof setInterval> | number | null = null;//定时器
    
    constructor() {
        makeObservable(this);
    }
     /**
     * @desc 播放暂停音乐
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
export default new PlayController();