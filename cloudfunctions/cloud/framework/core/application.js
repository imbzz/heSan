/**
 * Notes: 云函数业务主逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY c1756612361@qq.com
 * Date: 2022-09-05 04:00:00 
 */
const util = require('../utils/util.js');
const cloudBase = require('../cloud/cloud_base.js');
const timeUtil = require('../utils/time_util.js');
const appUtil = require('./app_util.js');
const appCode = require('./app_code.js');
const appOther = require('./app_other.js');
const config = require('../../config/config.js');
const routes = require('../../config/route.js');//通过小程序端上传的字符串调用云端写的路径
const MeetModel=require('../../project/model/meet_model.js');///
/*
'home/setup_all': 'home_controller@getSetupAll', //获取全局配置(所有)admin/meet_edit

'passport/phone': 'passport_controller@getPhone',
'passport/my_detail': 'passport_controller@getMyDetail',
'passport/edit_base': 'passport_controller@editBase',

'news/list': 'news_controller@getNewsList',
'news/home_list': 'news_controller@getHomeNewsList',
'news/view': 'news_controller@viewNews', 
'news/addStatus':'news_controller@addNewsStatus',

'meet/list': 'meet_controller@getMeetList',
'meet/list_by_day': 'meet_controller@getMeetListByDay',
'meet/list_has_day': 'meet_controller@getHasDaysFromDay',
'meet/view': 'meet_controller@viewMeet',
'meet/detail_for_join': 'meet_controller@detailForJoin',
'meet/before_join': 'meet_controller@beforeJoin',
'meet/join': 'meet_controller@join',

'my/my_join_list': 'meet_controller@getMyJoinList',
'my/my_join_cancel': 'meet_controller@cancelMyJoin',
'my/my_join_detail': 'meet_controller@getMyJoinDetail',
'my/my_join_someday': 'meet_controller@getMyJoinSomeday',
'my/my_join_checkin': 'meet_controller@userSelfCheckin', 

'test/test': 'test/test_controller@test',
'test/meet_test_join': 'test/test_meet_controller@testJoin',

//***########### ADMIN ################## */  
/*'admin/login': 'admin/admin_home_controller@adminLogin',
'admin/home': 'admin/admin_home_controller@adminHome',
'admin/clear_cache': 'admin/admin_home_controller@clearCache#noDemo',

'admin/setup_about': 'admin/admin_setup_controller@setupAbout#noDemo',
'admin/setup_contact': 'admin/admin_setup_controller@setupContact#noDemo', 
'admin/setup_qr': 'admin/admin_setup_controller@genMiniQr', 

'admin/news_list': 'admin/admin_news_controller@getNewsList',
'admin/news_insert': 'admin/admin_news_controller@insertNews#noDemo',
'admin/news_detail': 'admin/admin_news_controller@getNewsDetail',
'admin/news_edit': 'admin/admin_news_controller@editNews#noDemo',
'admin/news_update_pic': 'admin/admin_news_controller@updateNewsPic#noDemo',
'admin/news_update_content': 'admin/admin_news_controller@updateNewsContent#noDemo',
'admin/news_del': 'admin/admin_news_controller@delNews#noDemo', 
'admin/news_sort': 'admin/admin_news_controller@sortNews#noDemo',
'admin/news_status': 'admin/admin_news_controller@statusNews#noDemo',
'admin/news_addStatus':'admin/admin_news_controller@statusInc#noDemo',

'admin/meet_list': 'admin/admin_meet_controller@getMeetList',
'admin/meet_join_list': 'admin/admin_meet_controller@getJoinList',
'admin/join_status': 'admin/admin_meet_controller@statusJoin#noDemo',
'admin/join_del': 'admin/admin_meet_controller@delJoin#noDemo',
'admin/meet_insert': 'admin/admin_meet_controller@insertMeet#noDemo',
'admin/meet_detail': 'admin/admin_meet_controller@getMeetDetail',
'admin/meet_edit': 'admin/admin_meet_controller@editMeet#noDemo',
'admin/meet_del': 'admin/admin_meet_controller@delMeet#noDemo',
'admin/meet_update_content': 'admin/admin_meet_controller@updateMeetContent#noDemo',
'admin/meet_update_style': 'admin/admin_meet_controller@updateMeetStyleSet#noDemo',
'admin/meet_sort': 'admin/admin_meet_controller@sortMeet#noDemo',
'admin/meet_status': 'admin/admin_meet_controller@statusMeet#noDemo',
'admin/meet_cancel_time_join': 'admin/admin_meet_controller@cancelJoinByTimeMark#noDemo',
'admin/join_scan': 'admin/admin_meet_controller@scanJoin#noDemo',
'admin/join_checkin': 'admin/admin_meet_controller@checkinJoin#noDemo',
'admin/self_checkin_qr': 'admin/admin_meet_controller@genSelfCheckinQr',
'admin/meet_day_list': 'admin/admin_meet_controller@getDayList',

'admin/join_data_get': 'admin/admin_export_controller@joinDataGet',
'admin/join_data_export': 'admin/admin_export_controller@joinDataExport',
'admin/join_data_del': 'admin/admin_export_controller@joinDataDel#noDemo',

'admin/temp_insert': 'admin/admin_meet_controller@insertTemp#noDemo',
'admin/temp_list': 'admin/admin_meet_controller@getTempList',
'admin/temp_del': 'admin/admin_meet_controller@delTemp#noDemo',
'admin/temp_edit': 'admin/admin_meet_controller@editTemp#noDemo', 

'admin/log_list': 'admin/admin_mgr_controller@getLogList',

'admin/user_list': 'admin/admin_user_controller@getUserList',
'admin/user_detail': 'admin/admin_user_controller@getUserDetail',
'admin/user_del': 'admin/admin_user_controller@delUser#noDemo',  

'admin/user_data_get': 'admin/admin_export_controller@userDataGet',
'admin/user_data_export': 'admin/admin_export_controller@userDataExport',
'admin/user_data_del': 'admin/admin_export_controller@userDataDel#noDemo',
**/
async function app(event, context) {//event包含上传的数据 context为上传状态数据
   
	// 非标业务处理
	let {
		eventX,
		isOther
	} = appOther.handlerOther(event);//是公众号事件就返回公众号路径到eventX  不是就不变
	event = eventX;//再换回event的名字

	// 取得openid
	const cloud = cloudBase.getCloud();//初始化环境获取wx-server-sdk
	const wxContext = cloud.getWXContext();//获取用户信息openid appId 和 unionId
	let r = '';
	try {

		if (!util.isDefined(event.route)) {//判断是否定义，如果没有定义就执行admin/meet_edit
			showEvent(event);//自定义函数 console打印数据
			console.error('Route Not Defined');
			return appUtil.handlerSvrErr();//服务器错误 返回服务器错误码 服务器繁忙 空数据
		}

		r = event.route.toLowerCase();//全部变小写admin/meet_edit//创建admin/meet_insert
		if (!r.includes('/')) {//如果不含斜杠就执行
			showEvent(event);
			console.error('Route Format error[' + r + ']');
			return appUtil.handlerSvrErr();
		}

		// 路由不存在
		if (!util.isDefined(routes[r])) {
			showEvent(event);
			console.error('Route [' + r + '] Is Not Exist');
			return appUtil.handlerSvrErr();
		}

		let routesArr = routes[r].split('@');//云端路由admin/meet_edit
       //admin/admin_meet_controller@editMeet#noDemo//admin/admin_meet_controller@insertMeet#noDemo
        let controllerName = routesArr[0];//操作身份:指哪个页面的名字
        //admin/admin_meet_controlle//admin/admin_home_controller@adminLogin
        let actionName = routesArr[1];//操作名字:什么操作//editMeet#noDemo
        //insertMeet#noDemo

		// 事前处理
		if (actionName.includes('#')) {
			let actionNameArr = actionName.split('#');//[editMeet,noDemo]
			actionName = actionNameArr[0];//editMeet//insertMeet
			if (actionNameArr[1] && config.IS_DEMO) {//后者为false不执行
				console.log('###演示版事前处理, APP Before = ' + actionNameArr[1]);
                return beforeApp(actionNameArr[1]);
			}
		}

		console.log('');
		console.log('');
		let time = timeUtil.time('Y-M-D h:m:s');
		let timeTicks = timeUtil.time();
		let openId = wxContext.OPENID;

		console.log('▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤');
		console.log(`【↘${time} ENV (${config.CLOUD_ID})】【Request Base↘↘↘】\n【↘Route =***${r}】\n【↘Controller = ${controllerName}】\n【↘Action = ${actionName}】\n【↘OPENID = ${openId}】`);


        
		// 引入逻辑controller //admin/admin_meet_controller
        controllerName = controllerName.toLowerCase().trim();//小写去空格
        //project/controller/admin/admin_meet_controlle.js
		const ControllerClass = require('project/controller/' + controllerName + '.js');//引入控制类//insertMeet#noDemo//r:admin/meet_insert
        const controller = new ControllerClass(r, openId, event);//r是路径 openID,事件
        //创建一个ControllerClass对象
        //r:admin/meet_edit
        // 调用方法    

        // await controller['initSetup']();//调用initSetup函数 undefine//未了解自己看

        //------------------------------------------------------------------
      
            let result = await controller[actionName]();

       //预约编辑函数editMeet//insertMeet
        //没有返回值 此处出问题
        //------------------------------------------------------------------

		// 返回值处理
		if (isOther) {
			// 非标处理
			return result;
		} else {
			if (!result)
				result = appUtil.handlerSucc(r); // 无数据返回
            else{

                result = appUtil.handlerData(result, r); // 有数据返回
            }
		}


		console.log('------');
		time = timeUtil.time('Y-M-D h:m:s');
		timeTicks = timeUtil.time() - timeTicks;
		console.log(`【${time}】【Return Base↗↗↗】\n【↗Route =***${r}】\n【↗Duration = ${timeTicks}ms】\n【↗↗OUT DATA】= `, result);
		console.log('▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦');
		console.log('');
        console.log('');
		return result;


	} catch (ex) {
        const log = cloud.logger();

		console.log('------');
		time = timeUtil.time('Y-M-D h:m:s');
		console.error(`【${time}】【Return Base↗↗↗】\n【↗Route = ${r}】\Exception MSG = ${ex.message}, CODE=${ex.code}`);

		// 系统级错误定位调试
		if (config.TEST_MODE && ex.name != 'AppError') throw ex;

		console.log('▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦');
		console.log('');
		console.log('');

		if (ex.name == 'AppError') {
			log.warn({
				route: r,
				errCode: ex.code,
				errMsg: ex.message
			});
			// 自定义error处理
			return appUtil.handlerAppErr(ex.message, ex.code);
		} else {
			//console.log(ex); 
			log.error({
				route: r,
				errCode: ex.code,
				errMsg: ex.message,
				errStack: ex.stack
			});


			// 系统error
			return appUtil.handlerSvrErr();
		}
	}
}

// 事前处理
function beforeApp(method) {//暂时不会走到这里
	switch (method) {
		case 'noDemo': {
			return appUtil.handlerAppErr('本系统仅为客户体验演示，后台提交的操作均不生效！如有需要请联系作者qq:1756612361', appCode.LOGIC);
		}
	}
	console.error('事前处理, Method Not Find = ' + method);
}

// 展示当前输入数据
function showEvent(event) {
	console.log(event);
}

module.exports = {
	app
}