import React from 'react'
import type { Props } from '../index'
import { observer } from 'mobx-react'
import styles from '../index.module.scss'
import playlist from '../../../mobx/playlist'
import { getLyricBySongId } from '../../../api/song'
import playcontroller from '../../../mobx/playcontroller'
import { CloseCircleOutlined } from '@ant-design/icons'

export default observer(function Lyric({ container }: Props) {
  const itemHeight = 60
  const paddingTopHeight = 40
  const { song } = playlist
  const recoverAutoScrollInterval = 5000 //用户滚动后恢复自动滚动间隔
  const { isPlay, time } = playcontroller
  const timerRef = React.useRef<number | null>()
  const mouseWheelRef = React.useRef(false)
  const lyricRef = React.useRef<HTMLDivElement>(null)
  const thumbRef = React.useRef<HTMLSpanElement>(null)
  const userDragScrollBarThumbRef = React.useRef(false)
  const [autoScroll, setAutoScroll] = React.useState(true)
  const [thumbTop, setThumbTop] = React.useState(0)
  const [playIndex, setPlayIndex] = React.useState<number>(0)
  const [lyric, setLyric] = React.useState<
    Array<[number, { lyc: string; tlyc?: string }]>
  >([])

  //使用二分查找，根据现在的时间确定时间轴上的歌词,返回一个下标
  const binarySearchLyric = React.useCallback(
    (time: number) => {
      if (!lyric) return 0
      const targetTime = time * 1000 // 将时间单位转换为微秒
      let left = 0,
        right = lyric.length - 1,
        ans = 0
      while (left <= right) {
        let mid = Math.floor((left + right) / 2)
        if (lyric[mid][0] <= targetTime) {
          ans = mid
          left = mid + 1
        } else {
          right = mid - 1
        }
      }
      return ans
    },
    [lyric],
  )

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  //恢复自动滚动
  const recoverAutoScroll = () => {
    timerRef.current = window.setTimeout(() => {
      setAutoScroll(true)
      mouseWheelRef.current = false
    }, recoverAutoScrollInterval)
  }

  const handleUserScroll = () => {
    clearTimer()
    if (mouseWheelRef.current || userDragScrollBarThumbRef.current) {
      setAutoScroll(false)
    }
    recoverAutoScroll()
  }

  const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    const { height } = (
      thumbRef.current as HTMLSpanElement
    ).getBoundingClientRect()
    mouseWheelRef.current = true
    setThumbTop(
      Math.min(
        clientHeight - height,
        (scrollTop / scrollHeight) * clientHeight,
      ),
    )
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    userDragScrollBarThumbRef.current = true
  }

  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    if (
      userDragScrollBarThumbRef.current &&
      lyricRef.current &&
      thumbRef.current
    ) {
      event.preventDefault()
      const { top, height } = lyricRef.current.getBoundingClientRect()
      thumbRef.current.style.transition = 'none'
      let thumbTop = event.clientY - top
      if (thumbTop < 0) thumbTop = 0
      thumbTop = Math.min(thumbTop, height - thumbRef.current.clientHeight)
      lyricRef.current.style.scrollBehavior = 'auto'
      lyricRef.current.scrollTop =
        (thumbTop / height) * lyricRef.current.scrollHeight
      setThumbTop(thumbTop)
      clearTimer()
    }
  }, [])

  const thumbHeight = React.useMemo(() => {
    let ratio = 1
    if (lyricRef.current)
      ratio =
        lyricRef.current.clientHeight /
        (lyric.length * itemHeight + paddingTopHeight)
    return ratio >= 1 ? 0 : ratio * lyricRef.current!.clientHeight
  }, [lyric])

  const handleDocumentMouseUp = React.useCallback((event: MouseEvent) => {
    if (
      userDragScrollBarThumbRef.current &&
      thumbRef.current &&
      lyricRef.current
    ) {
      userDragScrollBarThumbRef.current = false
      thumbRef.current.style.transition = 'top ease 50ms'
      lyricRef.current.style.scrollBehavior = 'smooth'
      recoverAutoScroll()
    }
    playcontroller.setShowVoice(false)
  }, [])

  React.useMemo(() => {
    const lyricEle = lyricRef.current
    const thumbEle = thumbRef.current
    if (lyricEle && thumbEle) {
      const scrollTop = Math.max(
        playIndex * itemHeight + paddingTopHeight - lyricEle.clientHeight / 2,
        0,
      )
      lyricEle.scrollTop = scrollTop
      !userDragScrollBarThumbRef.current &&
        setThumbTop(
          Math.min(
            ((paddingTopHeight + playIndex * itemHeight) /
              lyricEle.scrollHeight) *
              lyricEle.clientHeight,
            lyricEle.clientHeight - thumbEle.clientHeight,
          ),
        )
    }
  }, [playIndex])

  React.useEffect(() => {
    ;(async () => {
      const res = await getLyricBySongId(song.id)
      playcontroller.handleLyric(
        res.lrc.lyric,
        res.tlyric ? res.tlyric.lyric : '',
      )
      setLyric(playcontroller.getLyric())
    })()

    document.documentElement.addEventListener('mouseup', handleDocumentMouseUp)
    document.body.addEventListener('mousemove', handleMouseMove)
    return function () {
      document.documentElement.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseup', handleDocumentMouseUp)
    }
  }, [song.id, handleMouseMove, container, handleDocumentMouseUp])

  React.useEffect(() => {
    if (autoScroll && isPlay && lyricRef.current) {
      const index = binarySearchLyric(time)
      setPlayIndex(index)
    }
  }, [autoScroll, isPlay, binarySearchLyric, time])

  return (
    <div className={styles.lyric}>
      <header>
        <span>{song.name}</span>
        <span>
          <CloseCircleOutlined onClick={() => (playlist.isShow = false)} />
        </span>
      </header>
      <div
        ref={lyricRef}
        className={styles['lyric-content']}
        style={{ padding: `${paddingTopHeight}px 0` }}
        onScroll={handleUserScroll}
        onWheel={handleWheelScroll}
      >
        {lyric?.map(([time, { lyc, tlyc }], index) => {
          return (
            <p
              key={time}
              style={
                playIndex === index
                  ? {
                      height: `${itemHeight}px`,
                      fontSize: '1rem',
                      color: '#fff',
                      fontWeight: 'bolder',
                    }
                  : {
                      height: `${itemHeight}px`,
                    }
              }
            >
              <small>{lyc}</small>
              <br />
              <small>{tlyc}</small>
            </p>
          )
        })}
        {/* 模拟滚动条实现 */}
        <div className={styles['scrollbar-track']}>
          <span
            ref={thumbRef}
            style={{
              height: `${thumbHeight}px`,
              top: `${thumbTop}px`,
              minHeight: `${thumbHeight && 10}px`,
            }}
            onMouseDown={handleMouseDown}
            className={styles['scrollbar-thumb']}
          ></span>
        </div>
      </div>
    </div>
  )
})
