import { observable ,makeObservable, action,computed} from "mobx";
import PubSub from "pubsub-js";
import { PlayWay, Signal } from "./constants";
import CycleIcon from "../assets/logo/cycle.svg";
import SingleCycleIcon from "../assets/logo/single_cycle.svg";
import RandomIcon from "../assets/logo/random_play.svg"; 
/**
 * @desc 播放列表
 * 总结一下如果使用修饰器的话，
 * getter和setter只能够适用@computed，而其他方法要使用@action
 * 建议不要在业务代码中直接设置store中的值(可以用setter或者一个函数)
 * 
 */
interface PlayWayType{
    icon: any;
    desc: string;
    type: string;
}
class PlayList{
    private playwayQueue: Array<PlayWayType> = [
        { icon: CycleIcon, desc: "循环播放",type:PlayWay.Cycle },
        { icon: SingleCycleIcon, desc: "单曲循环",type:PlayWay.SingleCycle },
        {icon:RandomIcon,desc:"随机播放",type:PlayWay.RandomPlay},
    ];
    @observable private queue: Array<Music.song> = []
    @observable private playway: PlayWayType =this.playwayQueue[0] ;// 当前播放列表的播放方式
    @observable private playsong: Music.song | null = null;//当前正在播放的音乐
    @observable private playstate: boolean = false;//当前音乐播放or暂停
    @observable private show: boolean = false;//是否展示当前播放列表
    constructor() {
        makeObservable(this);
        try {
            const songs = JSON.parse(localStorage.getItem("songs")!) || [];
            this.queue = songs;
        } catch (err) {
            console.info(err);
        }
        this.initPlayWay();
    }
    /**
     * @desc 初始化播放方式
     */
    @action initPlayWay() {
        let way = localStorage.getItem("playway");
        let index = this.playwayQueue.findIndex(playway=>playway.type===way);
        this.playway = index === -1 ? this.playwayQueue[0] : this.playwayQueue[index];
    }
    /**
     * @desc 添加歌曲
     */
    @action add(song: Music.song):boolean {
        if (!this.has(song.id)) {
            // 添加歌曲之前判断当前歌曲是否可以播放(需要版权或者vip等)
            if (song.fee===1||song.fee===4) {
                return false;
            }
            this.queue.push(song);
            localStorage.setItem("songs", JSON.stringify(this.queue));
        } 
        return true;
    }
    /**
     * 
     * @param id 歌曲id
     * @desc 删除歌曲
     */
    @action delete(id: number) {
        //如果删除的歌曲恰好是正在播放的歌曲，需要处理一些意外
        if (id === this.playsong?.id) {
            let index = this.playSongIndex();
            let len = this.queue.length;
            //正好是队尾
            if (index>=1&&index + 1 === len) {
                this.queue.pop();
                this.playsong = this.queue[index - 1];
                return;
            } else if(index+1<len){
                this.playsong = this.queue[index + 1];
            }
        }
        this.queue = this.queue.filter(song => song.id !== id);
        localStorage.setItem("songs", JSON.stringify(this.queue));
    }
    /**
     * @desc 清空播放队列
     */
    @action clearAll() {
        this.queue = [];
        localStorage.removeItem("songs");
    }
    @computed get songs() {
        return this.queue;
    }
    /**
     * @desc 播放列表歌曲数
     */
    @computed get size():number{
        return this.queue.length;
    }
    /**
     * @desc 检查歌曲是否已经加入到播放队列中
     */
    @action has(id:number): boolean{
        return this.queue.find(song => song.id === id) !== undefined;
    }
    /**
     * @desc 设置音乐播放方式
     */
    @action changePlayWay() {
        let currentIndex = this.playwayQueue.findIndex(playway => this.playway.type=== playway.type);
        let len = this.playwayQueue.length;
        let next = currentIndex===-1?0:(currentIndex + len+1) % len;
        this.playway = this.playwayQueue[next];
        localStorage.setItem("playway", this.playway.type);
    }
    /**
     * @des 播放方式
     */
    @computed get way(): PlayWayType{
        return this.playway;
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
    /**
     * @desc 设置正在播放的音乐
     */
    set song(song:Music.song) {
        this.playsong = song;
    }
    /**
     * @desc 获取当前正在播放的歌曲
     */
    @computed get song() {
        return this.playsong!;
    }
    
    /**
     * @desc 是否展示当前播放列表
     */
    @computed get isShow() {
        return this.show;
    }
    set isShow(show:boolean) {
        this.show = show;
    }
    /**
     * @desc 手动向上播放音乐
     */
    @action playPrevSong() {
        if (this.queue.length <= 1) {
            return;
        }
        let index = this.playSongIndex();
        if (index !== -1) {
            let next = (index - 1 + this.queue.length) % this.queue.length;
            this.playsong = this.queue[next];
        }
    }
    /**
     * @params {} ishandle 手动切歌还是自动切歌(在单曲循环下手动和自动有点区别)
     * @desc 自动向下播放的歌曲以及手动向下播放
     */
    @action playNextSong(ishandle?:boolean) {
        switch (this.playway.type) {
            // 循环播放
            case PlayWay.Cycle:
                this.handleCyclePlay();
                break;
            //单曲循环
            case PlayWay.SingleCycle:
                this.handleSingleCycle(ishandle);
                break;
            //随机播放
            case PlayWay.RandomPlay:
                this.handleRandomPlay();
                break;
            default:
                this.handleCyclePlay();
                break;
        }
    }
    /**
     * @desc 返回当前歌曲在队列中的下标
     */
    playSongIndex():number{
        const { playsong } = this;
        if (playsong) {
            return this.queue.findIndex(song => song.id === playsong.id);
        } else {
            return -1;
        }
    }
    handleCyclePlay() {
        let len = this.queue.length;
        let currentIndex = this.playSongIndex();
        if (currentIndex >= 0) {
            let next = (currentIndex + 1 + len) % len;
            this.playsong = this.queue[next];
        }
    }
    handleSingleCycle(ishandle?:boolean) {
        if (!ishandle) {
            return;
        }
        let index = this.playSongIndex();
        if (index !== -1) {
            let next = (this.queue.length + 1 + index) % this.queue.length;
            this.playsong = this.queue[next];
        }
    }
    handleRandomPlay() {
        if (this.queue.length <= 1) {
            return;
        }
        let priorIndex = this.playSongIndex();
        while (true) {
            let randomIndex = ~~(Math.random() * this.queue.length);
            if (priorIndex !== randomIndex) {
                this.playsong = this.queue[randomIndex];
                break;
            }
        }
    }
}
const playlist =new PlayList() ;

export default playlist;