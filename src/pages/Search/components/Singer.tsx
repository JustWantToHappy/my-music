import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSearchContent } from '../../../api/search'
import { Search } from '../../../mobx/constants'
import { getImgRealSrc } from '../../../utils/help'
import { Pagination } from 'antd'
import styles from '../styles/singer.module.scss'
export default function Singer(props: { keywords: string | null }) {
  const { keywords } = props
  const myRef = useRef(null)
  //搜索的字段
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  //当前页码
  const [current, setCurrent] = useState(1)
  //每页条数
  const [pageSize] = useState(90)
  //搜索总数
  const [total, setTotal] = useState(0)
  //搜索的歌手数据
  const [singer, setSinger] = useState<Array<Music.singer>>()
  const getData = () => {
    ;(async () => {
      const res = await getSearchContent(
        keywords as string,
        current,
        pageSize,
        Search.Singer,
      )
      if (res.code === 200) {
        setSinger(res.result.artists)
        setTotal(res.result.artistCount)
      }
    })()
  }
  if (keywords !== search) {
    getData()
    setSearch(keywords as string)
  }
  //切换页码时触发
  const changePage = async (page: number) => {
    const res = await getSearchContent(
      keywords as string,
      page,
      pageSize,
      Search.Singer,
    )
    if (res.code === 200) {
      setSinger(res.result.artists)
    }
    setCurrent(page)
  }
  return (
    <>
      <div className={styles.singer} ref={myRef}>
        {singer?.map((artist) => {
          return (
            <div key={artist.id} className={styles.artist}>
              <img
                onClick={() => navigate(`/artist?id=${artist.id}`)}
                data-src={artist.picUrl}
                src={require('../../../assets/img/loading.gif')}
                alt="加载中..."
                ref={(current) => {
                  getImgRealSrc(current)
                }}
              />
              <span onClick={() => navigate(`/artist?id=${artist.id}`)}>
                {artist.name}
              </span>
            </div>
          )
        })}
      </div>
      <div className={styles.pagination}>
        <Pagination
          defaultCurrent={current}
          total={total}
          showSizeChanger={false}
          pageSize={pageSize}
          onChange={(page: number) => {
            changePage(page)
          }}
          hideOnSinglePage={true}
        />
      </div>
    </>
  )
}
