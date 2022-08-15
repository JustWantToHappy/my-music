import { Button } from "antd"
import styles from "./styles/login_page.module.scss"
import { useState } from "react"
import PubSub from "pubsub-js"
const LoginPage = () => {
    const login = () => {
        PubSub.publish("login", true);
    }
    return (
        <figure className={styles.loginPage}>
            <img src={require("../../assets/img/login.png")} alt="图片无法加载" />
            <figcaption className={styles.des}>
                <h2 >登录某云音乐</h2>
                <span>查看并管理你的私房音乐</span>
                <span>方便地随时随地听</span>
                <Button type="primary" block onClick={login}>立即登录</Button>
            </figcaption>
        </figure>
    )
}
export default LoginPage;