import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Pagination } from "antd"
import { PlayCircleTwoTone } from "@ant-design/icons"
import { getSearchContent } from "../../../api/search"
import styles from "../styles/album.module.scss"
import constantsStore from "../../../mobx/constants"
import { getRealURL } from "../../../utils/help"
import playlist from "../../../utils/playlist"
import songsStore from "../../../mobx/songs"
export default function Album(props: { keywords: string | null }) {
  const { keywords } = props;
  const { SearchList } = constantsStore;
  //搜索的字段
  const [search,setSearch]=useState("");
  const navigate = useNavigate();
  //搜索到的专辑
  const [albums, setAlbums] = useState<Array<Music.album>>([]);
  //表示当前页码
  const [current, setCurrent] = useState(1);
  //表示每一页有多少条记录
  const pageSize = 40;
  //搜索总条数
  const [total, setTotal] = useState(0);
  //用于表示当前鼠标正悬在此专辑上
  const [id, setId] = useState(0);
  const getData = async (page?: number) => {
    // console.log(keywords,'sb')
    const res = await getSearchContent(keywords as string, page || current, pageSize, SearchList.Album);
    if (res.code === 200) {
      albums.length === 0 && setTotal(res.result.albumCount);
      setAlbums(res.result.albums);
    }
  }
  if(keywords!==search){
    getData();
    setSearch(keywords as string);
  }
  useEffect(() => {
    try {
      let imgs: string[];
      imgs = albums.map((album: Music.album) => album.blurPicUrl);
      const elements = document.getElementsByClassName("albumImage");
      getRealURL(imgs, elements);
    } catch (e) {
      console.log(e);
    }
  }, [albums])
  //当切换页面时触发
  const changeCurrentPage = (page: number) => {
    setCurrent(page);
    getData(page);
  }
  //播放音乐
  const playMusic = (id: number) => {
    songsStore.origin = 'home'
    playlist(id,"album");
  }
  return (
    <>
      <div className={styles.album} >
        {albums.map((album) => {
          return <li className={styles.content} key={album.id} >
            <div className={styles.image} onMouseLeave={() => setId(0)}>
              <img
                src={require("../../../assets/img/loading.gif")}
                alt="图片无法显示" onMouseOver={() => setId(album.id)}
                className={"albumImage"}
                onClick={() => navigate(`/home/album?id=${album.id}`)}
              />
              <i> {id === album.id && <PlayCircleTwoTone onClick={() => { playMusic(album.id) }} />}</i>
              <i></i>
            </div>
            <span onClick={() => { navigate(`/home/album?id=${album.id}`) }}>{album.name}</span>
            <span onClick={() => { navigate(`/artist?id=${album.artist.id}`) }}>{album.artist.name}</span>
          </li>
        })}
      </div>
      <div className={styles.pagination}>
        <Pagination defaultCurrent={current} total={total} pageSize={pageSize} onChange={(page) => { changeCurrentPage(page) }} showSizeChanger={false} size='small' hideOnSinglePage={true} />
      </div>
    </>
  )
}
