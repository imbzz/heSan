/**
 * Notes: 预约后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code3721.com
 * Date: 2021-12-08 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');
const MeetService = require('../meet_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const Model=require('../../../framework/database/model.js')
const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const DayModel = require('../../model/day_model.js');
const config = require('../../../config/config.js');

class AdminMeetService extends BaseAdminService {
/**(创建)新的预约类型 */
       /**  input内容
        daysSet: Array(1)
        0: {day: "2022-08-04", dayDesc: "2022年8月4日 (周四)", times: Array(1)}
        length: 1
        __proto__: Array(0)
        formSet: Array(2)
        0: {type: "line", title: "姓名", desc: "请填写您的姓名", must: true, len: 50, …}
        1: {type: "line", title: "手机", desc: "请填写您的手机号码", must: true, len: 50, …}
        length: 2
        __proto__: Array(0)
        isShowLimit: 1
        order: 9999
        title: "123"
        typeId: "1"
        typeName: "羽毛球场预约"**/
//同时映射dayset到ax_day 里面
async insertMeet(adminId, {
    title,
    order,
    typeId,
    typeName,
    // content,
    // styleSet,
    daysSet,
    isShowLimit,
    formSet,
}) {//insert(data, mustPID = true)
    let data={};
    //赋值MEET_STATUS
    //日期加上时间戳
    for(let key in daysSet){
        for(let k in daysSet[key].times)
        if(!util.isDefined(daysSet[key].times[k]['start_time_stamp'])&&!util.isDefined(daysSet[key].times[k]['end_time_stamp'])){
            //开始时间戳
            daysSet[key].times[k]['start_time_stamp']=timeUtil.time2Timestamp(daysSet[key].day+' '+daysSet[key].times[k].start);
            //结束时间戳
            daysSet[key].times[k]['end_time_stamp']=timeUtil.time2Timestamp(daysSet[key].day+' '+daysSet[key].times[k].end);
        }
    }
     //赋值MEET_ADMIN_ID
     if(!util.isDefined(data[MeetModel.FIELD_PREFIX+'ADMIN_ID'])) data[MeetModel.FIELD_PREFIX+'ADMIN_ID'] = adminId;//
    //赋值MEET_TITLE
    // //赋值order
    // //赋值MEET_TYPE_ID
    //用for减少代码为三行
    let temp= {
        title,
        order,
        typeId,
        typeName,
        // content,
        // styleSet,
        daysSet,
        isShowLimit,
        formSet,
    }
    for(let key in temp){
        if(!util.isDefined(data[MeetModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()])){
            data[MeetModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()] = temp[key];
        }
    }
    if(MeetModel.DB_STRUCTURE.MEET_STATUS.split('|')[1]){
            let idField = MeetModel.FIELD_PREFIX +'STATUS';//开放状态1
            if(!util.isDefined(data[idField])) data[idField] = 1;
         }
    console.log(data);
    // DayModel.insert()//返回的只有数据唯一id
    let result= await MeetModel.insert(data);
   
    //用传回来的_id做同一个场地的标识
     for(let key in daysSet){
         if(!util.isDefined( daysSet[key][DayModel.FIELD_PREFIX+'MEET_ID'])){
            daysSet[key][DayModel.FIELD_PREFIX+'MEET_ID'] = result.id;//result是meet的id
             //用meet的id来标记day属于哪个场地
         }
     }
     try{
        //  加入时段记录数组
        if (daysSet) {
            for (let k=0;k<daysSet.length;k++){
                let dayOrderTimeSection=[];//存预约区间下标
                let dayStartStampMinute = timeUtil.getDayFirstTimestamp(timeUtil.time2Timestamp(daysSet[k].day));//当日开始时间00:00
                let timeArray=config.ORDER_TIME_ARRAY;//时间原始数组
                for(let j=0;j<daysSet[k].times.length;j++){
                    //获取开始时间 结束时间 转下标
                   let meetStartIndex=(daysSet[k].times[j].start_time_stamp-dayStartStampMinute)/(60000*5);
                   let meetEndIndex=(daysSet[k].times[j].end_time_stamp-dayStartStampMinute)/(60000*5);
                   let Timesection=[meetStartIndex,meetEndIndex];
                   dayOrderTimeSection.push(Timesection);
                }
                //正常操作能够按照顺序来 搞特殊就加排序解决 现在没加
                //对数据进行正确赋值
                if(dayOrderTimeSection.length!=0){
                    let i = 0;
                    for(let key=0;key<timeArray.length;key++){
                        let startMark=dayOrderTimeSection[i][0];
                        let endMark=dayOrderTimeSection[i][1];
                            if(startMark<=key&&endMark>=key){
                                if(endMark==key){
                                    if(util.isDefined(dayOrderTimeSection[i+1])){
                                       i=i+1;
                                    }
                                }
                            }else{
                                timeArray[key]=-1;
                            }      
                        }
                }else{
                    for(let key=0;key<timeArray.length;key++){
                      timeArray[key]=-1;
                    }
                }
                //变成二维数组
                let newTimeArray=dataUtil.spArr(timeArray,12);
                console.log("数组",newTimeArray);
                //插入数据
                if(!util.isDefined(daysSet[k][DayModel.FIELD_PREFIX+'TIME_ARRAY'])){
                    daysSet[k][DayModel.FIELD_PREFIX+'TIME_ARRAY'] = newTimeArray;
                }
            }
        }  
    }catch(e){
        console.log(e);
    }
    //批量增加 //一天一条数据//映射到ax_day//此命令没有验证是否加入成功
    await DayModel.insertBatch(daysSet);
    return result;//返回的依然是meet的id 标识ax_day的id
    // this.AppError('开开凯，如有需要请加作者微信：cclinux0730');
}
	/**对已有的单条数据进行更新数据 不更新content和style_set 接着会有单独操作*/
	async editMeet({
		id,
		title,
		typeId,
		typeName,
		order,
		daysSet,
		isShowLimit,
		formSet
	}) {
        let data={};
        //日期加上时间戳
        for(let key in daysSet){
            for(let k in daysSet[key]){
            if(!util.isDefined(daysSet[key].times[0]['start_time_stamp'])&&!util.isDefined (daysSet[key].times[k]['end_time_stamp'])){
                //开始时间戳
                daysSet[key].times[k]['start_time_stamp']=timeUtil.time2Timestamp(daysSet[key].day+' '+daysSet[key].times[0].start);
                //结束时间戳
                daysSet[key].times[k]['end_time_stamp']=timeUtil.time2Timestamp(daysSet[key].day+' '+daysSet[key].times[0].end);
               }
            }
        }
        let temp={
            title,
            typeId,
            typeName,
            order,
            daysSet,
            isShowLimit,
            formSet
        };
        for(let key in temp){
            if(!util.isDefined(data[MeetModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()])){
                data[MeetModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()]=temp[key];
            }
        }
        let where={};
        if(!util.isDefined(where[DayModel.FIELD_PREFIX+'MEET_ID'])){
            where[DayModel.FIELD_PREFIX+'MEET_ID'] = id;
        }
        try{
        await DayModel.del(where);//用where中的DAY_MEET_ID做标识，删除同一个场地的所有预约
        await MeetModel.edit(id,data);//修改meet的内容
        
       //用传回来的_id做同一个场地的标识
     for(let key in daysSet){
         if(!util.isDefined(daysSet[key][DayModel.FIELD_PREFIX+'MEET_ID'])){
             resultTemp[key][DayModel.FIELD_PREFIX+'MEET_ID'] = id;//result是meet的id
             //用meet的id来标记day属于哪个场地
         }
     }

      //  加入时段记录数组
      if (daysSet) {
        for (let k in daysSet){
            let dayOrderTimeSection=[];//存预约区间下标
            let dayStartStampMinute = timeUtil.getDayFirstTimestamp(timeUtil.time2Timestamp(daysSet[k].day));//当日开始时间00:00
            let timeArray=config.ORDER_TIME_ARRAY;//时间原始数组
            for(let j in daysSet[k].times){
                //获取开始时间 结束时间 转下标
               let meetStartIndex=(daysSet[k].times[j].start_time_stamp-dayStartStampMinute)/(60000*5);
               let meetEndIndex=(daysSet[k].times[j].end_time_stamp-dayStartStampMinute)/(60000*5);
               let Timesection=[meetStartIndex,meetEndIndex];
               dayOrderTimeSection.push(Timesection);
            }
            //正常操作能够按照顺序来 搞特殊就加排序解决 现在没加
            //对数据进行正确赋值
            if(dayOrderTimeSection.length!=0){
                let i = 0;
                for(let key=0;key<timeArray.length;key++){
                    let startMark=dayOrderTimeSection[i][0];
                    let endMark=dayOrderTimeSection[i][1];
                        if(startMark<=key&&endMark>=key){
                            if(endMark==key){
                                if(util.isDefined(dayOrderTimeSection[i+1])){
                                   i=i+1;
                                }
                            }
                        }else{
                            timeArray[key]=-1;
                        }      
                    }
            }else{
                for(let key=0;key<timeArray.length;key++){
                  timeArray[key]=-1;
                }
            }
            //变成二维数组
            let newTimeArray=dataUtil.spArr(timeArray,12);
            console.log("数组",newTimeArray);
            //插入数据
            if(!util.isDefined(daysSet[k][DayModel.FIELD_PREFIX+'TIME_ARRAY'])){
                daysSet[k][DayModel.FIELD_PREFIX+'TIME_ARRAY'] = newTimeArray;
            }
        }
    }  
    //重新批量增加ax_Day //一天一条数据//映射到ax_day//此命令没有验证是否加入成功
    await DayModel.insertBatch(daysSet);
    return result;
        }
        catch(e){
            console.log(e);
        }
	}

