import React from "react"
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"
import Progress from "./Progress"
import MiniPlayer from "./MiniPlayer"

import "./player.styl"
import {Song} from "../../model/Song"

/* 切换歌曲播放模式、上一首、下一首、播放、暂停等功能 */
class Player extends React.Component {
	constructor(props) {
		super(props);

		// 首先实例化一个Song对象；当前播放歌曲
		this.currentSong = new Song( 0, "", "", "", 0, "", "");
		// 当前播放歌曲索引
		this.currentIndex = 0;
		// 拖拽进度
		this.dragProgress = 0;
		// audio在移动端未触摸屏幕第一次是无法自动播放的,在组件更新后判断这个属性是否为true，如果为tru就开始播放，然后设置为false
		this.isFirstPlay = true;

		// 播放模式： list-列表 single-单曲 shuffle-随机
		this.playModes = ["list", "single", "shuffle"];

		this.state = {
			// 当前播放时间
			currentTime: 0,
			// 播放进度
			playProgress: 0,
			// 播放状态
			playStatus: false,
			// 当前播放模式
			currentPlayMode: 0
		}
	}
	componentDidUpdate() {
		// 兼容手机端canplay事件触发后第一次调用play()方法无法自动播放的问题
		if (this.isFirstPlay === true) {
			this.audioDOM.play();
			this.isFirstPlay = false;
		}
	}
	componentDidMount() {
		this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
		this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
		this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
		this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg);

        // 给audio元素添加canplay事件，当浏览器能够开始播放指定的音频时触发
		this.audioDOM.addEventListener("canplay", () => {
				this.audioDOM.play();
				this.startImgRotate();

				this.setState({
					playStatus: true
				});
			
		}, false);

		// 给audio元素添加timeupdate 事件，在音频播放位置发生改变时触发
		this.audioDOM.addEventListener("timeupdate", () => {
			if (this.state.playStatus === true) {
				this.setState({
					// 播放进度即当前播放时间除以音频长度
					playProgress: this.audioDOM.currentTime / this.audioDOM.duration,
					currentTime: this.audioDOM.currentTime
				});
			}
		}, false);

		// 给audio添加ended事件，在音频播放完成后触发，进行播放完成后的处理
		this.audioDOM.addEventListener("ended", () => {
			if (this.props.playSongs.length > 1) {
				let currentIndex = this.currentIndex;
				if (this.state.currentPlayMode === 0) {  // 列表播放
					if(currentIndex === this.props.playSongs.length - 1){
						currentIndex = 0;
					}else{
						currentIndex = currentIndex + 1;
					}
				} else if (this.state.currentPlayMode === 1) {  // 单曲循环
					// 继续播放当前歌曲
					this.audioDOM.play();
					return;
				} else {  // 随机播放
					let index = parseInt(Math.random() * this.props.playSongs.length, 10);
					currentIndex = index;
				}
				this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
				// 调用父组件修改当前歌曲位置
				this.props.changeCurrentIndex(currentIndex);

				// this.audioDOM.src = currentSong.url;
				// 重新加载歌曲
				// this.audioDOM.load();
			} else {
				if (this.state.currentPlayMode === 1) {  // 单曲循环
					// 继续播放当前歌曲
					this.audioDOM.play();
				} else {
					// 暂停
					this.audioDOM.pause();
					this.stopImgRotate();

					this.setState({
						playProgress: 0,
						currentTime: 0,
						playStatus: false
					});
				}
			}
		}, false);

