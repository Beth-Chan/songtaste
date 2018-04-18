import {connect} from "react-redux"
import {showPlayer, changeSong} from "../redux/actions"
import Player from "../components/play/Player"

// 映射Redux全局(store)的state到组件的props上,，Player组件会订阅store，当store的状态发生修改时会调用render方法触发更新
const mapStateToProps = (state) => ({
    showStatus: state.showStatus,
    currentSong: state.song,
    playSongs: state.songs
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (status) => {
        // Store上的dispatch函数派发action对象
        dispatch(showPlayer(status));
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song));
    }
});

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Player)