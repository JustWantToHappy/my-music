import React from "react"
import styles from "./index.module.css";
import { CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
const LoginBox = () => {
    return (
        <div className={styles.mask}>
            <ul className={styles.login}>
                <li>
                    <span>登录</span>
                    <span><CloseOutlined /></span>
                </li>
                <li className={styles.test1}>
                    sb
                </li>
                <li className={styles.test2}>
                    s
                </li>
                <li className={styles.test3}>
                    <Button>选择其他登录方式</Button>
                </li>
            </ul>
        </div >
    )
}
export default LoginBox;