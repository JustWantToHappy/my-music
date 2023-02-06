import { observable ,makeObservable, action,computed} from "mobx";
//四种播放方式
import { PlayWay } from "./constants";
/**
 * @desc 播放列表
 * 总结一下如果使用修饰器的话，
 * getter和setter只能够适用@computed，而其他方法要使用@action
 * 建议不要在业务代码中直接设置store中的值(可以用setter或者一个函数)
 * 
 */
class PlayList{
    @observable private queue: Array<Music.song> = []
    @observable private playway: string = "";// 当前播放列表的播放方式
    @observable private playsong: Music.song | null = null;//当前正在播放的音乐
    @observable private playstate: boolean = false;//当前音乐播放or暂停
    constructor() {
        makeObservable(this);
        try {
            const songs = JSON.parse(localStorage.getItem("songs")!) || [];
            this.queue = songs;
        } catch (err) {
            console.info(err);
        }
        this.playway = localStorage.getItem("playway") || PlayWay.ListPlay;
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
    @action changePlayWay(way:string) {
        this.playway = way;
    }
    /**
     * @desc 播放暂停音乐
     */
    set state(state:boolean) {
        this.playstate = state;
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
        switch (this.playway) {
            // 列表播放
            case PlayWay.ListPlay:
                this.handleListPlay();
                break;
            //顺序播放
            case PlayWay.OrderPlay:
                this.handleOrderPlay();
                break;
            //随机播放
            case PlayWay.RandomPlay:
                this.handleRandomPlay();
                break;
            //循环播放
            case PlayWay.SingleCycle:
                this.handleSingleCycle(ishandle||false);
                break;
            default:
                this.handleListPlay();
                break;
        }
    }
    /**
     * @desc 列表播放
     */
    handleListPlay() {
        
    }
    /**
     * @descc 顺序播放
     */
    handleOrderPlay() {

    }
    /**
     * @desc 随机播放
     */
    handleRandomPlay() {
        
    }
    /**
     * @desc 单曲循环
     */
    handleSingleCycle(ishandle:boolean) {
        
    }
}
const playlist =new PlayList() ;

export default playlist;