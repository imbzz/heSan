 /**
  * Notes: 云操作类库
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
  * Date: 2020-11-14 07:48:00 
  */

 const helper = require('./helper.js');
 const dataHelper = require('./data_helper.js');
 const cacheHelper = require('./cache_helper.js');
 const constants = require('../biz/constants.js');
 const setting = require('../setting/setting.js');
 const contentCheckHelper = require('../helper/content_check_helper.js');
 const pageHelper = require('../helper/page_helper.js');


 const CODE = {
 	SUCC: 200,
 	SVR: 500, //服务器错误  
 	LOGIC: 1600, //逻辑错误 
 	DATA: 1301, // 数据校验错误 
 	HEADER: 1302, // header 校验错误  

 	ADMIN_ERROR: 2401 //管理员错误
 };

 // 云函数提交请求(直接异步，无提示)
 function callCloudSumbitAsync(route, params = {}, options) {
 	if (!helper.isDefined(options)) options = {
 		hint: false
 	}
     if (!helper.isDefined(options.hint)) options.hint = false;
 	return callCloud(route, params, options)
 }

 // 云函数提交请求(异步) route为admin/meet_edit params为页面数据data options为空
 async function callCloudSumbit(route, params = {}, options) {//此时options作为参数无定义//创建admin/meet_insert
     
 	if (!helper.isDefined(options)) options = {//定义参数options
 		title: '提交中..'
     }
     if (!helper.isDefined(options.title)) options.title = '提交中..';
     let result=await callCloud(route, params, options);
     console.log(result);
     return result;///此处为作者限制
 }

 // 云函数获取数据请求(异步)
 async function callCloudData(route, params = {}, options) {
 	if (!helper.isDefined(options)) options = {
 		title: '加载中..'
 	}

 	if (!helper.isDefined(options.title)) options.title = '加载中..';
 	let result = await callCloud(route, params, options).catch(err => {
 		return null; // 异常情况下返回空数据 此处为作者设置的限制
 	});
 	// 直接提取数据 返回值有[], {} 两种形式，如果为空{} ,返回 null
 	if (result && helper.isDefined(result.data)) {
 		result = result.data;
 		if (Array.isArray(result)) {
 			// 数组处理
 		} else if (Object.keys(result).length == 0) {
 			result = null; //对象处理
 		}

 	}
 	return result;
 }

 // 云函数请求(异步)callCloud的定义 route为admin/meet_edit ,params为页面数据data ,options为空
 //route:admin/meet_list// params:isTotal: true oldTotal: 0,page: 1  //options:bar
 function callCloud(route, params = {}, options) {
    
 	let title = '加载中';
 	let hint = true; //数据请求时是否mask提示 
    
 	// 标题
 	if (helper.isDefined(options) && helper.isDefined(options.title))
 		title = options.title;//titile=加载中

 	// 是否给提示
 	if (helper.isDefined(options) && helper.isDefined(options.hint))
 		hint = options.hint;//hint=true
         
 	// 是否输出错误并处理
 	if (helper.isDefined(options) && helper.isDefined(options.doFail))
 		doFail = options.doFail;
         
 	if (hint) {
 		if (title == 'bar')
 			wx.showNavigationBarLoading();
 		else
 			wx.showLoading({
 				title: title,//title=true
 				mask: true
 			})
 	}
     
     //route:admin/meet_list// params:isTotal: true oldTotal: 0,page: 1  //options:bar

 	let token = '';
     // 管理员token，，route为admin/meet_edit ，params为页面数据data ，options为空
     //constants=>(
     //CACHE_TOKEN: 'CACHE_TOKEN',  登录
 	 //CACHE_ADMIN: 'ADMIN_TOKEN', 管理员登录 )//创建admin/meet_insert
     if (route.indexOf('admin/') > -1) {//返回admin/首字母的位置 是否为管理员
         let admin = cacheHelper.get(constants.CACHE_ADMIN);//'ADMIN_TOKEN' admin为null
         //admin为管理者登录时间姓名等信息

 		if (admin && admin.token) token = admin.token;
 	} else {
 		//正常用户
 		let user = cacheHelper.get(constants.CACHE_TOKEN);
 		if (user && user.id) token = user.id;
     }
     ///此处为限制路径
 	return new Promise(function (resolve, reject) {
        let PID = pageHelper.getPID();
        // console.log(route);
        // console.log(token);
        // console.log(PID);
        // console.log(params);
 		wx.cloud.callFunction({//cloud在哪
 			name: 'cloud',
 			data: {
 				route: route,//admin/login
 				token,//
 				PID,//A00
 				params//
             },
             
             success: function (res) {//作者的限制


 				if (res.result.code == CODE.LOGIC || res.result.code == CODE.DATA) {
                   
                     // 逻辑错误&数据校验错误 
                     // hint类型为true
 					if (hint) {
 						wx.showModal({
 							title: '温馨提示',
 							content: res.result.msg,//作者在成功申请函数后没有操作
 							showCancel: false
 						});
                     }
                     reject(res.result);
 					
 				} else if (res.result.code == CODE.ADMIN_ERROR) {
 					// 后台登录错误
 					wx.reLaunch({
 						url: '/pages/admin/index/login/admin_login',
 					});
                     //reject(res.result);
                     
 					return;
 				} else if (res.result.code != CODE.SUCC) {
 					if (hint) {
 						wx.showModal({
 							title: '温馨提示',
 							content: '系统开小差了，请稍后重试',
 							showCancel: false
 						});
 					}
 					reject(res.result);
 					return;//此处结束路径
 				}
                
 				resolve(res.result);
             },
             
 			fail: function (err) {
 				if (hint) {
 					console.log(err)
 					if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('Environment not found')) {
 						wx.showModal({
 							title: '',
 							content: '未找到云环境ID，请按手册检查前端配置文件setting.js的配置项【CLOUD_ID】或咨询作者qq:1756612361',
 							showCancel: false
 						});

 					} else if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('FunctionName')) {
 						wx.showModal({
 							title: '',
 							content: '云函数未创建或者未上传，请参考手册或咨询作者微信qq:1756612361',
 							showCancel: false
 						});

 					} else if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('performed in the current function state')) {
 						wx.showModal({
 							title: '',
 							content: '云函数正在上传中或者上传有误，请稍候',
 							showCancel: false
 						});
 					} else
 						wx.showModal({
 							title: '',
 							content: '网络故障，请稍后重试',
 							showCancel: false
 						});
 				}
 				reject(err.result);
 				return;
 			},
 			complete: function (res) {
 				if (hint) {
 					if (title == 'bar')
 						wx.hideNavigationBarLoading();
 					else
 						wx.hideLoading();
 				}
 				// complete
 			}
 		});
 	});
 }

 /**
  * 数据列表请求///////////////
  * @param {*} that 
  * @param {*} listName 
  * @param {*} route 
  * @param {*} params 
  * @param {*} options 
  * @param {*} isReverse  是否倒序
  */                   //this//_dataList//admin/meet_list//1//bar
