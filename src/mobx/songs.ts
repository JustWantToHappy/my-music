//用于存放整个歌单的歌曲
import { observable } from "mobx";
const songsStore: { data: Array<Music.song> } = {
    data: []
};
export default observable(songsStore);