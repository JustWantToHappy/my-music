import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./styles/mymusic.module.scss"
const Index = () => {
    const [login, setLogin] = useState<string | null>();
    const navigate = useNavigate();
    useEffect(() => {
        let hasLogin = localStorage.getItem("hasLogin");
        if (hasLogin === 'false' || !hasLogin) {
            navigate("/login");
        }
    }, []);
    return (
        <div className={styles['my-music']}>
            <div className={styles.navigate}></div>
            <div className={styles.content}></div>
        </div>
    )
}
export default Index;