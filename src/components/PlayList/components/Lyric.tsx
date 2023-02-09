import React from 'react'
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";
import playlist from '../../../mobx/playlist';
import playcontroller from '../../../mobx/playcontroller';
import { getLyricBySongId } from "../../../api/song"

export default function Lyric() {
    const { song } = playlist;
    const [lyric, setLyric] = React.useState<Array<[number, { lyc: string, tlyc?: string }]>>();

    const lyricRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        (async () => {
            let res = await getLyricBySongId(song.id);
            playcontroller.handleLyric(res.lrc.lyric, res.tlyric ? res.tlyric.lyric : "");
            setLyric(playcontroller.getLyric());
        })();
    }, [song.id]);


    return (
        <div className={styles.lyric}>
            <header>
                <span>{song.name}</span>
                <span><CloseCircleOutlined onClick={() => playlist.isShow = false} /></span>
            </header>
            <div className={styles["lyric-content"]} ref={lyricRef}>
                {lyric?.map(([time, { lyc, tlyc }]) => {
                    return (<p key={time}>
                        <small>{lyc}</small>
                        <br />
                        <small>{tlyc}</small>
                    </p>)
                })}
            </div>
        </div>
    )
}
