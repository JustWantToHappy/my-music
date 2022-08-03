import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchList, getListSong } from "../../api/songlist"
const PlayList = () => {
    const { id } = useParams();
    interface list {
        playlist: {
            description: string,
            tags: Array<string>,
            coverImgUrl: string,
            name: string,
        }
    };
    const [list, setList] = useState<list>();
    const [songs, setSongs] = useState<Array<Music.song>>();
    //拿取歌单信息
    useEffect(() => {
        (async function () {
            //获取歌单详情
            let ls = await fetchList(parseInt(id as string));
            setList(ls);
            //获取歌单中每首歌
            let sgs = await getListSong(parseInt(id as string));
            setSongs(sgs.songs);
        })();
    }, []);
    return (
        <>
            <div>
                {songs?.map(song => {
                    return <div key={song.id}></div>
                })}
            </div>
        </>
    )
}
export default PlayList;