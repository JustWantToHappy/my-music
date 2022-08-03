import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom"
import { Button, Input, Avatar } from "antd"
import "antd/dist/antd.min.css"
import "./index.css"
export default function Header() {
    const { Search } = Input;
    const [input, setInput] = React.useState("" as any);
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
        alert(input);
    }
    //点击登录
    function login() {

    }
    return (
        <>
            <div className="head">
                <section>
                    <img src={require("../../assets/logo/logo.png")} alt="图片无法显示" />
                    <b>网易云音乐</b>
                </section>
                {items.map((item, index) => {
                    return (
                        <NavLink to={item.path}
                            key={index}
                            className={({ isActive }) => {
                                return isActive ? "is-active" : "not-active"
                            }}>
                            {item.title}
                        </NavLink>
                    )
                })}
                <li>
                    <Search
                        allowClear
                        placeholder='音乐/电台/视频/用户'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setInput(event.target.value);
                        }}
                        onSearch={search}
                    />
                </li>
                <div>
                    <Avatar size="large" icon={<UserOutlined />} />
                    <Button type="text"
                        style={{ color: "white", }}
                        onClick={login}
                    >
                        登录
                    </Button>
                </div>
            </div>
        </>
    )
}

