/**
 * Notes: 资讯后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2021-07-11 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');

const dataUtil = require('../../../framework/utils/data_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const utilTime = require('../../../framework/utils/time_util.js')
const NewsModel = require('../../model/news_model.js');
const DayModel = require('../../model/day_model.js');
const NewsController = require('../../controller/news_controller.js');

class AdminNewsService extends BaseAdminService {

	/**添加资讯 */
	async insertNews(adminId, {
		// cateIdTwo,
        // cateNameTwo,
        // cateIdThree,
		// cateNameThree,
        mobile,
        titleRemark,
        // titleTime,
		// cateId,
		// cateName,
		desc,
        adminName,
        daysSet
	}) {
        let data ={};
        let temp ={
        adminId,
        // cateIdTwo,
        // cateNameTwo,
        // cateIdThree,
		// cateNameThree,
        mobile,
        titleRemark,
        // titleTime,
		// cateId,
		// cateName,
        desc,
        adminName,
        daysSet
        };
        try{
            for(let key in temp){
                if(!util.isDefined(data[NewsModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()])){
                data[NewsModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()]=temp[key];
                }
           }
           if(!util.isDefined(data[NewsModel.FIELD_PREFIX+'ORDER'])){
            data[NewsModel.FIELD_PREFIX+'ORDER']=9999;
           }
        //    for(let k=0;k<data[NewsModel.FIELD_PREFIX+'DAYS_SET'].length;k++){
        //     if(!util.isDefined(data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k]['dayStart'])&&!util.isDefined(data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k]['dayEnd'])){
        //         data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k]['dayStart']=data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].day+' '+data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].times[0].start+':00';
        //         data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k]['dayEnd'] = data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].day+' '+data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].times[data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].times.length-1].end+':00';
        //     }
        //    }
            data[NewsModel.FIELD_PREFIX+'STATUS_REST']=1;
            data[NewsModel.FIELD_PREFIX+'STATUS_NOMAL']=1;
            data[NewsModel.FIELD_PREFIX+'STATUS_BUSY']=1;
            data[NewsModel.FIELD_PREFIX+'STATUS_CROWDING']=1;
            data[NewsModel.FIELD_PREFIX+'STATUS_ADMIN_REST']=0;
            data[NewsModel.FIELD_PREFIX+'STATUS']=0;
            data[NewsModel.FIELD_PREFIX+'STATUS_LEVEL']=0;
           console.log(data);
           let result = await NewsModel.insert(data);
            return result;
        }catch(e){
            console.log(e);
        }
		// this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除资讯数据 */
	async delNews(id) {
        try{
            await NewsModel.del(id);
        }catch(e){
            console.log(e);
        }
		// this.AppError('此功能为完工，不断完善中：qq:1756612361');
	}

	/**获取资讯信息 */
	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}

	/**
	 * 更新富文本详细的内容及图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent({
		newsId,
		content // 富文本数组
	}) {
        let ContentData={};
        if(!util.isDefined(ContentData[NewsModel.FIELD_PREFIX+'CONTENT'])){
            ContentData[NewsModel.FIELD_PREFIX+'CONTENT'] = content;
        }
        try{
        await NewsModel.edit(newsId,ContentData);
        }catch(e){
          console.log(e);
        }
		// this.AppError('此功能为完工，不断完善中：qq:1756612361');

	}

	/**
	 * 更新资讯图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic({
		newsId,
		imgList // 图片数组
	}) {
        let dataList={};
        if(!util.isDefined(dataList[NewsModel.FIELD_PREFIX+'PIC'])){
            dataList[NewsModel.FIELD_PREFIX+'PIC'] = imgList;
        }
        try{
           await NewsModel.edit(newsId, dataList);
        }catch(e){
            console.log(e);
        }
	}


	/**更新资讯数据 */
	async editNews({
		id,
		// title,
		// cateId, //分类
		// cateName,
		// order,
		// type = 0, //类型 
		// desc = '',
        // url = '', //外部链接
        // titleTime,
		// cateId,
		// cateName,
        desc,
        mobile,
        titleRemark,
        // cateIdTwo,
        // cateNameTwo,
        // cateIdThree,
        // cateNameThree,
        adminName,
        daysSet
	}) {
        let meetId = id;
        let data ={};
        let arr=daysSet;
        daysSet=[];
        if(arr.length!=0){
            for(let k in arr){
                console.log(utilTime.time2Timestamp(arr[k].day));
                console.log(utilTime.time2Timestamp(arr[k].day));
                if(utilTime.time2Timestamp(arr[k].day)>=utilTime.getDayFirstTimestamp(utilTime.time())){
                    // daysSet.splice(k,1);
                    daysSet.push(arr[k]);
                }
            }
        }
        console.log(daysSet);
        let temp={
            // title,
            // cateId, //分类
            // cateName,
            // order,
            // type, //类型 
            // desc,
            // url, //外部链接
            // titleTime,
            // cateId,
            // cateName,
            desc,
            mobile,
            titleRemark,
            // cateIdTwo,
            // cateNameTwo,
            // cateIdThree,
            // cateNameThree,
            adminName,
            daysSet
            };
        for(let key in temp){
            if(!util.isDefined(data[NewsModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()])){
                data[NewsModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()] = temp[key];
            }
        }
        console.log(data);
        // for(let k=0;k<data[NewsModel.FIELD_PREFIX+'DAYS_SET'].length;k++){
           
        //         data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k]['dayStart']=data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].day+' '+data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].times[0].start+':00';
        //         data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k]['dayEnd'] = data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].day+' '+data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].times[data[NewsModel.FIELD_PREFIX+'DAYS_SET'][k].times.length-1].end+':00';
        
        // }
        console.log(data);
            // data[NewsModel.FIELD_PREFIX+'STATUS_REST']=1;//是否在休息状态
            // data[NewsModel.FIELD_PREFIX+'STATUS_NOMAL']=1;//人数
            // data[NewsModel.FIELD_PREFIX+'STATUS_BUSY']=1;//人数
            // data[NewsModel.FIELD_PREFIX+'STATUS_CROWDING']=1;//人数
            // data[NewsModel.FIELD_PREFIX+'STATUS_ADMIN_REST']=0;//开启状态
            // data[NewsModel.FIELD_PREFIX+'STATUS']=0;//初始化状态
            data[NewsModel.FIELD_PREFIX+'ADD_TIME']=utilTime.time();
        try{
            await NewsModel.edit(meetId,data);
        }catch(e){
            console.log(e);
        }
        
		// this.AppError('此功能为完工，不断完善中：qq:1756612361');
	}

	/**取得资讯分页列表 */
	async getNewsList({
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
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};

		if (util.isDefined(search) && search) {
			where.or = [{
				NEWS_TITLE: ['like', search]
			}, ];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId':
					// 按类型
					where.NEWS_CATE_ID = sortVal;
					break;
				case 'status':
					// 按类型
					where.NEWS_STATUS = Number(sortVal);
					break;
				case 'home':
					// 按类型
					where.NEWS_HOME = Number(sortVal);
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'NEWS_VIEW_CNT': 'desc',
							'NEWS_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'NEWS_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
    /**
     * 
     * @param {*} id 
     * 手动关闭开启
     */
    async restStatus(id){
        try{
         let data ={};
         let result=await NewsModel.getOne(id,'NEWS_STATUS_ADMIN_REST');
         if(result.NEWS_STATUS_ADMIN_REST==1){
            data[NewsModel.FIELD_PREFIX+'STATUS_ADMIN_REST']=0;
         }else if(result.NEWS_STATUS_ADMIN_REST==0){
            data[NewsModel.FIELD_PREFIX+'STATUS_ADMIN_REST']=1;
         }
         let adminRest = data[NewsModel.FIELD_PREFIX+'STATUS_ADMIN_REST'];
         let Data ={
            adminRest:adminRest,
         }
         if(!util.isDefined(data[NewsModel.FIELD_PREFIX+'ADD_TIME'])){
            data[NewsModel.FIELD_PREFIX+'ADD_TIME']=utilTime.time();
         }
         await NewsModel.edit(id,data);
         return Data;
        }catch(e){
            console.log();
        }
    }
	/**修改资讯状态 */
	async statusNews(id, status) {
        try{
            let data={};
            if(!util.isDefined(data[NewsModel.FIELD_PREFIX+'STUTAS'])&&!util.isDefined(data[NewsModel.FIELD_PREFIX+'ADD_TIME'])){
                data[NewsModel.FIELD_PREFIX+'STATUS'] = status;
                data[NewsModel.FIELD_PREFIX+'ADD_TIME']=utilTime.time();
            }
            await NewsModel.edit(id,data);
        }catch(e){
            console.log(e);
        }
		// this.AppError('此功能为完工，不断完善中：qq:1756612361');
	}

	/**资讯置顶排序设定 */
	async sortNews(id, sort) {//sort=NEWS_HOME
        try{
            let data = {};
            if(!util.isDefined(data[NewsModel.FIELD_PREFIX+'ORDER'])){
                data[NewsModel.FIELD_PREFIX+'ORDER'] = sort;
            }
           await NewsModel.edit(id,data);
        }catch(e){
            console.log(e);
        }
		// this.AppError('此功能为完工，不断完善中：qq:1756612361');
	}
}

module.exports = AdminNewsService;