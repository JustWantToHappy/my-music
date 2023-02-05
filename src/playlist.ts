//播放列表
export default class PlayList{
    private queue:Array<Music.song>= []
    constructor(songs:Music.song[]) {
        this.queue = songs;
    }
    /**
     * @desc 添加歌曲
     */
    add(song:Music.song) {
        this.queue.push(song);
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
    getSize():number{
        return this.queue.length;
    }
}