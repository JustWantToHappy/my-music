import playlist from './playlist'
import { transUsTime } from '../utils/help'
import { observable, makeObservable, action, computed } from 'mobx'

class PlayController {
  //以下属性皆为正在播放的音乐的属性
  @observable private isplay: boolean = false //播放按钮的状态
  @observable private currentTime: number = 0 //播放音乐时间
  @observable private volume: number = 0.01 //音量
  @observable private isLock: boolean = false //是否锁住播放条
  @observable private audioRef: any //audio元素
  @observable private isDrag: boolean = false //是否拖动播放条
  @observable showVolume: boolean = false //显示隐藏音量条
  @observable collect: boolean = false //是否显示收藏框
  @observable showBar: boolean = false //展开收起播放条
  @observable olyric: Map<number, string> = new Map() //原歌词
  @observable tlyric: Map<number, string> = new Map() //翻译歌词

  constructor() {
    makeObservable(this)
  }
  /**
   * @desc 初始化操作
   */
  @action init(audio: any) {
    try {
      this.audioRef = audio
      this.volume = Number(localStorage.getItem('volume')!)
      this.audioRef.current.volume = this.volume
    } catch (err: any) {
      console.info(err.message)
    }
  }
  /**
   * @desc currentTime
   */
  @action setTime(time: number) {
    this.currentTime = time
  }
  @computed get time() {
    return this.currentTime
  }
  @action play() {
    this.isplay = true
  }
  @action pause() {
    this.isplay = false
  }

  @computed get isPlay() {
    return this.isplay
  }
  /**
   * @desc 改变音量
   */
  @action changeVolume(num: number) {
    let volume = num * 0.01
    this.volume = volume
    localStorage.setItem('volume', String(volume))
    this.audioRef.current.volume = volume
  }
  @computed get voice() {
    return this.volume * 100
  }
  @computed get showSloud() {
    return this.showVolume
  }
  @action setShowVoice(isshow:boolean) {
    this.showVolume = isshow
  }
  @action showVoiceChange() {
    this.showVolume=!this.showSloud
  }
  @action showCollect() {
    this.collect = !this.collect
  }
  /**
   * @desc 是否拖动进度条
   */
  @computed get draging() {
    return this.isDrag
  }
  @action changeDraging(isDrag = false) {
    this.isDrag = isDrag
  }

  /**
   * @desc 收起播放条
   */
  @action shrink() {
    this.showBar = false
    playlist.isShow = false
  }
  /**
   * @desc 展开播放条
   */
  @action expend() {
    this.showBar = true
  }
  /**
   * @desc 歌词
   */
  @action handleLyric(olyricStr: string, tlyricStr: string) {
    let timeOlyric = new Map<number, string>()
    let timeTlyric = new Map<number, string>()
    olyricStr.split('\n').forEach((str) => {
      let start = str.indexOf('[')
      let end = str.indexOf(']')
      if (start !== -1 && end !== -1 && end > start) {
        timeOlyric.set(
          transUsTime(str.substring(start + 1, end)),
          str.substring(end + 1),
        )
      }
    })
    tlyricStr.split('\n').forEach((str) => {
      let start = str.indexOf('[')
      let end = str.indexOf(']')
      let flag1 = str.substring(start, end).includes('.')
      let flag2 = str.substring(start, end).includes(':')
      if (start !== -1 && end !== -1 && end > start && flag1 && flag2) {
        timeTlyric.set(
          transUsTime(str.substring(start + 1, end)),
          str.substring(end + 1),
        )
      } else {
        timeTlyric.set(0, str.substring(end + 1))
      }
    })
    this.olyric = timeOlyric
    this.tlyric = timeTlyric
  }
  @action getLyric() {
    let lyricMap = new Map<number, { lyc: string; tlyc?: string }>()
    for (let key of this.olyric.keys()) {
      lyricMap.set(key, { lyc: this.olyric.get(key)! })
    }
    for (let key of this.tlyric.keys()) {
      let value = lyricMap.get(key)
      if (value) {
        value.tlyc = this.tlyric.get(key)
        lyricMap.set(key, value)
      }
    }
    return Array.from(lyricMap).sort((item1, item2) => {
      return item1[0] - item2[0]
    })
  }
  @computed get audio() {
    return this.audioRef
  }
}
const playcontroller = new PlayController()
export default playcontroller