		// error事件处理
		this.audioDOM.addEventListener("error", () => {alert("加载歌曲出错！")}, false);
	}

	/**
	 * 播放或暂停 ES7的属性初始化语法（property initializers syntax)
	 */
	playOrPause = () => {
		if(this.audioDOM.paused){
			this.audioDOM.play();
			this.startImgRotate();

			this.setState({
				playStatus: true
			});
		}else{
			this.audioDOM.pause();
			this.stopImgRotate();

			this.setState({
				playStatus: false
			});
		}
	}
	/**
	 * 上一首
	 */
	previous = () => {
		// 如果当前只有一首歌曲的时候播放模式不起作用
		if (this.props.playSongs.length > 0 && this.props.playSongs.length !== 1) {
			// 改变当前播放歌曲的索引就可以了
			let currentIndex = this.currentIndex;
			if (this.state.currentPlayMode === 0) {  // 列表播放
				if(currentIndex === 0){
					currentIndex = this.props.playSongs.length - 1;
				}else{
					currentIndex = currentIndex - 1;
				}
			} else if (this.state.currentPlayMode === 1) {  // 单曲循环
				currentIndex = this.currentIndex;
			} else {  // 随机播放
				let index = parseInt(Math.random() * this.props.playSongs.length, 10);
				currentIndex = index;
			}
			this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
			// 调用父组件修改当前歌曲位置
			this.props.changeCurrentIndex(currentIndex);
			
			// 重新加载歌曲
			//this.audioDOM.load();
		}
	}
	/**
	 * 下一首
	 */
	next = () => {
		if (this.props.playSongs.length > 0  && this.props.playSongs.length !== 1) {
			let currentIndex = this.currentIndex;
			if (this.state.currentPlayMode === 0) {  // 列表播放
				if(currentIndex === this.props.playSongs.length - 1){
					currentIndex = 0;
				}else{
					currentIndex = currentIndex + 1;
				}
			} else if (this.state.currentPlayMode === 1) {  // 单曲循环
				currentIndex = this.currentIndex;
			} else {  // 随机播放
				let index = parseInt(Math.random() * this.props.playSongs.length, 10);
				currentIndex = index;
			}
			this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
			// 调用父组件修改当前歌曲位置
			this.props.changeCurrentIndex(currentIndex);

			// 重新加载歌曲
			//this.audioDOM.load();
		}
	}
	/*
	 * 开始旋转图片
	 */
	startImgRotate = () => {
		if (this.singerImgDOM.className.indexOf("rotate") === -1) {
			// 添加rotate样式
			this.singerImgDOM.classList.add("rotate");
		} else {
			// 就是CSS3的animation-play-state属性，通过JavaScript的方式播放动画
			this.singerImgDOM.style["webkitAnimationPlayState"] = "running";
			this.singerImgDOM.style["animationPlayState"] = "running";
		}
	} 
	/**
	 * 停止旋转图片
	 */
	stopImgRotate = () => {
		// 通过JavaScript的方式在播放过程中暂停动画
		this.singerImgDOM.style["webkitAnimationPlayState"] = "paused";
		this.singerImgDOM.style["animationPlayState"] = "paused";
	}
	/**
	 * 显示播放列表
	 */
	showPlayList = () => {
		this.props.showList(true);
	}
	/**
	 * 隐藏播放器
	 */
	hidePlayer = () => {
		this.props.showMusicPlayer(false);
	}
	/**
	 * 显示播放器
	 */
	showPlayer = ()=> {
		this.props.showMusicPlayer(true);
	}
	/**
	 * 改变播放模式
	 */
	changePlayMode = ()=> {
		if (this.state.currentPlayMode === this.playModes.length - 1) {
			this.setState({currentPlayMode:0});
		} else {
			this.setState({currentPlayMode:this.state.currentPlayMode + 1});
		}
	}
	/**
	 * 开始拖拽
	 */
	handleDrag = (progress) => {
		if (this.audioDOM.duration > 0) {
			this.audioDOM.pause();

			this.stopImgRotate();

			this.setState({
				playStatus: false
			});
			this.dragProgress = progress;
		}
	}
	/**
	 * 拖拽结束
	 */
	handleDragEnd = () => {
		if (this.audioDOM.duration > 0) {
			let currentTime = this.audioDOM.duration * this.dragProgress;
			this.setState({
				playProgress: this.dragProgress,
				currentTime: currentTime
			}, () => {
				this.audioDOM.currentTime = currentTime;
				this.audioDOM.play();

				this.startImgRotate();

				this.setState({
					playStatus: true
				});
				this.dragProgress = 0;
			});
		}
	}
	render() {
		this.currentIndex = this.props.currentIndex;

		// 从redux中获取当前播放歌曲
		if (this.props.currentSong && this.props.currentSong.url) {
			// 当前歌曲发生变化
			if (this.currentSong.id !== this.props.currentSong.id) {
				this.currentSong = this.props.currentSong;
				this.audioDOM.src = this.currentSong.url;
				// 加载资源，ios需要调用此方法
				this.audioDOM.load();
			}
		}
		let song = this.currentSong;

		let playBg = song.img ? song.img : require("../../assets/img/play_bg.jpg");

		//播放按钮样式
		let playButtonClass = this.state.playStatus === true ? "icon-pause" : "icon-play";

		song.playStatus = this.state.playStatus;
		return (
			<div className="player-container">
				<CSSTransition in={this.props.showStatus} timeout={300} classNames="player-rotate"
					onEnter={() => {
						this.playerDOM.style.display = "block";
					}}
					onExited={() => {
						this.playerDOM.style.display = "none";
					}}>
				<div className="player" ref="player" style={{display:this.props.showStatus === true? "block" : "none"}}>
					<div className="header">
						{/* Player和MiniPlayer两个组件的显示状态是相反的，在某一个时候只会有一个显示另一个隐藏 */}
						<span className="header-back" onClick={this.hidePlayer}>
							<i className="icon-back"></i>
						</span>
						<div className="header-title">
							{song.name}
						</div>
					</div>
					<div className="singer-top">
						<div className="singer">
							<div className="singer-name">{song.singer}</div>
						</div>
					</div>
					 <div className="singer-middle">
						<div className="singer-img" ref="singerImg">
							<img src={playBg} alt={song.name} onLoad={
								(e) => { 
								
									 this.playerBgDOM.style.backgroundImage = `url("${playBg}")`;
								}
							}/>
						</div>
							 {/* 图片加载完成后设置背景，防止图片加载过慢导致没有背景  */}
					</div> 
					<div className="singer-bottom">
						<div className="controller-wrapper">
							<div className="progress-wrapper">
								<span className="current-time">{getTime(this.state.currentTime)}</span>
								<div className="play-progress">
									<Progress progress={this.state.playProgress}
									onDrag={this.handleDrag}
									onDragEnd={this.handleDragEnd}/>
								</div>
								<span className="total-time">{getTime(song.duration)}</span>
							</div>
							<div className="play-wrapper">
								<div className="play-model-button" onClick={this.changePlayMode}>
									<i className={"icon-" + this.playModes[this.state.currentPlayMode] + "-play"}></i>
								</div>
								<div className="previous-button" onClick={this.previous}>
									<i className="icon-previous"></i>
								</div>
								<div className="play-button" onClick={this.playOrPause}>
									<i className={playButtonClass}></i>
								</div>
								<div className="next-button" onClick={this.next}>
									<i className="icon-next"></i>
								</div>
								<div className="play-list-button" onClick={this.showPlayList}>
									<i className="icon-play-list"></i>
								</div>
							</div>
						</div>
					</div>
					<div className="player-bg" ref="playerBg"></div>
					{/* 通过HTML5的audio标签实现音频播放 */}
					<audio ref="audio"></audio>
				</div>
				</CSSTransition>
				 <MiniPlayer song={song} progress={this.state.playProgress}  
					playOrPause={this.playOrPause}
					next={this.next}
					showStatus={this.props.showStatus}
					showMiniPlayer={this.showPlayer}/> 
			</div>
		);
	}
}

function getTime(second){
	second = Math.floor(second);
	let minute = Math.floor(second / 60);
	second = second - minute * 60;
	return minute  + ":" + formatTime(second);
}
function formatTime(time){
	let timeStr = "00";
	if(time > 0 && time < 10){
		timeStr = "0" + time;
	}else if(time >= 10){
		timeStr = time;
	}
	return timeStr;
}

export default Player