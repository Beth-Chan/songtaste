import React from "react"
import ReactDOM from "react-dom"
// import {CSSTransition} from "react-transition-group"
import Header from "../../common/header/Header"
import Scroll from "../../common/scroll/Scroll"
import Loading from "../../common/loading/Loading"
import {getAlbumInfo} from "../../api/recommend"
import {getSongVKey} from "../../api/song"
import {CODE_SUCCESS} from "../../api/config"
import * as AlbumModel from "../../model/Album"
import * as SongModel from "../../model/Song"
import "./album.styl"

class Album extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            album: {},
            songs: [],
            refreshScroll: false,
            show: false // 控制动画的状态
        }
    }
    componentDidMount() {
        this.setState({
            show: true
        });
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";
        // 通过match.params.id获取参数id，再发送请求获取到数据后先创建Album对象再创建Song列表，然后调用setState更新ui
        getAlbumInfo(this.props.match.params.id).then((res) => {
            // console.log("获取专辑详情：");
            if (res) {
                // console.log(res);
                if (res.code === CODE_SUCCESS) {
                    let album = AlbumModel.createAlbumByDetail(res.data);
                    album.desc = res.data.desc;

                    let songList = res.data.list;
                    let songs = [];
                    // 对歌曲进行遍历的时候调用getSongUrl获取歌曲文件地址
                    songList.forEach(item => {
                        let song = SongModel.createSong(item);
                        // 获取歌曲vkey,把song传递给getSongUrl的第一个参数，他们指向的是同一块内存，也就是说他们是同一个的实例，那么他们的url属性也是一样的。在getSongUrl中修改了url也就修改了传递进去的song对象的url属性
                        this.getSongUrl(song,item.songmid);
                        songs.push(song);
                    });
                    this.setState({
                        loading: false,
                        album: album,
                        songs: songs
                    }, () => {
                        // 刷新scroll
                        this.setState({refreshScroll:true});
                    });
                }
            }
        });
    }

    // 获取歌曲vkey
    getSongUrl(song,mId) {
        getSongVKey(mId).then((res) => {
            if(res) {
                if(res.code === CODE_SUCCESS) {
                    if(res.data.items) {
                        let item = res.data.items[0];
                        song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                    }
                }
            }
        });
    } 

    /**
	 * 播放全部
	 */
	playAll = () => {
		if (this.state.songs.length > 0) {
			// 添加播放歌曲列表
			this.props.setSongs(this.state.songs);
			this.props.changeCurrentSong(this.state.songs[0]);
			this.props.showMusicPlayer(true);
		}
	}

    /* 监听Scroll组件的滚动，判断y是否小于0，小于0表示向上滚动。
    当滚动y值的绝对值加上Header的高度大于图片高度的时候此时已经超过了Header的底部，
    这个时候显示隐藏的图片，向下滚动没有达到Header的底部时隐藏图片
    （这里使用了两张图片，其实也可以使用一张图片，当滚动到Header组件的底部的时候设置图片的高度和z-index即可） */ 
    // scroll y  就是y方向的偏移量 解构赋值
    scroll = ({y}) => {
		let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
		let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg);
		let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
		if (y < 0) {
			if (Math.abs(y) + 55 > albumBgDOM.offsetHeight) {
				albumFixedBgDOM.style.display = "block";
			} else {
				albumFixedBgDOM.style.display = "none";
			}
		} else {
			let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
			albumBgDOM.style["webkitTransform"] = transform;
			albumBgDOM.style["transform"] = transform;
			playButtonWrapperDOM.style.marginTop = `${y}px`;
		}
    }
    

    /**
	 * 选择歌曲
	 */
	selectSong(song) {
		return (e) => {
            // setSongs和changeCurrentSong都是通过mapDispatchToProps映射到组件的props上
			this.props.setSongs([song]);
			this.props.changeCurrentSong(song);
			// this.startMusicIcoAnimation(e.nativeEvent);
		};
	}

    render() {
        let album = this.state.album;
        let songs = this.state.songs.map((song) => {
            return (
                <div className="song" key={song.id} onClick={this.selectSong(song)}>
                    <div className="song-name">{song.name}</div>
                    <div className="song-singer">{song.singer}</div>
                </div>
            );
        });
        return (
            // in控制组件的状态。当in为true时，组件的子元素会应用translate-enter、translate-enter-active样式（在app.styl文件里），当in为false时，组件的子元素会应用translate-exit、translate-exit-active样式（这里不定义）。timeout指定过渡时间
            // <CSSTransition in={this.state.show} timeout={300} className="translate">
            <div className="music-album">
                <Header title={album.name} ref="header" className="music-header"></Header>
                <div style={{position:"relative"}}>
                    <div ref="albumBg" className="album-img" style={{backgroundImage: `url(${album.img})`}}>
                        <div className="filter"></div>
                    </div>
                    <div ref="albumFixedBg" className="album-img fixed" style={{backgroundImage: `url(${album.img})`}}>
                        <div className="filter"></div>
                    </div>
                    <div className="play-wrapper" ref="playButtonWrapper">
                        <div className="play-button" onClick={this.playAll}>
                            {/* 播放图标 */}
                            <i className="icon-play"></i>
                            <span>播放全部</span>
                        </div>
                    </div>
                </div>
                <div ref="albumContainer" className="album-container">
                    <div className="album-scroll" style={this.state.loading === true ? {display:"none"} : {}}>
                        <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                            <div className="album-wrapper">
                                <div className="song-count">专辑 共{songs.length}首</div>
                                <div className="song-list">
                                    {songs}
                                </div>
                                <div className="album-info" style={album.desc? {} : {display:"none"}}>
                                    <h1 className="album-title">专辑简介</h1>
                                    <div className="album-desc">
                                        {album.desc}
                                    </div>
                                </div>
                            </div>
                        </Scroll>
                    </div>
                    <Loading title="正在加载..." show={this.state.loading}/>
                </div>
            </div>
            // </CSSTransition>
        );
    }
}

export default Album