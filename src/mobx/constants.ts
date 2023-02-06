//全局常量
import { observable } from "mobx"
//播放方式
export enum PlayWay {
    ListPlay = '1',
    OrderPlay = '2',
    SingleCycle = '3',
    RandomPlay = '4'
}
//搜索类型
export enum Search {
    SingleSong=1,
    Album = 10,
    Singer = 100,
    SongList = 1000,
    User = 1002,
    MV = 1004,
    Lyric = 1006,
    Station = 1009
}
const constantsStore = {
    publicURL: "http://localhost:5000",
    playWay:PlayWay,
    SearchList:Search
}
export default observable(constantsStore);