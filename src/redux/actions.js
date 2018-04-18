import * as ActionTypes from "./actionTypes"
/**
 * Action构造函数，用来创建action对象。返回的action对象中必有一个type字段代表action类型，其他字段代表这个动作承载的数据
 * Action是把数据从应用传到store的有效载荷。它是store数据的唯一来源
 */
export function showPlayer(showStatus) {
	return { type: ActionTypes.SHOW_PLAYER, showStatus };
}
export function changeSong(song) {
	return { type: ActionTypes.CHANGE_SONG, song };
}
export function removeSong(id) {
	return { type: ActionTypes.REMOVE_SONG_FROM_LIST, id };
}
export function setSongs(songs) {
	return { type: ActionTypes.SET_SONGS, songs };
}