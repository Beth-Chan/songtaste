import {connect} from "react-redux"
import {showPlayer, changeSong} from "../redux/actions"
import Player from "../components/play/Player"

/**
 * 作为容器组件，要做的工作无外乎两件事：
 *     一是把Store上的state转化为UI组件的prop
 *     二是把UI组件中的用户动作转化为派送给Store的动作
 */

// 映射Redux全局(store)的state到组件的props上,，Player组件会订阅store，当store的状态发生修改时会调用render方法触发更新
const mapStateToProps = (state) => ({
    showStatus: state.showStatus,
    currentSong: state.song,
    playSongs: state.songs
});

// 映射用户动作
const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (status) => {
        // Store上的dispatch函数派发action对象
        dispatch(showPlayer(status));
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song));
    }
});

// 将UI组件包装成容器组件，最后产生的是容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Player)