/**
	 * 单独更新富文本详细的内容
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateMeetContent({
		meetId,
		content // 富文本数组
	}) {
        let data={};
        let idField = MeetModel.FIELD_PREFIX +'CONTENT';
        if(!util.isDefined(data[idField])) data[idField] = content;
		let result=await MeetModel.edit(meetId,data);//把content放入data
        return result;
        // this.AppError('开开凯，如有需要请加作者微信：cclinux0730');
    }
    	/**
	 * 单独更新封面内容及图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateMeetStyleSet({
		meetId,
		styleSet
	}) {
        let data={};
        let idField = MeetModel.FIELD_PREFIX +'STYLE_SET';
        if(!util.isDefined(data[idField])) data[idField] = styleSet;
		let result=await MeetModel.edit(meetId,data);//把content放入data
        return result;
		// this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');

    }
    
    /**预约项目分页列表 */
	async getMeetList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'MEET_ORDER': 'asc',
			'MEET_ADD_TIME': 'desc'
		};
		let fields = 'MEET_TYPE,MEET_TYPE_NAME,MEET_TITLE,MEET_STATUS,MEET_DAYS_SET,MEET_ADD_TIME,MEET_EDIT_TIME,MEET_ORDER';
		let where = {};
		if (util.isDefined(search) && search) {
			where.MEET_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					where.MEET_STATUS = Number(sortVal);
					break;
				case 'typeId':
					// 按类型
					where.MEET_TYPE_ID = sortVal;
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'MEET_VIEW_CNT': 'desc',
							'MEET_ADD_TIME': 'desc'
						};
					}

					break;
			}
		}
		return await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
	/** 预约数据列表 */
	async getDayList(meetId, start, end) {
		let where = {
			DAY_MEET_ID: meetId,
			day: ['between', start, end]
		}
		let orderBy = {
			day: 'asc'
		}
		return await DayModel.getAllBig(where, 'day,times,dayDesc', orderBy);
	}

	// 按项目统计人数
	async statJoinCntByMeet(meetId) {
		let today = timeUtil.time('Y-M-D');
		let where = {
			day: ['>=', today],
			DAY_MEET_ID: meetId
		}

		let meetService = new MeetService();
		let list = await DayModel.getAllBig(where, 'DAY_MEET_ID,times', {}, 1000);
		for (let k in list) {
			let meetId = list[k].DAY_MEET_ID;
			let times = list[k].times;

			for (let j in times) {
				let timeMark = times[j].mark;
				meetService.statJoinCnt(meetId, timeMark);
			}
		}
	}

	/** 自助签到码 */
	async genSelfCheckinQr(page, meetId) {
        try{
            let cloud = cloudBase.getCloud();
            if(page.startsWith('/')){
                page = page.slice(1);
            }
            let result = await cloud.openapi.wxacode.getUnlimited({
                scene: meetId,
                width: 280,
                check_path: false,
                env_version: 'release', //trial,develop
                page
            });
            let upload = await cloud.uploadFile({
                cloudPath:config.MEET_TIMEMARK_QR_PATH+meetId+'qr.png',
                fileContent:result.buffer,
            })
            if(!upload||!upload.fileID) return;
            return upload.fileID;
        }catch(e){
            console.log(e);
        }
		//  this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 管理员按钮核销 */
	async checkinJoin(joinId, flag) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 管理员扫码核销 */
	async scanJoin(meetId, code) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**
	 * 判断本日是否有预约记录
	 * @param {*} daySet daysSet的节点
	 */
	checkHasJoinCnt(times) {
		if (!times) return false;
		for (let k in times) {
			if (times[k].stat.succCnt) return true;
		}
		return false;
	}

	// 判断含有预约的日期
	getCanModifyDaysSet(daysSet) {
		let now = timeUtil.time('Y-M-D');

		for (let k in daysSet) {
			if (daysSet[k].day < now) continue;
			daysSet[k].hasJoin = this.checkHasJoinCnt(daysSet[k].times);
		}

		return daysSet;
	}

	/** 取消某个时间段的所有预约记录 */
	async cancelJoinByTimeMark(admin, meetId, timeMark, reason) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	

	/**删除数据 */
	async delMeet(id) {
        try{
            await MeetModel.del(id);//删ax_meet的数据
            let data={};
            if(!util.isDefined(data[DayModel.FIELD_PREFIX+'MEET_ID'])){
            data[DayModel.FIELD_PREFIX+'MEET_ID'] = id;
            }
            await DayModel.del(data);//删ax_day的数据
        }
        catch(e){
            console.log(e);
        }
		// this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**获取信息 */
	async getMeetDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let meet = await MeetModel.getOne(where, fields);
		if (!meet) return null;

		let meetService = new MeetService();
		meet.MEET_DAYS_SET = await meetService.getDaysSet(id, timeUtil.time('Y-M-D')); //今天及以后

		return meet;
	}

	



	/** 更新日期设置 */
	async _editDays(meetId, nowDay, daysSetData) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**预约名单分页列表 */
	async getJoinList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		meetId,
		mark,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'JOIN_EDIT_TIME': 'desc'
		};
		let fields = 'JOIN_IS_CHECKIN,JOIN_CODE,JOIN_ID,JOIN_REASON,JOIN_USER_ID,JOIN_MEET_ID,JOIN_MEET_TITLE,JOIN_MEET_DAY,JOIN_MEET_TIME_START,JOIN_MEET_TIME_END,JOIN_MEET_TIME_MARK,JOIN_FORMS,JOIN_STATUS,JOIN_EDIT_TIME';

		let where = {
			JOIN_MEET_ID: meetId,
			JOIN_MEET_TIME_MARK: mark
		};
		if (util.isDefined(search) && search) {
			where['JOIN_FORMS.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					sortVal = Number(sortVal);
					if (sortVal == 1099) //取消的2种
						where.JOIN_STATUS = ['in', [10, 99]]
					else
						where.JOIN_STATUS = Number(sortVal);
					break;
				case 'checkin':
					// 签到
					where.JOIN_STATUS = JoinModel.STATUS.SUCC;
					if (sortVal == 1) {
						where.JOIN_IS_CHECKIN = 1;
					} else {
						where.JOIN_IS_CHECKIN = 0;
					}
					break;
			}
		}

		return await JoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	

	/** 删除 */
	async delJoin(joinId) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**修改报名状态 
	 * 特殊约定 99=>正常取消 
	 */
	async statusJoin(admin, joinId, status, reason = '') {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**修改项目状态 */
	async statusMeet(id, status) {
        let data={};
        if(!util.isDefined(data[MeetModel.FIELD_PREFIX+'STATUS'])){
            data[MeetModel.FIELD_PREFIX+'STATUS'] = status;
        }
        try{
        await MeetModel.edit(id,data);
        // this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
        }
        catch(e){
            console.log(e);
        }
	}

	/**置顶排序设定 */
	async sortMeet(id, sort) {
        try{
            let data ={};
            if(!util.isDefined(data[MeetModel.FIELD_PREFIX+'ORDER'])){
            data[MeetModel.FIELD_PREFIX+'ORDER'] = sort;
              }
        await MeetModel.edit(id,data)
		// this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
        }
        catch(e){
            console.log(e);
        }
	}
}

module.exports = AdminMeetService;