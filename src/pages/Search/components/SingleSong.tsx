import { useState, useEffect } from 'react'
import { Table, Pagination } from 'antd';
import { PlayCircleOutlined } from "@ant-design/icons"
import dayjs from 'dayjs';
import styles from "../styles/single_song.module.scss"
import { getSearchContent } from "../../../api/search"
const { Column } = Table;
export default function SingleSong(props: { keywords: string | null }) {
  const [search, setSearch] = useState("");
  //当前页码
  const [current, setCurrent] = useState(1);
  //词条总数
  const [total, setTotal] = useState(0);
  //每页显示条数
  const [pageSize] = useState(30);
  if (search !== props.keywords) {
    setCurrent(1);
    props.keywords && setSearch(props.keywords);
  }
  const [songs, setSongs] = useState<Array<Music.song>>();
  const getData = (page: number) => {
    (async () => {
      const res = await getSearchContent(search, page, 30);
      if (res.code === 200) {
        let songs = res.result.songs.map((song: Music.song, index: number) => {
          return { ...song, key: index };
        })
        setSongs(songs);
        setTotal(res.result.songCount);
      }
    })();
  }
  useEffect(() => {
    getData(current);
  }, [search]);
  //当切换不同页码时调用
  const changeCurrentPage = (page: number) => {
    setCurrent(page);
    getData(page);
  }
  return (
    <div className={styles.songs}>
      <Table dataSource={songs} showHeader={false} pagination={false} >
        <Column title="歌曲名称" dataIndex="name" key="name" render={(name: string) => (
          <>
            <span className={styles.playLogo}>
              <PlayCircleOutlined />
            </span>
            <span >{name}</span>
          </>
        )} />
        <Column title="歌手名称" dataIndex="ar" key="ar" render={(singers: Music.singer[]) => (
          <>
            {singers.map(singer => singer.name).slice(0, 2).map((name: string, index: number) => {
              return <span key={index} className={styles.singername}>{name}{index === 0 && singers.length >= 2 && '/'}</span>
            })}
          </>
        )} />
        <Column title="歌曲名称" dataIndex="al" key="al" render={(al: Music.album) => (
          <>
            <span className={styles.songname}>《{al.name}》</span>
          </>
        )} />
        <Column
          title="时长"
          key="dt"
          dataIndex="dt"
          render={(content: number) => (
            <>
              {dayjs(content).format("mm:ss")}
            </>
          )}
        />
      </Table>
      {/* 分页器 */}
      <div className={styles.pagination}>
        <Pagination current={current} total={total} pageSize={pageSize} showSizeChanger={false} hideOnSinglePage onChange={changeCurrentPage} />
      </div>
    </div>
  )
}
