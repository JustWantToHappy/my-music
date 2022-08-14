import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom"
import { Button, Input, Avatar } from "antd"
import LoginBox from "../../components/Login";
import "antd/dist/antd.min.css"
import styles from "./index.module.css"
import { deleteLocalStorage } from "../../utils/authorization"
export default function Header() {
    const { Search } = Input;
    const [input, setInput] = React.useState("" as any);
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
    function loginIn(type: boolean) {
        if (!type) {
            setLogin(false);
            if (localStorage.getItem("hasLogin") === 'true') {

            }
        } else {
            setLogin(true);
        }
    }
    //退出登录
    function loginOut() {
        deleteLocalStorage(["autoLogin", "nickname", "hasLogin","avatar"]);
        setHasLogin(false);
    }
    React.useEffect(() => {
        let hasLogin = localStorage.getItem("hasLogin");
        if (hasLogin === 'true') {
            setHasLogin(true);
        }
        setAvatar(localStorage.getItem("avatar"));
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
                        style={{ color: "white", }}
                        onClick={() => { loginIn(true) }}
                    >
                        登录
                    </Button>}
                    {hasLogin && <Button onClick={() => { loginOut() }} type='text' style={{ color: 'white' }}>
                        退出登录
                    </Button>}
                </div>
            </div>
            {login && <LoginBox login={loginIn} />}
        </>
    )
}

