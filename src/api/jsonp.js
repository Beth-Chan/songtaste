import originJsonp from "jsonp";

/* 使用ES6的Promise对象将jsonp代码封装成同步代码形式，这个函数返回一个Promise对象 */
let jsonp = (url, data, option) => {
    // 在Promise构造函数内调用jsonp，请求成功时调用resolve函数把data的值传出去，请求错误时调用reject函数把err的值传出去。
    return new Promise((resolve, reject) => {
        originJsonp(buildUrl(url, data), option, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};

// 所有的query param通过data加到url后，最后变成xxxx?参数名1=参数值1&参数名2=参数值2这种形式.
function buildUrl(url,data) {
    let params = [];
    for (var k in data) { // 把data遍历放进params数组
        params.push(`${k}=${encodeURIComponent(data[k])}`); // ES6语法
    }
    let param = params.join("&"); // 把数组中的所有元素放入param字符串。
    if (url.indexOf("?") === -1) { // 没有问号在后面加?和转化后的param字符串
        url += "?" + param;
    } else { // 有问号就会有查询字符串，直接在后面加&和转化后的param字符串
        url += "&" + param;
    }
    return url;
}

export default jsonp;