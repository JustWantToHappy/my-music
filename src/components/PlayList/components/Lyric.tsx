import React from 'react'
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";
import playlist from '../../../mobx/playlist';
import playcontroller from '../../../mobx/playcontroller';
import { getLyricBySongId } from "../../../api/song"
interface lyricType {
    audioRef: any,
    id: number
}

export default function Lyric() {
    const { song } = playlist;
    const { olyric, tlyric } = playcontroller;
    const lyricRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        (async () => {
            let res = await getLyricBySongId(song.id);
            // console.log(res.lrc.lyric, res.tlyric ? res.tlyric.lyric : "");
            playcontroller.handleLyric(res.lrc.lyric, res.tlyric ? res.tlyric.lyric : "");
        })();
    }, [song.id]);
    return (
        <div className={styles.lyric}>
            <header>
                <span>{song.name}</span>
                <span><CloseCircleOutlined onClick={() => playlist.isShow = false} /></span>
            </header>
            <div className={styles["lyric-content"]} ref={lyricRef}>

            </div>
        </div>
    )
}
