import React, { useState, useEffect } from 'react'
import { Table, Pagination } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlayCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import styles from '../styles/single_song.module.scss'
import { getSearchContent } from '../../../api/search'
import { addLocalStorage } from '../../../utils/authorization'
import PubSub from 'pubsub-js'
const { Column } = Table
export default function SingleSong(props: { keywords: string | null }) {
  const [search, setSearch] = useState('')
  //当前页码
  const [current, setCurrent] = useState(1)
  //词条总数
  const [total, setTotal] = useState(0)
  //每页显示条数
  const [pageSize] = useState(30)
  //用于表示当前正在播放的音乐
  const [id, setId] = useState(0)
  const navigate = useNavigate()
  if (search !== props.keywords) {
    setCurrent(1)
    props.keywords && setSearch(props.keywords)
  }
  const [songs, setSongs] = useState<Array<Music.song>>()
  const getData = (page: number) => {
    ;(async () => {
      const res = await getSearchContent(search, page, 30)
      if (res.code === 200) {
        let songs = res.result.songs.map((song: Music.song, index: number) => {
          return { ...song, key: index }
        })
        setSongs(songs)
        setTotal(res.result.songCount)
      }
    })()
  }
  useEffect(() => {
    getData(current)
  }, [search])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  //当切换不同页码时调用
  const changeCurrentPage = (page: number) => {
    setCurrent(page)
    getData(page)
  }
  //点击播放音乐
  const playMusic = (song: Music.song, e: React.MouseEvent) => {
    setId(song.id)
    let items = [
      { key: 'isPlay', value: 'true' },
      { key: 'song', value: JSON.stringify(song) },
      { key: 'songs', value: JSON.stringify([song]) },
    ]
    addLocalStorage(items)
    PubSub.publish('play', true)
  }
  return (
    <div className={styles.songs}>
      <Table dataSource={songs} showHeader={false} pagination={false}>
        <Column
          title="歌曲名称"
          dataIndex="name"
          key="name"
          render={(name: string, currentSong: Music.song) => (
            <>
              <span
                className={styles.playLogo}
                onClick={(e) => playMusic(currentSong, e)}
              >
                <PlayCircleOutlined
                  style={
                    id === currentSong.id
                      ? { color: '#f53f3f', opacity: 1 }
                      : {}
                  }
                />
                <span>{name}</span>
              </span>
            </>
          )}
        />
        <Column
          title="歌手名称"
          dataIndex="ar"
          key="ar"
          render={(singers: Music.singer[]) => (
            <>
              {singers
                .slice(0, 2)
                .map((singer: Music.singer, index: number) => {
                  return (
                    <span
                      key={index}
                      className={styles.singername}
                      onClick={() => {
                        navigate(`/artist?id=${singer.id}`)
                      }}
                    >
                      {singer.name}
                      {index === 0 && singers.length >= 2 && '/'}
                    </span>
                  )
                })}
            </>
          )}
        />
        <Column
          title="专辑"
          dataIndex="al"
          key="al"
          render={(al: Music.album) => (
            <>
              <span
                className={styles.songname}
                onClick={() => {
                  navigate(`/home/album?id=${al.id}`)
                }}
              >
                《{al.name}》
              </span>
            </>
          )}
        />
        <Column
          title="时长"
          key="dt"
          dataIndex="dt"
          render={(content: number) => <>{dayjs(content).format('mm:ss')}</>}
        />
      </Table>
      {/* 分页器 */}
      <div className={styles.pagination}>
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          hideOnSinglePage
          onChange={changeCurrentPage}
        />
      </div>
    </div>
  )
}
