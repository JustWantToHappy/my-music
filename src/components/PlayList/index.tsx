import React from 'react'
import styles from "./index.module.scss";
import PlayContent from './components/PlayContent';
import Lyric from './components/Lyric';

export interface Props {
    container: HTMLDivElement | null,
}

const PlayList: React.FC<Props> = (props) => {
    const playListContainerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={playListContainerRef}
            className={styles.playlist} >
            <PlayContent />
            <Lyric {...props} />
        </div>
    )
}

export default React.memo(PlayList);
