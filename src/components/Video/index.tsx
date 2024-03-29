import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getMVURL } from '../../api/video'
import styles from './index.module.scss'
export default function Video() {
  const [search] = useSearchParams()
  const id = search.get('id')
  //播放地址
  const [url, setURL] = useState('')

  //获取url地址
  useEffect(() => {
    ;(async () => {
      const res = await getMVURL(id as string)
      if (res.code === 200) {
        setURL(res.data.url)
      }
    })()
  }, [])
  //获取mv的详情
  useEffect(() => {
    ;(async () => {})()
  })
  return (
    <div className={styles.video}>
      <main>
        <video src={url} controls></video>
      </main>
      <aside>zz</aside>
    </div>
  )
}
