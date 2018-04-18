import React from "react"
import "./header.styl"

class MusicHeader extends React.Component {
    // 也可以使用history.goBack()来实现路由的回退
    handleClick() {
        window.history.back();
    }
    render() {
        return (
            <div className="music-header">
	            <span className="header-back" onClick={this.handleClick}>
                    {/* 使用font.styl里的图标，在App.js中已经引入字体图标样式作为全局引入，所有的组件都可以使用字体图标样式 */}
	                <i className="icon-back"></i>
	            </span>
                <div className="header-title">
                    {this.props.title}
                </div>
            </div>
        );
    }
}

export default MusicHeader