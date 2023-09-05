/**
 * Notes: 云函数非标业务处理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2022-10-21 04:00:00 
 */

function handlerOther(event) {
	let isOther = false;

	if (!event) return {
		isOther,//false
		eventX//null
	};//如果event空返回空eventX

	// 公众号事件处理
	if (event['FromUserName'] && event['MsgType']) {
		console.log('公众号事件处理');
		let ret = {
			route: 'oa/serve',
			params: event
		}
		return {
			isOther: true,
			eventX: ret
		};
	}

	return {
		isOther,
		eventX: event
	};
}


module.exports = {
	handlerOther,
}