import { useState, useEffect, useRef, } from 'react'
import { useNavigate } from "react-router-dom"
import { Pagination } from "antd"
import { CustomerServiceOutlined, PlayCircleOutlined } from "@ant-design/icons"
import type { PaginationProps } from 'antd';
import styles from "./styles/songlist.module.scss"
import { fetchSongLists } from "../../api/recommond"
import { transPlayCount } from "../../utils"
import { debounce } from "../../utils/throttle_debounce"
export default function SongList(props: { cat: string, total: number }) {
    const { cat, total } = props;
    const navigate = useNavigate();
    //当前标签
    const [tag, setTag] = useState(cat);
    //每页显示的歌单数量
    const [pageSize] = useState(35);
    //当前页
    const [current, setCurrent] = useState(1);
    //存放歌单
    const [songLists, setSongLists] = useState<Array<Music.list>>([])
    //当前容器
    const myRef = useRef<HTMLDivElement>(null);
    //实现懒加载
    const loadImage = () => {
        //获取所有图片
        const imgs = document.getElementsByClassName("songlist-image");
        //获取可视高度
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        for (let i = 0; i < imgs.length; i++) {
            let distance = viewHeight - imgs[i].getBoundingClientRect().top;
            if (distance >= 0 && imgs[i].getBoundingClientRect().top >= 0) {
                imgs[i].setAttribute("src", imgs[i].getAttribute("data-src") as string);
            }
        }
    }
    //重新渲染页面
    if (cat !== tag) {
        setTag(cat);
    }
    //点击不同页码时候触发
    const onChange: PaginationProps['onChange'] = page => {
        setCurrent(page);
    };
    //点击播放按钮播放音乐
    const playMusic = (id: number) => {
    }
    //点击封面前往歌单
    const playSongList = (id: number) => {
        navigate(`/playlist/${id}`);
    }
    useEffect(() => {
        (async () => {
            //more为true表示还有分页
            try {
                const { playlists, code } = await fetchSongLists('hot', cat, pageSize, (current - 1) * pageSize);
                if (code === 200) {
                    setSongLists(playlists)
                }
            } catch (e) {
                console.log(e);
            }
        })();
        loadImage();
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        })
    }, [tag, current, cat, pageSize]);
    const pageScrolling = () => {
        debounce(loadImage, 300);
    }
    useEffect(() => {
        window.addEventListener("scroll", pageScrolling);
        return function () {
            window.removeEventListener("scroll", pageScrolling);
        }
    }, []);
    return (
        <>
            <div className={styles.songlist} ref={myRef} >
                {songLists && songLists.map(songlist => {
                    return <div key={songlist.id} >
                        <div className={styles.content} >
                            {<img data-src={songlist.coverImgUrl} alt="加载中..." className='songlist-image' onClick={() => playSongList(songlist.id)} />}
                            <div>
                                <span >
                                    <CustomerServiceOutlined />
                                    <span>{transPlayCount(songlist.playCount)}</span>
                                </span>
                                <span>
                                    <PlayCircleOutlined onClick={() => { playMusic(songlist.id) }} />
                                </span>
                            </div>
                        </div>
                        <span onClick={() => playSongList(songlist.id)} >{songlist.name}</span>
                    </div>
                })}
            </div>
            {/* 分页 */}
            <footer className={styles.footer}>
                <Pagination current={current} onChange={onChange} total={total} pageSize={pageSize} hideOnSinglePage showSizeChanger={false} />
            </footer>

        </>
    )
}
