import { Pagination } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { PaginationProps } from 'antd'
import { transPlayCount } from '../../utils'
import { getListSong } from '../../api/songlist'
import playlist from '../../mobx/playlist'
import styles from './styles/songlist.module.scss'
import { fetchSongLists } from '../../api/recommond'
import playcontroller from '../../mobx/playcontroller'
import { debounce } from '../../utils/throttle_debounce'
import { useState, useEffect, useRef, useCallback } from 'react'
import { CustomerServiceOutlined, PlayCircleOutlined } from '@ant-design/icons'

export default function SongList(props: { tag: string; total: number }) {
  const { tag, total } = props
  const navigate = useNavigate()
  const [pageSize] = useState(35)
  const [current, setCurrent] = useState(1)
  const myRef = useRef<HTMLDivElement>(null)
  const [songLists, setSongLists] = useState<Array<Music.list>>([])

  //实现懒加载
  const loadImage = () => {
    const imgs = document.getElementsByClassName('songlist-image')
    const viewHeight = window.innerHeight || document.documentElement.clientHeight
    for (let i = 0; i < imgs.length; i++) {
      let distance = viewHeight - imgs[i].getBoundingClientRect().top
      if (distance >= 0 && imgs[i].getBoundingClientRect().top >= 0) {
        imgs[i].setAttribute('src', imgs[i].getAttribute('data-src') as string)
      }
    }
  }
  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page)
  }
  //点击播放按钮播放音乐
  const playMusic = (id: number) => {
    (async () => {
      const res = await getListSong(id)
      playlist.setPlayList(res.songs)
      playcontroller.play()
    })()
  }
  //点击封面前往歌单
  const playSongList = (id: number) => {
    navigate(`/playlist/${id}`)
  }
  useEffect(() => {
    (async () => {
      //more为true表示还有分页
      try {
        const { playlists, code } = await fetchSongLists(
          'hot',
          tag,
          pageSize,
          (current - 1) * pageSize,
        )
        if (code === 200) {
          setSongLists(playlists)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [tag, current, pageSize])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    loadImage()
  }, [songLists])

  useEffect(() => {
    const pageScrolling = () => {
      debounce(loadImage, 300)
    }

    window.addEventListener('scroll', pageScrolling)
    return function () {
      window.removeEventListener('scroll', pageScrolling)
    }
  }, [])

  return (
    <>
      <div className={styles.songlist} ref={myRef}>
        {songLists.map((songlist) => {
          return (
            <div key={songlist.id}>
              <div className={styles.content}>
                <img
                  data-src={songlist.coverImgUrl}
                  alt="加载中..."
                  className="songlist-image"
                  onClick={() => playSongList(songlist.id)}
                />
                <div>
                  <span>
                    <CustomerServiceOutlined />
                    <span>{transPlayCount(songlist.playCount)}</span>
                  </span>
                  <span>
                    <PlayCircleOutlined
                      onClick={() => {
                        playMusic(songlist.id)
                      }}
                    />
                  </span>
                </div>
              </div>
              <span onClick={() => playSongList(songlist.id)}>
                {songlist.name}
              </span>
            </div>
          )
        })}
      </div>
      <footer className={styles.footer}>
        <Pagination
          current={current}
          onChange={onChange}
          total={total}
          pageSize={pageSize}
          hideOnSinglePage
          showSizeChanger={false}
        />
      </footer>
    </>
  )
}
