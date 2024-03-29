/**
 * Notes: 云初始化实例
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2022-12-23 19:20:00
 */

const config = require('../../config/config.js');

/**
 * 获得云实例
 */
function getCloud() {
	const cloud = require('wx-server-sdk');
	cloud.init({
		env: config.CLOUD_ID
	});
	return cloud;
}

module.exports = {
	getCloud
}