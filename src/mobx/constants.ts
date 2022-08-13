//全局常量
import { observable } from "mobx"
const constantsStore= {
    publicURL: "http://localhost:5000"
}
export default observable(constantsStore);