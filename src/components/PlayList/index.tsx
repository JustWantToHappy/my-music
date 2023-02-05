import React from 'react'
import {
    CloseCircleOutlined,
    DeleteOutlined,
    CaretRightOutlined,
    HeartOutlined
} from "@ant-design/icons"
import styles from "./index.module.scss";

//播放列表组件
export default function PlayList() {
    const [curret, setCurrent] = React.useState(0);
    return (
        <div className={styles.playlist}>
            <header>
                <span>播放列表()</span>
                <span><CloseCircleOutlined /></span>
                <div>
                    <span><DeleteOutlined /></span>
                    <span>清除</span>
                </div>
            </header>
            <ul className={styles.songlist}>
                <li className={styles.song}>
                    <span>
                        <CaretRightOutlined />
                    </span>
                    <span>Next to you</span>
                    <span>
                        <i><HeartOutlined /></i>
                        <i><DeleteOutlined /></i>
                    </span>
                    <span>Ken Arai</span>
                    <span>03:44</span>
                </li>
               
            </ul>
        </div>
    )
}
