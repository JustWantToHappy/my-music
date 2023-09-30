import React from 'react'
import { UserOutlined, SearchOutlined } from '@ant-design/icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button, Input, Avatar } from 'antd'
import LoginBox from '../../components/Login'
import 'antd/dist/antd.min.css'
import styles from './index.module.scss'
import { addLocalStorage, deleteLocalStorage } from '../../utils/authorization'
import PubSub from 'pubsub-js'
import { Search } from '../../mobx/constants'
export default function Header() {
  const [input, setInput] = React.useState('')
  //用于判断登录注册窗口是否显示
  const [login, setLogin] = React.useState(false)
  const [avatar, setAvatar] = React.useState<string | null>()
  //用于判断用户是否已经登录
  const [hasLogin, setHasLogin] = React.useState(false)
  const navigate = useNavigate()
  const items: Array<{
    title: string
    path: string
  }> = [
    {
      title: '首页',
      path: '/home',
    },
    {
      title: '排行榜',
      path: '/rank',
    },
    {
      title: '电台',
      path: '/station',
    },
    {
      title: '我的音乐',
      path: '/mymc',
    },
  ]

  //点击登录
  function loginIn(type: boolean, operation: any) {
    if (!type) {
      setLogin(false)
      typeof operation === 'object'
        ? setAvatar(localStorage.getItem('avatar'))
        : setAvatar('')
      localStorage.getItem('hasLogin') === 'true' && setHasLogin(true)
      //显示个人推荐
      localStorage.getItem('hasLogin') === 'true' &&
        PubSub.publish('showRecommend', true)
    } else {
      setLogin(true)
    }
  }
  //退出登录,将本地中用户的敏感信息都清空
  function loginOut() {
    let authLogin = localStorage.getItem('authLogin')
    if (!authLogin || authLogin === 'false')
      deleteLocalStorage(['nickname', 'avatar', 'userId', 'cookies'])
    addLocalStorage([{ key: 'hasLogin', value: 'false' }])
    setHasLogin(false)
    setAvatar('')
    PubSub.publish('showRecommend', false)
    //退出后跳转到首页
    navigate('/home')
  }
  React.useEffect(() => {
    // let authLogin = localStorage.getItem("authLogin");
    let isLogin = localStorage.getItem('hasLogin')
    if (isLogin === 'true') {
      setHasLogin(true)
      addLocalStorage([{ key: 'hasLogin', value: 'true' }])
    }
    setAvatar(localStorage.getItem('avatar'))
    //设置为true表示显示登录框
    PubSub.subscribe('login', () => {
      setLogin(true)
    })
  }, [])
  //搜索框回车
  const search: React.KeyboardEventHandler<HTMLInputElement> | undefined = (
    event: React.KeyboardEvent,
  ) => {
    if (event.key.includes('Enter') && input.length > 0) {
      navigate(`/search?keywords=${input}&type=${Search.SingleSong}`)
    }
  }
  return (
    <>
      <div className={styles.head}>
        <section>
          <img src={require('../../assets/logo/logo.png')} alt="图片无法显示" />
          {/*<b>某云音乐</b>*/}
        </section>
        {items.map((item, index) => {
          return (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) => {
                return isActive ? styles['is-active'] : styles['not-active']
              }}
            >
              {item.title}
            </NavLink>
          )
        })}
        <li>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="音乐/电台/视频/歌手"
            style={{ borderRadius: '20px' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInput(event.target.value)
            }}
            onKeyDown={search}
          />
        </li>
        <div>
          <Avatar size="large" icon={<UserOutlined />} src={avatar} />
          {!hasLogin && (
            <Button
              type="text"
              className={styles['login-btn']}
              onClick={() => {
                loginIn(true, null)
              }}
            >
              登录
            </Button>
          )}
          {hasLogin && (
            <p>
              <Button
                onClick={() => {
                  loginOut()
                }}
                type="text"
                className={styles['login-btn']}
              >
                退出登录
              </Button>
            </p>
          )}
        </div>
      </div>
      {login && <LoginBox login={loginIn} />}
    </>
  )
}
