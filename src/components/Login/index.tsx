import styles from "./index.module.scss";
import { CloseOutlined, UserOutlined, MailOutlined, KeyOutlined, MobileOutlined } from "@ant-design/icons"
import { Button, Input, Checkbox, message } from "antd"
import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { emailLogin } from "../../api/login_register"
import { addLocalStorage, addCookies } from "../../utils/authorization"
import PubSub from "pubsub-js";
const LoginBox = (props: any) => {
    //下面这两个hook用于跳转登录成功后的路由组件
    const location = useLocation();
    const naviage = useNavigate();
    const { login } = props;
    //用于判断是登录还是注册
    const [isLogin, setLogin] = useState(true);
    const codeBtn = useRef() as any;
    //邮箱地址
    const [email, setEmail] = useState("");
    //邮箱密码
    const [password, setPwd] = useState("");
    //手机号
    const [phone, setPhone] = useState("");
    //验证码
    const [code, setCode] = useState("");
    //是否可以获取到验证码
    const [hasCode, setHasCode] = useState(true);
    //国家码
    const [ctCode, setCtCode] = useState("86");
    //倒计时
    const [count, setCount] = useState(60);
    //是否已经注册
    const [hasRegister, setRegister] = useState(true);
    const countSaver = useRef<NodeJS.Timeout>();
    //是否自动登录
    const [authLogin, setAuthLogin] = useState(false);
    //判断手机号是否合法
    const verifyPhone = (): boolean => {
        if (phone === '') {
            message.warning("手机号不能为空")
            return false;
        }
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(phone)) {
            message.warning("手机号格式错误");
            return false;
        }
        return true;
    }
    //判断密码是否合法
    const verifyPwd = (): void => {

    }
    //获取验证码
    const getCode = async () => {
        if (!verifyPhone()) {
            return;
        }
        //判断验证码是否为空
        /* 
         let registered = await hasRegistered(phone, ctCode);
         if (registered.exist !== 1) {
             setRegister(false);
             return;
         }
         let res = await sendCode(phone, ctCode);
         //获取验证码失败，超过一天之内获取的最大数
         if (res.code !== 200 || !res.data) {
             setHasCode(false);
         } else {
             countSaver.current = setInterval(() => {
                 if (count >= 0) {
                     setCount(count => count - 1);
                 }
             }, 1000);
         } */
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
            addLocalStorage([{ key: "authLogin", value: String(authLogin) }, { key: "hasLogin", value: "true" }, { key: "userId", value: String(user.userId) }, { key: "avatar", value: user.avatarUrl }, { key: 'nickname', value: user.nickname }, { key: 'cookies', value: res.cookie }]);
            //通知父组件关闭模态框
            login(false, []);
            let { pathname } = location;
            if (pathname === '/login') {
                naviage("/mymc");
            }

        } catch (e) {
            console.log(e);
            message.error("账号不存在")
        }
        // console.log(res, 'Login/index.tsx')res.token不知道有用不
    }
    //用于切换登录注册页面
    const registerOrlogin = () => {
        setLogin(!isLogin);
    }
    useEffect(() => {
        if (count < 0) {
            clearInterval(countSaver.current);
            setCount(60);
        }
    }, [count]);
    //如果用户还未注册
    useEffect(() => {

    }, [hasRegister]);
    //关闭模态框
    const closeLoginBox = () => {
        login(false);
        
    }
    return (
        <div className={styles.mask}>
            <ul className={styles.login}>
                <li>
                    <span>{isLogin && '登录'}{!isLogin && '注册'}</span>
                    <span><CloseOutlined onClick={closeLoginBox} /></span>
                </li>

                <li>
                    <p><small onClick={() => { registerOrlogin() }}>{isLogin && '注册'}{!isLogin && '登录'}</small></p>
                    {
                        !isLogin && <div>
                            <select name="select" onChange={(e) => { setCtCode(e.target.value) }}>
                                <option value="86">+86&nbsp;中国</option>
                                <option value="852">+852&nbsp;中国香港</option>
                                <option value="853">+853&nbsp;中国澳门</option>
                                <option value="886">+886&nbsp;中国台湾</option>
                            </select>
                            <Input placeholder="请输入手机号" prefix={<MobileOutlined />} allowClear maxLength={11} onChange={(e) => { setPhone(e.target.value) }} />
                            <Input placeholder="请输入昵称" prefix={<UserOutlined />} allowClear maxLength={20} onChange={(e) => { }} />
                            <Input placeholder="请输入密码" prefix={<KeyOutlined />} allowClear maxLength={20} onChange={(e) => { }} />
                            <Input placeholder="请输入验证码" allowClear onChange={(e) => { setCode(e.target.value) }} />
                            <Button danger onClick={() => getCode()} ref={codeBtn} disabled={count >= 0 && count < 60} style={{ color: (count >= 0 && count < 60) ? 'black' : '' }}>
                                {(count >= 60 || count < 0) && "获取验证码"}{count < 60 && count >= 0 && `${count}s`}
                            </Button>

                        </div>
                    }
                    {
                        isLogin && <i>
                            <Input placeholder="请输入邮箱地址" prefix={<MailOutlined />} allowClear onChange={(e) => { setEmail(e.target.value) }} />
                            <Input.Password placeholder="请输入密码" allowClear prefix={<KeyOutlined />} onChange={(e) => { setPwd(e.target.value) }} />
                            <Checkbox onChange={(e) => { console.log(setAuthLogin(e.target.checked)) }}>自动登录</Checkbox>
                        </i>
                    }
                </li>
                <li >
                    {
                        isLogin && <Button onClick={() => { EmailLogin() }} style={{ width: '300px' }}>登录</Button>
                    }
                    {
                        !isLogin && <Button onClick={() => { }} style={{ width: '316px', transform: 'translateY(30px)' }}>注册</Button>
                    }
                </li>
            </ul>
        </div >
    )
}
export default LoginBox;