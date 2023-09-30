//全局常量
//播放方式
export enum PlayWay {
  Cycle = '1',
  SingleCycle = '2',
  RandomPlay = '3',
}
//搜索类型
export enum Search {
  SingleSong = 1,
  Album = 10,
  Singer = 100,
  SongList = 1000,
  User = 1002,
  MV = 1004,
  Lyric = 1006,
  Station = 1009,
}
//用于组件间通信的指令
export enum Signal {
  PlayMusic = 'playmusic',
  ShowPlayBar = 'showplaybar',
}
