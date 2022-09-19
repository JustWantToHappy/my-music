import { useState, } from 'react'
import { useNavigate } from "react-router-dom"
import ConstantsStore from "../../../mobx/constants"
import { Pagination, Tooltip } from "antd"
import { VideoCameraOutlined } from "@ant-design/icons"
import { getSearchContent } from "../../../api/search";
import dayjs from 'dayjs';
import styles from "../styles/video.module.scss"
export default function Video(props: { keywords: string | null }) {
  const { keywords } = props;
  const { SearchList } = ConstantsStore;
  const navigate = useNavigate();
  //搜索字段
  const [search, setSearch] = useState("");
  //当前页
  const [current, setCurrent] = useState(1);
  //默认每页条数
  const [size, setSize] = useState(20);
  //总条数
  const [total, setTotal] = useState(0);
  //视频
  const [video, setVideo] = useState<Array<Music.mv>>([]);
  //获取数据
  const getData = (page: number) => {
    (async () => {
      const res = await getSearchContent(keywords as string, page, size, SearchList.MV)
      console.log(res,'test')
      if (res.code === 200) {
        setTotal(res.result.mvCount);
        setVideo(res.result.mvs);
      }
    })();
  }
  if (keywords !== search) {
    getData(current);
    setSearch(keywords as string);
  }
  //切换页码
  const changeCurrentPage = (page: number) => {
    getData(page);
  }
  return (
    <>
      <ul className={styles.videos}>
        {video && video.map(per => {
          return <li key={per.id}>
            <img src={per.cover} alt="logo" onClick={() => { navigate(`/mv?id=${per.id}`) }} />
            <i>
              <VideoCameraOutlined />
              <span>{per.playCount}</span>
            </i>
            <span onClick={() => { navigate(`/mv?id=${per.id}`) }}>
              <Tooltip placement="bottomLeft" title={per.name} color='gray'>
                {per.name}
              </Tooltip>
            </span>
            <small>{per.artistName}</small>
            <time>{dayjs(per.duration).format("mm:ss")}</time>
          </li>
        })}
      </ul>
      <div className={styles.pagination}>
        <Pagination defaultCurrent={current} total={total} pageSize={size} onChange={(page) => { changeCurrentPage(page) }} showSizeChanger={false} hideOnSinglePage={true} />
      </div>
    </>
  )
}