// isTotal: true
// oldTotal: 0
// page: 1
 async function dataList(that, listName, route, params, options, isReverse = false) {

 	console.log('dataList begin');

 	if (!helper.isDefined(that.data[listName]) || !that.data[listName]) {
 		let data = {};
 		data[listName] = {
 			page: 1,
 			size: 20,
 			list: [],
 			count: 0,
 			total: 0,
 			oldTotal: 0
 		};
 		that.setData(data);
 	}
     
 	//改为后台默认控制
 	//if (!helper.isDefined(params.size))
 	//	params.size = 20;

 	if (!helper.isDefined(params.isTotal))
 		params.isTotal = true;
     //this//listName:_dataList//route:admin/meet_list// params:isTotal: true oldTotal: 0,page: 1  //options:bar
 	let page = params.page;//1
 	let count = that.data[listName].count;
 	if (page > 1 && page > count) {
 		wx.showToast({
 			duration: 500,
 			icon: 'none',
 			title: '没有更多数据了',
 		});
 		return;
 	}

 	// 删除未赋值的属性
 	for (let k in params) {
 		if (!helper.isDefined(params[k]))
 			delete params[k];
 	}

 	// 记录当前老的总数
 	let oldTotal = 0;
 	if (that.data[listName] && that.data[listName].total)
 		oldTotal = that.data[listName].total;
 	params.oldTotal = oldTotal;
//this//listName:_dataList//route:admin/meet_list// params:isTotal: true oldTotal: 0,page: 1  //options:bar
 	// 云函数调用 
 	await callCloud(route, params, options).then(function (res) {
         console.log('cloud begin');
 		// 数据合并
 		let dataList = res.data;
 		let tList = that.data[listName].list;

 		if (dataList.page == 1) {
 			tList = res.data.list;
 		} else if (dataList.page > that.data[listName].page) { //大于当前页才能更新
 			if (isReverse)
 				tList = res.data.list.concat(tList);
 			else
 				tList = tList.concat(res.data.list);
 		} else
 			return;

 		dataList.list = tList;
 		let listData = {};
 		listData[listName] = dataList;

 		that.setData(listData);

 		console.log('cloud END');
 	}).catch(err => {
 		console.log(err)
 	});

 	console.log('dataList END');

 }
