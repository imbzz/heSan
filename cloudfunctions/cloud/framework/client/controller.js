 /**
  * Notes: 基础控制器
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED 
  * Date: 2022-09-05 04:00:00 
  */
 class Controller {

 	constructor(route, openId, event) {//直接this相当于赋值 //路由 用户身份 所以参数 数据参数
 		this._route = route; // 路由
 		this._openId = openId; //用户身份
		this._event = event; // 所有参数   
		this._request = event.params; //数据参数

 	}
 }

 module.exports = Controller;