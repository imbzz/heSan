/**
 * Notes: 微信缓存二次封装，有设置时效性的封装
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */
const {
    ADMIN_TOKEN_EXPIRE
} = require('../setting/setting.js');
const helper = require('./helper.js');

const TIME_SUFFIX = "_deadtime"

/**
 * 设置过期时间用于判断是否过期
 * k 键key
 * v 值value
 * t 秒
 *   k:CACHE_ADMIN: 'ADMIN_TOKEN', // 管理员登录
         t： ADMIN_TOKEN_EXPIRE: 3600 * 2, //管理员过期时间2小时有效 秒  
          //login:v=
               //code: 200
               // data:
               // cnt: 49
               // last: "2022-08-01 22:04:22"
               // name: "系统管理员"
               // token: "zdm2grxqepwy3ssv9jcs4qpg9blqnqqp" 云函数获取
               // type: 1
               // __proto__: Object
               // msg: "admin/login:ok"
 */
function set(k, v, t = 86400 * 30) {
    if (!k) return null;

    wx.setStorageSync(k, v);
    let seconds = parseInt(t);
    if (seconds > 0) {
        let newtime = Date.parse(new Date());
        newtime = newtime / 1000 + seconds;
        wx.setStorageSync(k + TIME_SUFFIX, newtime + "");
    } else {
        wx.removeStorageSync(k + TIME_SUFFIX);
    }
}


/**
 * 获取
 * k 键key
 * def 默认值
 *  	CACHE_TOKEN: 'CACHE_TOKEN', // 登录
 	    CACHE_ADMIN: 'ADMIN_TOKEN', // 管理员登录
 */
function get(k, def = null) {
    if (!k) return null;

    //获取本地缓存的字符串

    let deadtime = wx.getStorageSync(k + TIME_SUFFIX); //上面定义 TIME_SUFFIX = "_deadtime" 
    //deadtime为空返回空或def有值   //'ADMIN_TOKEN_deadtime'是一个串数字在constans文件中

    if (!deadtime) return def;

    deadtime = parseInt(deadtime); //把数字字符串转成数字 没有数字则转为NAN(not a number)=false
    if (!deadtime) return def;

    if (deadtime) {
        //'ADMIN_TOKEN_deadtime'是一串数字

        if (parseInt(deadtime) < Date.parse(new Date()) / 10000) { //如果执行说明管理者登录已过期
            wx.removeStorageSync(k); //去除缓存
            wx.removeStorageSync(k + TIME_SUFFIX); //去除缓存
            return def;
        }
    }
    let res = wx.getStorageSync(k); //获得管理者登录时的时间编号等信息
    if (helper.isDefined(res)) {

        return res; //返回登录信息
    } else {
        return def; //返回ADMIN_TOKEN_deadtime的数字 登录时set
    }
}

/**
 * 删除
 */
function remove(k) {
    if (!k) return null;

    wx.removeStorageSync(k);
    wx.removeStorageSync(k + TIME_SUFFIX);
}

/**
 * 清除所有key
 */
function clear() {
    wx.clearStorageSync();
}

module.exports = {
    set,
    get,
    remove,
    clear
}