/** 
 * 单个文件上传到云空间
 * @param {*} file 本地路径
 * @param {*} dir 路径前缀
 * @param {*} key  唯一标识(此处用账号+学院字符(待定))
 * @return 返回cloudId
 * 
 */
async function transTempFileOne(file, dir, key) {
////
   let filePath = file;
   let ext = filePath.match(/\.[^.]+?$/)[0];//match函数干嘛

   // 是否为临时文件
   if (filePath.includes('tmp') || filePath.includes('temp') || filePath.includes('wxfile')) {
       let rd = dataHelper.genRandomNum(100000, 999999);
    //    const cloud = cloudBase.getCloud();
      let upload =  await wx.cloud.uploadFile({
           cloudPath: key ? dir + key + '/' + rd + ext : dir + rd + ext,//云存储路径
           filePath: filePath, // 文件本地路径
       });
       if (!upload || !upload.fileID) return;
       return {
           cloudUrl:upload.fileID,
       }
   }

}

 /**
  * 图片上传到云空间
  * @param {*} imgList 
  * @param {*} dir 
  * @param {*} id 
  */
 async function transTempPics(imgList, dir, id) {

 	for (let i = 0; i < imgList.length; i++) {

 		let filePath = imgList[i];
 		let ext = filePath.match(/\.[^.]+?$/)[0];//match函数干嘛

 		// 是否为临时文件
 		if (filePath.includes('tmp') || filePath.includes('temp') || filePath.includes('wxfile')) {
 			let rd = dataHelper.genRandomNum(100000, 999999);
 			await wx.cloud.uploadFile({
 				cloudPath: id ? dir + id + '/' + rd + ext : dir + rd + ext,
 				filePath: filePath, // 文件路径
 			}).then(res => {
 				imgList[i] = res.fileID;
 			}).catch(error => {
 				// handle error TODO:剔除图片
 				console.error(error);
 			})
 		}
 	}

 	return imgList;
 }

 /**
  * 单个图片上传到云空间
  * @param {*} img 
  * @param {*} dir 
  * @param {*} id 
  * @return 返回cloudId
  */
 async function transTempPicOne(img, dir, id, isCheck = true) {

 	if (isCheck) {
 		wx.showLoading({
 			title: '图片校验中',
 			mask: true
 		});
 		let check = await contentCheckHelper.imgCheck(img);
 		if (!check) {
 			wx.hideLoading();
 			return pageHelper.showModal('不合适的图片, 请重新上传', '温馨提示');
 		}
 		wx.hideLoading();
 	}



 	let imgList = [img];
 	imgList = await transTempPics(imgList, dir, id);

 	if (imgList.length == 0)
 		return '';
 	else {
 		return imgList[0];
 	}


 }

 module.exports = {
 	CODE,
 	dataList,
 	callCloud,
 	callCloudSumbit,
 	callCloudData,
 	callCloudSumbitAsync,
 	transTempPics,
    transTempPicOne,
    transTempFileOne
 }