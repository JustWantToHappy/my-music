import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { fetchList } from "../../api/songlist"
const PlayList = () => {
    const { id } = useParams();
    //拿取歌单信息
    useEffect(() => {
        (async function(){
            
        })();
    }, []);
    return (
        <>
            <div>

            </div>
        </>
    )
}
export default PlayList;