import React from "react"
import styles from "./index.module.scss";
import { CloseOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Input, Checkbox } from "antd"
import { sendCode } from "../../api/login"
const LoginBox = (props: any) => {
    //手机号
    const [phone, setPhone] = React.useState("");
    //验证码
    const [code, setCode] = React.useState("");
    //是否可以获取到验证码
    const [hasCode, setHasCode] = React.useState(false);
    //获取验证码
    const getCode = async () => {
        let res = await sendCode(phone);
        //获取验证码失败，超过一天之内获取的最大数
        if (res.code !== 200 || !res.data) {

        }
    }
    return (
        <div className={styles.mask}>
            <ul className={styles.login}>
                <li>
                    <span>登录</span>
                    <span><CloseOutlined onClick={() => { props.login(false) }} /></span>
                </li>

                <li>
                    <p><small>注册</small></p>
                    <div>
                        <select name="" id="" >
                            <option value="86">+86&nbsp;中国</option>
                            <option value="852">+852&nbsp;中国香港</option>
                            <option value="853">+853&nbsp;中国澳门</option>
                            <option value="886">+886&nbsp;中国台湾</option>
                        </select>
                        <Input size="large" placeholder="请输入手机号" prefix={<UserOutlined />} allowClear maxLength={11} />
                        <Input placeholder="请输入验证码" size="large" allowClear />
                        <Button danger onClick={() => getCode()}>获取验证码</Button>
                        {hasCode && <p>!&nbsp;当天发送验证码的条数超过限制</p>}
                        <small>手机登录</small>
                        <Checkbox >自动登录</Checkbox>
                    </div>
                </li>
                <li >
                    <Button onClick={() => { }} style={{ width: '300px' }}>登录</Button>
                </li>
            </ul>
        </div >
    )
}
export default LoginBox;