import {createStore} from "redux"
import reducer from "./reducers"

// 创建store，Redux的createStore函数只能接受一个reducer
const store = createStore(reducer);
export default store