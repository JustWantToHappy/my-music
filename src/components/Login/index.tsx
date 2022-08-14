import styles from "./index.module.scss";
import { CloseOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Input, Checkbox, message } from "antd"
import { useState, useRef, useEffect } from "react"
import { sendCode, hasRegistered, verifyCode } from "../../api/login"
import { addLocalStorage } from "../../utils/authorization"
const LoginBox = (props: any) => {
    const { login } = props;
    const codeBtn = useRef() as any;
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
    const [isLogin, setLogin] = useState(false);
    //获取验证码
    const getCode = async () => {
        let registered = await hasRegistered(phone, ctCode);
        if (registered.exist !== 1) {
            setRegister(false);
            return;
        }
        addLocalStorage([{ key: "avatar", value: registered.avatarUrl }, { key: "nickname", value: registered.nickname }]);
        let res = await sendCode(phone, ctCode);
        //获取验证码失败，超过一天之内获取的最大数
        if (res.code !== 200 || !res.data) {
            setHasCode(false)
        } else {
            countSaver.current = setInterval(() => {
                if (count >= 0) {
                    setCount(count => count - 1);
                }
            }, 1000);
        }
    }
    const loginIn = async () => {
        if (phone === '' || code === '') {
            message.warning("手机号和验证码不能为空");
            return;
        }
        try {
            let res = await verifyCode(phone, code, ctCode);
            //验证成功!
            if (res.code === 200 && res.data) {
                addLocalStorage([{ key: "autoLogin", value: `${isLogin}` }, { key: "hasLogin", value: "true" }]);
                login(false);
            }
        } catch (e) {
            message.error({
                content: '手机号或验证码有误',
                
            })
        }
    }
    const register = () => {

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
    return (
        <div className={styles.mask}>
            <ul className={styles.login}>
                <li>
                    <span>登录</span>
                    <span><CloseOutlined onClick={() => { props.login(false) }} /></span>
                </li>

                <li>
                    <p><small onClick={() => { register() }}>注册</small></p>
                    <div>
                        <select name="select" onChange={(e) => { setCtCode(e.target.value) }}>
                            <option value="86">+86&nbsp;中国</option>
                            <option value="852">+852&nbsp;中国香港</option>
                            <option value="853">+853&nbsp;中国澳门</option>
                            <option value="886">+886&nbsp;中国台湾</option>
                        </select>
                        <Input size="large" placeholder="请输入手机号" prefix={<UserOutlined />} allowClear maxLength={11} onChange={(e) => { setPhone(e.target.value) }} />
                        <Input placeholder="请输入验证码" size="large" allowClear onChange={(e) => { setCode(e.target.value) }} />
                        <Button danger onClick={() => getCode()} ref={codeBtn} disabled={count >= 0 && count < 60} style={{ color: (count >= 0 && count < 60) ? 'black' : '' }}>
                            {(count >= 60 || count < 0) && "获取验证码"}{count < 60 && count >= 0 && `${count}s`}
                        </Button>
                        {!hasCode && <p>!&nbsp;当天发送验证码的条数超过限制</p>}
                        <small>手机登录</small>
                        <Checkbox onChange={(e) => { console.log(setLogin(e.target.checked)) }}>自动登录</Checkbox>
                    </div>
                </li>
                <li >
                    <Button onClick={loginIn} style={{ width: '300px' }}>登录</Button>
                </li>
            </ul>
        </div >
    )
}
export default LoginBox;