import MyMusic from "./MyMusic";
import LoginPage from "./LoginPage";
import { useState, useEffect } from "react"
const Index = () => {
    const [login, setLogin] = useState<string | null>();
    useEffect(() => {
        setLogin(localStorage.getItem("hasLogin"));
    }, []);
    return (
        <>
            {login === 'true' && MyMusic()}
            {login === 'false' || !login && LoginPage()}
        </>
    )
}
export default Index;