import jsonp from "./jsonp"
import {URL, PARAM} from "./config"

export function getSongVKey(songMid) {
	// Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。 Object.assign(target, ...sources) target目标对象。 sources源对象。
	const data = Object.assign({}, PARAM, {
		g_tk: 1278911659,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		cid: 205361747,
		uin: 0,
		songmid: songMid,
		filename: `C400${songMid}.m4a`,
		guid: 3655047200
	});
	const option = {
		param: "callback",
		prefix: "callback"
	};
	return jsonp(URL.songVkey, data, option);
}