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
    @observable private isFree: boolean = true;//当前音乐是否为付费音乐
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
    @action add(song:Music.song) {
        if (!this.has(song.id)) {
            this.queue.push(song);
        } 
    }
    /**
     * 
     * @param id 歌曲id
     * @desc 删除歌曲
     */
    @action delete(id:number) {
        this.queue = this.queue.filter(song => song.id !== id);
    }
    /**
     * @desc 清空播放队列
     */
    @action clearAll() {
        this.queue = [];
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
        return this.queue.findIndex(song => song.id === id) !== -1;
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
    set state(state:boolean) {
        this.playstate = state;
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
     * @desc 得到当前播放的音乐在队列中的下标
     */
    @action getCurrentIndex() {
        
    }
    /**
     * @params {} ishandle 手动切歌还是自动切歌 
     * @desc 得到要播放的歌曲
     */
    getNextSong(ishandle?:boolean) {
        
    }
}
const playlist =new PlayList() ;

export default playlist;