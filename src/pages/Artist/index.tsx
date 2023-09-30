import styles from './index.module.scss'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Song from '../../components/Songs'
import { fetchUserDetail } from '../../api/user'
import {
  fetchSingerDetails,
  fetchAllSongBySingerId,
  fetchFiftySongs,
  fetchSingerDes,
} from '../../api/artist'
import { Tabs } from 'antd'
import React from 'react'

const { TabPane } = Tabs
const Artist = () => {
  const [search] = useSearchParams()
  const id = search.get('id') as string
  var level: number //用户等级
  //歌手
  const [singer, setSinger] = useState<Music.singer>()
  //歌手的其他信息
  const [user, setUser] = useState<User.account>()
  //歌手所有歌曲
  const [songs, setSongs] = useState<Array<Music.song>>([])
  //歌手50首热门歌曲
  const [fiftySongs, setFifty] = useState<Array<Music.song>>([])
  //歌手介绍
  const [desc, setDesc] = useState('')
  const handleResponse = (res: any): Array<Music.song> => {
    if (res.code === 200) {
      let arr: Array<Music.song> = []
      for (let i = 0; i < res.songs.length; i++) {
        let song = { ...res.songs[i], index: i + 1, key: i }
        arr.push(song)
      }
      return arr
    }
    return []
  }
  const getAllSongs = async () => {
    let res = await fetchAllSongBySingerId(id)
    setSongs(handleResponse(res))
  }
  const getFiftySongs = async () => {
    let res = await fetchFiftySongs(id)
    setFifty(handleResponse(res))
  }
  const getSingerDes = async () => {
    let res = await fetchSingerDes(id)
    setDesc(res.briefDesc)
  }
  //点击不同tab时调用
  const onChange = (key: string) => {
    if (key === '1' && songs.length === 0) {
      getAllSongs()
    } else if (key === '2' && fiftySongs.length === 0) {
      getFiftySongs()
    } else if (key === '3' && desc === '') {
      getSingerDes()
    }
  }
  useEffect(() => {
    ;(async () => {
      let res = await fetchSingerDetails(id)
      const { artist } = res.data
      let per: Music.singer
      if (res.code === 200) {
        console.log(res, 'hhh')
        per = { ...artist, ...res.data }
        setSinger(per)
        getAllSongs()
        const response = await fetchUserDetail(per.user.userId)
        // console.log(response, 'zzz');
        setUser(response.profile)
      }
    })()
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className={styles.artist}>
      <div className={styles.content}>
        <header>
          <div>
            <img src={singer && singer.cover} alt="logo" />
          </div>
          <div>
            <p>
              <h2>{singer?.name}</h2>
              <h4>{user?.followed ? '已' : '未'}关注</h4>
              <div>
                <span>粉丝数量：</span>
                <span style={{ color: '#f53f3f' }}> {user?.followeds}</span>
              </div>
            </p>
            <span></span>
            <div>
              <small>歌曲数量:{singer?.musicSize}</small>
              <small>专辑数量:{singer?.albumSize}</small>
              <small>mv数量:{singer?.mvSize}</small>
            </div>
            <footer>
              <p>个人介绍：{user?.description || '无'}</p>
              <p>所在地区:{'xxxxx'}</p>
            </footer>
          </div>
        </header>
        <hr />
        <Tabs defaultActiveKey="1" onChange={onChange}>
          <TabPane tab="全部歌曲" key="1">
            <div className={styles.songs}>
              <Song songs={songs} />
            </div>
          </TabPane>
          <TabPane tab="热门50首" key="2">
            <div>
              <Song songs={fiftySongs} />
            </div>
          </TabPane>
          <TabPane tab="艺人介绍" key="3">
            <div className={styles.description}>
              <span>{desc}</span>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}
//歌手
export default Artist
