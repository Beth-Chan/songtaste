import jsonp from "./jsonp"; // 下面函数都是利用JSONP抓取数据，所以要导入api下的jsonp.js，不用加花括号是因为jsonp.js中导出是用export default
import {URL, PARAM, OPTION} from "./config";

/**
 * Object.assign方法合并对象，将接口的公共参数和轮播图特有的参数合并，相同的属性值会被覆盖
 * 轮播图的url是：https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg
 * 查询字符串是：g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1515763697741
 */
// JSONP原理：动态生成一个<script>标签，其src由接口url、请求参数、callback函数名拼接而成，利用<script>标签没有跨域限制的特性实现跨域请求。

export function getCarousel() {
    const data = Object.assign({}, PARAM, {
		// 下面是除了接口公共参数外的其他参数
        g_tk: 701075963,
		uin: 0,
		platform: "h5",
		needNewCode: 1,
		_: new Date().getTime()
    });
    return jsonp(URL.carousel, data, OPTION);
}

export function getNewAlbum() {
	const data = Object.assign({}, PARAM, {
		g_tk: 1278911659,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		data: `{"albumlib":
		{"method":"get_album_by_tags","param":
		{"area":1,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":50,"click_albumid":0},
		"module":"music.web_album_library"}}`
	});
	const option = {
		param: "callback",
		prefix: "callback"
	};
	return jsonp(URL.newalbum, data, option);
}

/**
 * 获取专辑请求
 * @param {string} albumMid 请求地址的albumMid参数
 */
export function getAlbumInfo(albumMid) {
	const data = Object.assign({}, PARAM, {
		albummid: albumMid,
		g_tk: 1278911659,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0
	});
	return jsonp(URL.albumInfo, data, OPTION);
}