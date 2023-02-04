import styles from "./index.module.scss";
import { CloseOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons"
import { Button, Input, Checkbox, message } from "antd"
import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { emailLogin } from "../../api/login_register"
import { addLocalStorage, addCookies } from "../../utils/authorization"
interface IProps {
    login: Function
}
const LoginBox: React.FC<IProps> = (props) => {
    //下面这两个hook用于跳转登录成功后的路由组件
    const location = useLocation();
    const naviage = useNavigate();
    const { login } = props;
    //邮箱地址
    const [email, setEmail] = useState("");
    //邮箱密码
    const [password, setPwd] = useState("");
    //是否自动登录
    const [authLogin, setAuthLogin] = useState(false);
    //判断密码是否合法
    const verifyPwd = () => {

    }
    //判断邮箱是否合法
    const verifyEmail = (): boolean => {
        let emailStr = /^[A-Za-z]\w{5,17}@(vip\.(126|163|188)\.com|163\.com|126\.com|yeach\.net)/;
        if (!emailStr.test(email)) {
            message.warning("邮箱格式不正确");
            return false;
        }
        return true;
    }
    //登录
    const EmailLogin = async () => {
        if (!verifyEmail()) {
            return;
        }
        try {
            let res = await emailLogin(email, password);
            if (res.message === '账号或密码错误' || res.code !== 200) {
                message.error("账号或密码错误")
                return;
            }
            //登录成功
            addCookies(res.cookie);
            let user: User.account = res.profile;
            //将用户头像和id和昵称存入本地，用来维持登录状态
            addLocalStorage([{ key: "authLogin", value: String(authLogin) }, { key: "hasLogin", value: "true" }, { key: "userId", value: String(user.userId) }, { key: "avatar", value: user.avatarUrl }, { key: 'nickname', value: user.nickname }]);
            //通知父组件关闭模态框
            login(false, []);
            let { pathname } = location;
            if (pathname === '/login') {
                naviage("/mymc");
            }
        } catch (e) {
            message.error("账号不存在")
        }
    }
    //关闭模态框
    const closeLoginBox = () => {
        login(false);
    }
    return (
        <div className={styles.mask}>
            <ul className={styles.login}>
                <li>
                    <span>登录</span>
                    <span><CloseOutlined onClick={closeLoginBox} /></span>
                </li>

                <li>
                    <p></p>
                    <i>
                        <Input placeholder="请输入邮箱地址" prefix={<MailOutlined />} allowClear onChange={(e) => { setEmail(e.target.value) }} />
                        <Input.Password placeholder="请输入密码" allowClear prefix={<KeyOutlined />} onChange={(e) => { setPwd(e.target.value) }} />
                        <Checkbox onChange={(e) => { setAuthLogin(e.target.checked) }}>自动登录</Checkbox>
                    </i>
                </li>
                <li >
                    <Button onClick={() => { EmailLogin() }} style={{ width: '300px' }}>登录</Button>
                </li>
            </ul>
        </div >
    )
}
export default LoginBox;