import styles from './index.module.scss'
import React, { useState } from 'react'
import { Button, Input, message, Form } from 'antd'
import { emailLogin } from '../../api/login_register'
import { useLocation, useNavigate } from 'react-router-dom'
import { CloseOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { addLocalStorage, addCookies } from '../../utils/authorization'
interface IProps {
  login: Function
}

const LoginBox: React.FC<IProps> = (props) => {
  const location = useLocation()
  const naviage = useNavigate()
  const { login } = props
  //邮箱地址
  const [email, setEmail] = useState('')
  //邮箱密码
  const [password, setPwd] = useState('')

  //判断邮箱是否合法
  const verifyEmail = (): boolean => {
    let emailStr =
      /^[A-Za-z]\w{5,17}@(vip\.(126|163|188)\.com|163\.com|126\.com|yeach\.net)/
    if (!emailStr.test(email)) {
      message.warning('邮箱格式不正确')
      return false
    }
    return true
  }
  //登录
  const EmailLogin = async () => {
    if (!verifyEmail()) {
      return
    }
    try {
      let res = await emailLogin(email, password)
      if (res.message === '账号或密码错误' || res.code !== 200) {
        message.error('账号或密码错误')
        return
      }
      //登录成功
      addCookies(res.cookie)
      let user: User.account = res.profile
      //将用户头像和id和昵称存入本地，用来维持登录状态
      addLocalStorage([
        { key: 'hasLogin', value: 'true' },
        { key: 'userId', value: String(user.userId) },
        { key: 'avatar', value: user.avatarUrl },
        { key: 'nickname', value: user.nickname },
      ])
      //通知父组件关闭模态框
      login(false, [])
      let { pathname } = location
      if (pathname === '/login') {
        naviage('/mymc')
      }
    } catch (e) {
      message.error('账号不存在')
    }
  }
  //关闭模态框
  const closeLoginBox = () => {
    login(false)
  }
  return (
    <div className={styles.mask}>
      <div className={styles.login}>
        <header>
          <span>登录</span>
          <span>
            <CloseOutlined onClick={closeLoginBox} />
          </span>
        </header>
        <main>
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
          >
            <Form.Item label="邮箱地址" name="email">
              <Input
                placeholder="请输入邮箱地址"
                prefix={<MailOutlined />}
                allowClear
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item label="用户密码" name="password">
              <Input.Password
                allowClear
                placeholder="请输入密码"
                prefix={<UserOutlined />}
                onChange={(e) => {
                  setPwd(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
              <Button
                type="default"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </main>
      </div>
    </div>
  )
}
export default LoginBox
