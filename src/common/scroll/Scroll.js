import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import BScroll from "better-scroll";
import "./scroll.styl";

class Scroll extends React.Component {
    componentDidUpdate() {
        //组件更新后，如果实例化了better-scroll并且需要刷新就调用refresh()函数
        if (this.bScroll && this.props.refresh === true) {
            this.bScroll.refresh();
        }
    }
    componentDidMount() {
        // 获取DOM对象
        this.scrollView = ReactDOM.findDOMNode(this.refs.scrollView);
        if (!this.bScroll) {
            // 获取DOM对象后传入better-scroll构造函数中初始化
            this.bScroll = new BScroll(this.scrollView, {
                // 实时派发scroll事件
                probeType: 3,
                click: this.props.click
            });
            // 在Scroll组件中调用外部组件的方法（eg: onScroll函数）只需把外部组件的函数通过props传入即可
            if (this.props.onScroll) {
                this.bScroll.on("scroll", (scroll) => {
                    this.props.onScroll(scroll);
                });
            }

        }
    }
    componentWillUnmount() {
        this.bScroll.off("scroll");
        this.bScroll = null;
    }
    refresh() {
        if (this.bScroll) {
            this.bScroll.refresh();
        }
    }
    render() {
        return (
            // ref属性标记div元素
            <div className="scroll-view" ref="scrollView">
                {/* 获取子组件，只要子组件的高度超过父组件就可以滚动 */}
                {this.props.children}
            </div>
        );
    }
}

Scroll.defaultProps = {
    click: true,
    refresh: false,
    onScroll: null
};

Scroll.propTypes = {
    // 是否启用点击
    click: PropTypes.bool,
    // 是否刷新
    refresh: PropTypes.bool,
    // 限制onScroll是一个函数
    onScroll: PropTypes.func
};

export default Scroll;
