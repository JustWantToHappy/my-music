import { useState, useEffect } from 'react'
import { Button } from "antd"
import { DownOutlined, GlobalOutlined, DatabaseOutlined, CoffeeOutlined, SmileOutlined, ThunderboltOutlined, TagsFilled } from "@ant-design/icons"
import styles from "./styles/index.module.scss"
import { getPlayListTags } from "../../api/recommond"
import SongList from './SongList'
export default function AllPlayList() {
    const [tags, setTags] = useState<Array<Music.tags>>();
    const [title, setTitle] = useState("全部");
    const [showTags, setShowTags] = useState(false);
    useEffect(() => {
        (async () => {
            const res = await getPlayListTags();
            if (res.code === 200) {
                console.log(res.tags);
                setTags(res.tags);
            }
        })();
    }, []);
    return (
        <div className={styles.playlist}>
            <header>
                <div className={styles['all-select']}>
                    <h2>{title}</h2>
                    <span >
                        <Button onClick={() => { setShowTags(!showTags) }}>
                            <span>选择分类</span>
                            <DownOutlined />
                        </Button>
                    </span>
                </div>
                <span>
                    <Button type="primary" danger>
                        热门
                    </Button>
                </span>
            </header>
            {showTags && <SongTags tags={tags as Array<Music.tags>} setTitle={() => setTitle("全部")} setShowTags={() => setShowTags(false)} />}
            <hr />
            <div className={styles.content}>
                <SongList cat={title} />
            </div>
        </div>
    )
}
//标签框
const SongTags = (props: { tags: Array<Music.tags>, setTitle: () => void, setShowTags: () => void }) => {
    const { tags, setTitle, setShowTags } = props;
    let category: number[] = [];
    tags.forEach(tag => {
        if (!category.includes(tag.category)) {
            category.push(tag.category);
        }
    })
    category.sort((a, b) => a - b);
    return (
        <div className={styles.tags}>
            <header>
                <Button onClick={() => {
                    setTitle();
                    setShowTags();
                }}>
                    <span>全部风格</span>
                </Button>
            </header>
            <ul className={styles.side}>
                {/* 语种,风格，场景，情感，主题 */}
                <li>
                    <GlobalOutlined />
                    <span>语种</span>
                </li>
                <li>
                    <DatabaseOutlined />
                    <span>风格</span>
                </li>
                <li>
                    <CoffeeOutlined />
                    <span>场景</span>
                </li>
                <li>
                    <SmileOutlined />
                    <span>情感</span>
                </li>
                <li>
                    <ThunderboltOutlined />
                    <span>主题</span>
                </li>
            </ul>
            <div className={styles['tags-content']}>
                {category.map((num: number) => {
                    return (
                        <div key={num} className={styles['tags-category']}>
                            {tags.map(tag => {
                                if (tag.category === num) {
                                    return <div key={tag.id} className={styles.tag}>
                                        <span>&nbsp;&nbsp;</span>
                                        <span>{tag.name}</span>
                                        <span>&nbsp;&nbsp;|</span>
                                    </div>
                                } else {
                                    return <div key={tag.id}></div>
                                }
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
