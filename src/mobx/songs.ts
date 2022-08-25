//用于存放整个歌单的歌曲
import { observable } from "mobx";
const songsStore: { data: Array<Music.song>, origin: string } = {
    data: [],
    origin: ""//用于判断播放列表的歌曲是来自歌单还是来自个性推荐
};
export default observable(songsStore);