import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom"
import { Button, Input, Avatar } from "antd"
import LoginBox from "../../components/Login";
import "antd/dist/antd.min.css"
import styles from "./index.module.scss"
import { deleteLocalStorage } from "../../utils/authorization"
import PubSub from 'pubsub-js';
export default function Header() {
    const { Search } = Input;
    const [input, setInput] = React.useState("" as any);
    //用于判断登录注册窗口是否显示
    const [login, setLogin] = React.useState(false);
    const [avatar, setAvatar] = React.useState<string | null>();
    //用于判断用户是否已经登录
    const [hasLogin, setHasLogin] = React.useState(false);
    const items: Array<{
        title: string, path: string
    }> = [{
        title: "首页",
        path: "/home"
    },
    {
        title: "排行榜",
        path: "/rank"
    },
    {
        title: "电台",
        path: "/station"
    },
    {
        title: "我的音乐",
        path: "/mymc"
    }
        ];

    //点击搜索按钮时进行搜索
    function search() {

    }
    //点击登录
    function loginIn(type: boolean, operation: any) {
        if (!type) {
            setLogin(false);
            typeof operation === 'object' ? setAvatar(localStorage.getItem("avatar")) : setAvatar("");
            setHasLogin(true);
        } else {
            setLogin(true);
        }
    }
    //退出登录,将本地中用户的敏感信息都清空
    function loginOut() {
        deleteLocalStorage(["autoLogin", "nickname", "hasLogin", "avatar", "userId"]);
        setHasLogin(false);
        setAvatar("");
    }
    React.useEffect(() => {
        let hasLogin = localStorage.getItem("hasLogin");
        if (hasLogin === 'true') {
            setHasLogin(true);
        }
        setAvatar(localStorage.getItem("avatar"));
        PubSub.subscribe("login", () => { setLogin(false) });
    }, []);
    return (
        <>
            <div className={styles.head}>
                <section>
                    <img src={require("../../assets/logo/logo.png")} alt="图片无法显示" />
                    <b>某云音乐</b>
                </section>
                {items.map((item, index) => {
                    return (
                        <NavLink to={item.path}
                            key={index}
                            className={({ isActive }) => {
                                return isActive ? styles["is-active"] : styles["not-active"];
                            }}>
                            {item.title}
                        </NavLink>
                    )
                })}
                <li>
                    <Search
                        allowClear
                        placeholder='音乐/电台/视频/歌手'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setInput(event.target.value);
                        }}
                        onSearch={search}
                    />
                </li>
                <div>
                    <Avatar size="large" icon={<UserOutlined />} src={avatar} />
                    {!hasLogin && <Button type="text"
                         className={styles['login-btn']}
                        onClick={() => { loginIn(true, null) }}
                    >
                        登录
                    </Button>}
                    {
                        hasLogin &&
                        <p >
                            <small>{localStorage.getItem("nickname")}</small>
                            <Button onClick={() => { loginOut() }} type='text' className={styles['login-btn']}>
                                退出登录
                            </Button>
                        </p>
                    }
                </div>
            </div>
            {login && <LoginBox login={loginIn} />}
        </>
    )
}

