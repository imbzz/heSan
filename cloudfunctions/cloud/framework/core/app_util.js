/**
 * Notes: 云函数业务主逻辑函数
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-02-09 04:00:00 
 */
/**SUCC: 200,
	SVR: 500, // 服务器错误  
	LOGIC: 1600, //逻辑错误 
	DATA: 1301, // 数据校验错误 
	HEADER: 1302, // header 校验错误  


	//2000开始为业务错误代码，

    ADMIN_ERROR: 2401 //管理员错误
    **/
const appCode = require('./app_code.js');//上面就是这条路径的逻辑码


function handlerBasic(code, msg = '', data = {}) {//根据错误码

	switch (code) {
		case appCode.SUCC:
			msg = (msg) ? msg + ':ok' : 'ok';
			break;
		case appCode.SVR:
			msg = '服务器繁忙，请稍后再试';
			break;
		case appCode.LOGIC:
			break;
		case appCode.DATA:
			break;

			/*
			default:
				msg = '服务器开小差了，请稍后再试';
				break;*/
	}

	return {
		code: code,
		msg: msg,
		data: data
	}

}

function handlerSvrErr(msg = '') {//服务器错误
	return handlerBasic(appCode.SVR, msg);
}

function handlerSucc(msg = '') {//成功
	return handlerBasic(appCode.SUCC, msg);
}

function handlerAppErr(msg = '', code = appCode.LOGIC) {//逻辑错误
	return handlerBasic(code, msg);
}


function handlerData(data, msg = '') {//数据错误
	return handlerBasic(appCode.SUCC, msg, data);
}

module.exports = {
	handlerBasic,
	handlerData,
	handlerSucc,
	handlerSvrErr,
	handlerAppErr
}