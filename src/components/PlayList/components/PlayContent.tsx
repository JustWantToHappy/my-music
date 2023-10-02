import React from 'react'
import { observer } from 'mobx-react'
import {
  DeleteOutlined,
  CaretRightOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import styles from '../index.module.scss'
import playlist from '../../../mobx/playlist'
import { transTime } from '../../../utils/help'
import playcontroller from '../../../mobx/playcontroller'

const PlayContent = observer(() => {
  const itemHeight = 27
  const clientHeight = 270
  const extraRenderItemCount = 5
  const { size, songs, song: playSong } = playlist
  const Ref = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  const deleteSong = (event: React.MouseEvent, id: number) => {
    event.stopPropagation()
    playlist.delete(id)
  }

  const playMusic = (song: Music.song) => {
    playlist.song = song
    playcontroller.play()
  }

  const pageScrolling = (event: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = (event.target as HTMLDivElement).scrollTop
    setScrollTop(currentScrollTop)
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
      size,
    )
  }, [scrollTop, size])

  const top = React.useMemo(() => {
    return itemHeight * start
  }, [start])

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
          <ul style={{ transform: `translateY(${top + 'px'})` }}>
            {songs.slice(start, end).map((song, index) => {
              return (
                <li
                  data-id={start + index}
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
})

export default PlayContent