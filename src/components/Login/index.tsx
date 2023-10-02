import React from 'react'
import styles from './index.module.scss'
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

  const EmailLogin = async ({ email, password }: { email: string, password: string }) => {
    try {
      const res = await emailLogin(email, password)
      console.info(res, 'hhh')
      if (res.message === '账号或密码错误' || res.code !== 200) {
        message.error(res.message)
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
      login(false, [])
      let { pathname } = location
      if (pathname === '/login') {
        naviage('/mymc')
      }
    } catch (e) {
      message.error('账号不存在')
    }
  }

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
            onFinish={EmailLogin}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
          //autoComplete="off" 自动填充
          >
            <Form.Item
              label="邮箱地址"
              name="email"
              rules={[
                { required: true, message: '请输入你的邮箱地址!' },
                { type: 'email', message: '邮箱格式不正确!' }
              ]}>
              <Input
                placeholder="请输入邮箱地址"
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item
              label="用户密码"
              name="password"
              rules={[
                { required: true, message: '请输入你的邮箱密码!' }
              ]}>
              <Input.Password
                placeholder="请输入密码"
                prefix={<UserOutlined />}
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
