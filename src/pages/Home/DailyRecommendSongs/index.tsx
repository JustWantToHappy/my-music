import React from 'react'
import styles from "./index.module.scss"
import { useEffect, useState } from "react"
import { fetchMyRecommendSongs } from "../../../api/song"
import { transNumber } from "../../../utils"
import Song from '../../../components/Songs'
export default function DialyRecommendSongs() {
  const imgURL = "https://s2.music.126.net/style/web2/img/recmd_daily.jpg?4e81712128eba924d46a387f65a88901";
  const [songs, setSongs] = useState<Array<Music.song>>([]);
  useEffect(() => {
    (async () => {
      const res = await fetchMyRecommendSongs();
      console.log(res);
      if (res.code === 200) {
        let arr: Array<Music.song> = res.data.dailySongs;
        setSongs(arr.map((song, index) => {
          return Object.assign(song, { index: index + 1, key: index });
        }))
      }
    })();
  }, []);
  return (
    <div className={styles.dialy}>
      <div >
        <img src={imgURL} alt="图片无法显示" />
        <div>
          <span>
            星期{transNumber(new Date().getDay())}
          </span>
          <span>
            {new Date().getDate()}
          </span>
        </div>
        <i>开始听歌吧！</i>
      </div>
      <span className={styles.head}>
        <h3>歌曲列表</h3>
        <small>{songs.length}首歌</small>
      </span>
      <span className={styles.divider}></span>
      <div className={styles.list}>
        <Song songs={songs} />
      </div>
    </div>
  )
}
