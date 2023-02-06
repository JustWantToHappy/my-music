import { observable } from "mobx";
//四种播放方式
import { PlayWay } from "./constants";
//播放列表
class PlayList{
    private queue: Array<Music.song> = []
    private playway: string = "";// 当前播放列表的播放方式
    private playsong: Music.song | null = null;//当前正在播放的音乐
    private playstate: boolean = false;//当前音乐播放or暂停
    constructor() {
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
    add(song:Music.song) {
        if (this.queue.length === 0) {
            this.queue.push(song);
            return;
        }
        if (!this.has(song.id)) {
            this.queue.push(song);
            alert("添加成功,长度为:" + this.size);
        } else {
            console.log(this.queue);
            alert("添加失败,长度为:" + this.size);
        }
    }
    /**
     * 
     * @param id 歌曲id
     * @desc 删除歌曲
     */
    delete(id:number) {
        this.queue = this.queue.filter(song => song.id !== id);
    }
    /**
     * @desc 清空播放队列
     */
    clearAll() {
        this.queue = [];
    }
    /**
     * @desc 播放列表歌曲数
     */
    get size():number{
        return this.queue.length;
    }
    /**
     * @desc 检查歌曲是否已经加入到播放队列中
     */
    has(id:number): boolean{
        return this.queue.findIndex(song => song.id === id) !== -1;
    }
    /**
     * @desc 设置音乐播放方式
     */
    changePlayWay(way:string) {
        this.playway = way;
    }
    /**
     * @desc 播放暂停音乐
     */
    changePlayState() {
        this.playstate = !this.playstate;
    }
    /**
     * @desc 获取当前音乐的播放状态
     */
    get state() {
        return this.playstate;
    }
    /**
     * @desc 获取当前正在播放的歌曲
     */
    getCurrentSong() {
        return this.playsong;
    }
    /**
     * @desc 得到当前播放的音乐在队列中的下标
     */
    getCurrentIndex() {
        
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
const playlist =observable(new PlayList()) ;

export default playlist;