import SongList from './SongList'
import { Button, Tag } from 'antd'
import {
  DownOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  CoffeeOutlined,
  SmileOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import styles from './styles/index.module.scss'
import { songlistCategory } from '../../api/songlist'
import { debounce } from '../../utils/throttle_debounce'

export default function AllPlayList() {
  const [tags, setTags] = useState<Array<Music.tag>>()
  const [title, setTitle] = useState('全部')
  const [showTags, setShowTags] = useState(false)
  const [count, setCount] = useState(0)
  const [all, setAll] = useState<Music.tag>()
  const [category, setCategory] = useState<{ [key: number]: string }>()

  useEffect(() => {
    (async () => {
      const res = await songlistCategory()
      //more字段为true表示还有分页,categories表示分类的类别有哪些
      let { code, all, categories, sub } = res
      if (code === 200) {
        setTags(sub)
        setAll(all)
        //默认是全部歌单
        setCount(all.resourceCount)
        setCategory(categories)
      }
    })()
  }, [])

  useEffect(() => {
    const hiddenCategory = () => {
      debounce(() => {
        setShowTags(false)
      }, 200)
    }
    document.documentElement.addEventListener('click', hiddenCategory)
    return function () {
      document.documentElement.removeEventListener('click', hiddenCategory)
    }
  }, [])

  return (
    <div className={styles.playlist}>
      <header>
        <div className={styles['all-select']}>
          <h2>{title}</h2>
          <span>
            <Button
              onClick={(e) => {
                setShowTags(!showTags)
                e.stopPropagation()
              }}
            >
              <span>选择分类</span>
              <DownOutlined />
            </Button>
          </span>
        </div>
        <span>
          <Tag color="#cd201f">热门</Tag>
        </span>
      </header>
      {showTags && (
        <SongTags
          category={category as { [key: number]: string }}
          tags={tags as Array<Music.tag>}
          setTitle={(str: string) => {
            setTitle(str)
          }}
          setShowTags={() => setShowTags(false)}
          setTotal={(count: number) => setCount(count)}
          defaultTotal={all?.resourceCount}
        />
      )}
      <hr />
      <div className={styles.content}>
        <SongList tag={title} total={count} />
      </div>
    </div>
  )
}
const SongTags = (props: {
  tags: Array<Music.tag>
  category: { [key: number]: string }
  setTitle: (str: string) => void
  setShowTags: () => void
  setTotal: (count: number) => void
  defaultTotal: number | undefined
}) => {
  const { tags, setTitle, setShowTags, category, setTotal, defaultTotal } = props
  const categories: number[] = []
  for (let index of Object.keys(category)) {
    categories.push(parseInt(index))
  }
  const changeTag = (tag: Music.tag) => {
    setTitle(tag.name)
    setShowTags()
    setTotal(tag.resourceCount)
  }
  return (
    <div className={styles.tags} onClick={(e) => e.stopPropagation()}>
      <header>
        <Button
          onClick={(e) => {
            setTitle('全部')
            setShowTags()
            if (defaultTotal) setTotal(defaultTotal)
          }}
        >
          <span>全部风格</span>
        </Button>
      </header>
      <ul className={styles.side}>
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
        {categories.map((num: number) => {
          return (
            <div key={num} className={styles['tags-category']}>
              {tags.map((tag) => {
                if (tag.category === num) {
                  return (
                    <div key={tag.name} className={styles.tag}>
                      <span>&nbsp;&nbsp;</span>
                      <span
                        onClick={() => {
                          changeTag(tag)
                        }}
                      >
                        {tag.name}
                      </span>
                      <span>&nbsp;&nbsp;|</span>
                    </div>
                  )
                } else {
                  return <div key={tag.name}></div>
                }
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
