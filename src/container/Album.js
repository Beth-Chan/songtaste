import {connect} from "react-redux"
import {showPlayer, changeSong, setSongs} from "../redux/actions"
import Album from "../components/album/Album"

// UI组件
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
	showMusicPlayer: (status) => {
		dispatch(showPlayer(status));
	},
	changeCurrentSong: (song) => {
		dispatch(changeSong(song));
	},
	setSongs: (songs) => {
		dispatch(setSongs(songs));
	}
});

// connect第一个参数用来映射store到组件props上，这里不需要获取store的状态，传入null
export default connect(null, mapDispatchToProps)(Album)
