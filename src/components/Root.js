import React from "react"
import {Provider} from "react-redux"
import store from "../redux/store"
import App from "./App"

class Root extends React.Component {
    render() {
	    return (
            // Provider接收一个store对象，这样让store可以被所有组件访问到
	        <Provider store={store}>
	            <App/>
	        </Provider>
	    );
    }
}
export default Root