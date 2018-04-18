import React from "react";
import { Route } from 'react-router-dom';
import Swiper from "swiper";
import LazyLoad, { forceCheck } from "react-lazyload";
import { getCarousel, getNewAlbum } from "../../api/recommend";
import { CODE_SUCCESS } from "../../api/config";
import * as AlbumModel from "../../model/Album";
import Scroll from "../../common/scroll/Scroll";
import Loading from "../../common/loading/Loading";
// import Album from "../../components/album/Album";
import Album from "../../container/Album"
import "./recommend.styl";
import "swiper/dist/css/swiper.css"; // node_module下的swiper文件夹一直找，能找到swiper.css

class Recommend extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this);
        this.state = { // 相当于vue的data() { return { //... }}
            sliderList: [],
            newAlbums: [],
            refreshScroll: false, // 控制Scroll组件是否刷新
            loading: true
        };
    }
    componentDidMount() {
        // 发送jsonp请求，getCarousel返回的是一个Promise
        getCarousel().then((res) => {
            // console.log("获取轮播");
            if (res) {
                // console.log(res);
                if (res.code === CODE_SUCCESS) {
                    // 请求成功后调用setState更新UI，组件更新完成后会立即调用第二个参数的回调函数
                    this.setState({
                        sliderList: res.data.slider
                    }, () => {
                        if (!this.sliderSwiper) {
                            // 在回调函数里初始化swiper
                            this.sliderSwiper = new Swiper(".slider-container", {
                                loop: true,
                                // 自动切换
                                autoplay: 3000,
                                // 用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay
                                autoplayDisableOnInteraction: false,
                                // 圆圈指示符按钮
                                pagination: '.swiper-pagination'
                            });
                        }
                    });
                }
            }
        });
        getNewAlbum().then((res) => {
            // console.log("获取最新专辑");
            if (res) {
                // console.log(res);
                if (res.code === CODE_SUCCESS) {
                    // 根据发布时间降序排列
                    let albumList = res.albumlib.data.list;
                    albumList.sort((a, b) => {
                        return new Date(b.public_time).getTime() - new Date(a.public_time).getTime();
                    });
                    this.setState({
                        newAlbums: albumList,
                        loading: false
                    }, () => {
                        // 刷新scroll
                        this.setState({refreshScroll: true});
                    });
                }
            }
        });
    }
    toLink(linkUrl) {
        /* url跳转到QQ自己的url，使用闭包把参数变成局部变量使用 */
        return () => {
            window.location.href = linkUrl;
        };
    }
    toAlbumDetail(url) {
		/* scroll组件会派发一个点击事件，不能使用链接跳转 */
		return () => {
            // 使用React路由提供的history对象实现路由跳转，使用闭包函数把每次循环传入的url作为局部变量。每次点击item获取到的都是对应传递的url
			this.props.history.push({
				pathname: url
            });
		}
	}
    render() {
        // 每个组件的props都有match，有url、params,path等相关信息。然后在根路径下添加子路由
        // console.log(this);
        let {match} = this.props;
        let albums = this.state.newAlbums.map(item => {
            // 通过createAlbumByList函数创建专辑对象
            let album = AlbumModel.createAlbumByList(item);
            return (
                <div className="album-wrapper" key={album.mId} onClick={this.toAlbumDetail(`${match.url + '/' + album.mId}`)}>
                    <div className="left-area">
                        <LazyLoad height={60}>
                            <img src={album.img} width="100%" height="100%" alt={album.name} />
                        </LazyLoad>
                    </div>
                    <div className="right-area">
                        <div className="album-name">
                             {album.name}
                        </div>
                        <div className="singer-name">
                            {album.singer}
                        </div>
                        <div className="public—time">
                            {album.publicTime}
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div className="music-recommend">
                {/* forceCheck检查懒加载组件是否出现在视图中，如果出现就加载组件  */}
                <Scroll refresh={this.state.refreshScroll} onScroll={(e) => {forceCheck();}}>
                {/* 必须为Scroll增加一个根元素 */}
                <div>
                <div className="slider-container">
                    <div className="swiper-wrapper">
                        {
                            this.state.sliderList.map(slider => {
                                return (
                                    <div className="swiper-slide" key={slider.id}>
                                        <a className="slider-nav" onClick={this.toLink(slider.linkUrl)}>
                                            <img src={slider.picUrl} width="100%" height="100%" alt="推荐"/>
                                        </a>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {/* 圆圈指示符 */}
                    <div className="swiper-pagination"></div>  
                </div>
                
                <div className="album-container" style={this.state.loading === true ? {display:"none"} : {}}>
                    <h1 className="title">最新专辑</h1>
                    <div className="album-list">
                        {albums}
                    </div>
                </div>
                </div>
                </Scroll>
                <Loading title="٩(๑>₃<)۶ 正在玩命加载..." show={this.state.loading}/>
				 <Route path={`${match.url + '/:id'}`} component={Album} /> 
            </div>
        );
    }
}

export default Recommend;