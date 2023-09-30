import React from 'react'
import { flushSync } from 'react-dom'
import {
  DeleteOutlined,
  CaretRightOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import styles from '../index.module.scss'
import playlist from '../../../mobx/playlist'
import { transTime } from '../../../utils/help'
import playcontroller from '../../../mobx/playcontroller'

//播放列表组件(长列表)
export default function PlayContent() {
  const itemHeight = 32
  const clientHeight = 265
  const extraRenderItemCount = 5
  const { size, songs, song: playSong } = playlist
  const Ref = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  const deleteSong = (event: React.MouseEvent, id: number) => {
    event.stopPropagation()
    playlist.delete(id)
  }

  console.info(songs.length, 'test')
  const playMusic = (song: Music.song) => {
    playlist.song = song
    playcontroller.play()
  }

  const pageScrolling = (event: React.UIEvent<HTMLDivElement>) => {
    flushSync(() => {
      const currentScrollTop = (event.target as HTMLDivElement).scrollTop
      if (currentScrollTop !== scrollTop) setScrollTop(currentScrollTop)
    })
  }

  const start = React.useMemo(() => {
    return Math.max(
      Math.floor(scrollTop / itemHeight) - extraRenderItemCount,
      0,
    )
  }, [scrollTop])

  const end = React.useMemo(() => {
    return Math.min(
      Math.floor((scrollTop + clientHeight) / itemHeight) +
        extraRenderItemCount,
      size - 1,
    )
  }, [scrollTop, size])

  const translateY = React.useMemo(() => {
    return Math.max(scrollTop - extraRenderItemCount * itemHeight, 0)
  }, [scrollTop])

  return (
    <div className={styles.content}>
      <header>
        <span>播放列表({size})</span>
        <div>
          <span>
            <DeleteOutlined />
          </span>
          <span onClick={() => playlist.clearAll()}>清除</span>
        </div>
      </header>
      {size === 0 && <p>你还没有添加任何歌曲</p>}
      <div
        style={{ height: `${clientHeight}px` }}
        onScroll={pageScrolling}
        className={styles.songlist}
      >
        <div ref={Ref} style={{ height: songs.length * itemHeight + 'px' }}>
          <ul style={{ transform: `translateY(${translateY + 'px'})` }}>
            {songs.slice(start, end).map((song) => {
              return (
                <li
                  key={song.id}
                  className={styles.song}
                  style={
                    song.id === playSong.id
                      ? {
                          background: 'rgba(0,0,0,0.8)',
                          height: `${itemHeight}px`,
                        }
                      : { height: `${itemHeight}px` }
                  }
                  onClick={() => playMusic(song)}
                >
                  <span
                    style={song.id === playSong.id ? { color: '#f53f3f' } : {}}
                  >
                    {song.id === playSong.id && <CaretRightOutlined />}
                  </span>
                  <span>
                    {song.name}
                    {/*<a href="#" title={song.name}>{song.name}</a>*/}
                  </span>
                  <span>
                    <i>
                      <HeartOutlined />
                    </i>
                    <i onClick={(e) => deleteSong(e, song.id)}>
                      <DeleteOutlined />
                    </i>
                  </span>
                  <span>
                    {song.ar && song.ar.map((ar) => ar.name).join('/')}
                    {/*<a href="#" title={song.ar && song.ar.map(ar => ar.name).join("/")}>
                                        </a>*/}
                  </span>
                  <span>{transTime(song.dt, 2)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
