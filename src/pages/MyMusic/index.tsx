import React, { useState, useEffect } from "react"
import { useNavigate, Outlet, useSearchParams } from "react-router-dom"
import styles from "./styles/mymusic.module.scss"
import { DashOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Modal, Input } from 'antd';
import { fetchUserSongList, createNewSongList } from "../../api/user"
import { addLocalStorage } from "../../utils/authorization"
import PubSub from "pubsub-js"
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}
const rootSubmenuKeys = ['add', 'sub1'];
const Index = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const defaultKey = search.get("id");
    const [openKeys, setOpenKeys] = useState(['sub1']);
    const [items, setItems] = useState<Array<MenuItem>>([]);
    const [songlist, setList] = useState<Array<User.songList>>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    //新增歌单名称
    const [input, setInput] = useState("");
    //模态框
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        let res = await createNewSongList(input)
        if (res.code === 200) {
            getData();
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onOpenChange: MenuProps['onOpenChange'] = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    const isLogin = (): string => {
        let hasLogin = localStorage.getItem("hasLogin");
        let userId = localStorage.getItem("userId") as string;
        if (hasLogin === 'false' || !hasLogin || !userId) {
            navigate("/login");
        }
        return userId;
    }
    //点击菜单触发
    const handleMenu = (e: any) => {
        if (e.key !== 'add') {
            let index = 0;
            for (let i = 0; songlist && i < songlist?.length; i++) {
                if (String(songlist[i].id) === e.key) {
                    index = i;
                    break;
                }
            }
            let mylove = index === 0 ? true : false;
            navigate(`mysonglist?id=${e.key}`, { state: { data: songlist && songlist[index], mylove } });
        } else {
            setIsModalVisible(true);
        }
    }
    const getData = () => {
        (async () => {
            let userId = isLogin();
            let { playlist } = await fetchUserSongList(userId);
            console.log(playlist,'sbbbbb')
            setList(playlist);
            let arr = [];
            arr.push(getItem(
                <span>
                    新建歌单
                </span>,
                'add',
                <PlusCircleOutlined />
            ))
            let brr: Array<MenuItem> = [];
            playlist && playlist.forEach((list: User.songList) => {
                brr.push(getItem(list.name, list.id, <img src={list.coverImgUrl} alt='logo' style={{ width: '40px' }} />));
            })
            arr.push(getItem('我创建的歌单', 'sub1', <DashOutlined />, brr));
            setItems(arr);
            if (playlist.length > 0) {
                navigate(`/mymc/mysonglist?id=${playlist[1].id}`, { state: { data: playlist[1], mylove: false } })
            } else {
                navigate(`mysonglist?id=${playlist[0].id}`, { state: { data: playlist[0], mylove: true } })
            }
        })();
    }
    useEffect(() => {
        try {
            getData();
            PubSub.subscribe("refresh", () => {
                getData();
            })
        } catch (e) {
            console.log(e)
        }
    }, []);
    useEffect(() => {
        if (songlist) {
            addLocalStorage([{ key: "songlist", value: JSON.stringify(songlist) }]);
        }
    }, [songlist]);
    return (
        <div className={styles['my-music']}>
            <div className={styles.navigate}>
                <Menu
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    items={items}
                    onClick={handleMenu}
                    inlineIndent={4}
                    defaultSelectedKeys={[defaultKey as string]}
                    defaultOpenKeys={['sub1']}
                />
            </div>
            <div className={styles.content} >
                <Outlet />
            </div>
            <Modal title="新建歌单" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} cancelText="取消" okText="确定" style={{ marginTop: '15vh' }}>
                <span>
                    <Input placeholder="请输入歌单名称" onChange={(e) => { setInput(e.target.value) }} />
                </span>
                <small>可通过“收藏”将音乐添加到新歌单中</small>
            </Modal>
        </div>
    )
}
export default Index;