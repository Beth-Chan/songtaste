const URL = {
    carousel: "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",
    // 完整是 https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1515763697741
    newalbum: "https://u.y.qq.com/cgi-bin/musicu.fcg",
    albumInfo: "https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg",
    songVkey: "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg"
};

/**
 * 接口公用参数
 */
const PARAM = {
    format: "jsonp",
    inCharset: "utf-8",
    outCharset: "utf-8",
    notice: 0
};

/**
 * 选项
 */
const OPTION = {
    // jsonp回调函数名，如不需要jsonp调用，将format参数值修改为json并且去掉jsonpCallback参数 
    param: "jsonpCallback", // qq音乐的jsonp callback是叫jsonpCallback
    prefix: "callback" // callback的前缀
};

/**
 * 接口code码
 */
const CODE_SUCCESS = 0;

export {URL, PARAM, OPTION, CODE_SUCCESS};