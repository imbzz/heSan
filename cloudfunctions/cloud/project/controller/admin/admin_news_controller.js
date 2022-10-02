/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-07-11 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');

const AdminNewsService = require('../../service/admin/admin_news_service.js');

const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');
const LogModel = require('../../model/log_model.js');
const { STATUS } = require('../../model/meet_model.js');
const NewsModel = require('../../model/news_model.js');

class AdminNewsController extends BaseAdminController {

    /**成了 发布资讯信息 */
	async insertNews() {
		await this.isAdmin();

		let rules = {};
		// let type = this.getParameter('type');//判断内外部文章
		// 数据校验
			rules = {
                // titleTime:'must|string|max:20|name=时间备注',
				// cateId: 'must|id|name=一级分类',
				// cateName: 'must|string|name=一级地址名',
                desc: 'must|string|max:200|name=简介',
                mobile:'must|int|name=电话',
                titleRemark:'must|string|name=备注',
                // cateIdTwo: 'must|id|name=二级分类',
                // cateNameTwo: 'must|string|name=二级地址名',
                // cateIdThree: 'must|id|name=三级分类',
                // cateNameThree: 'must|string|name=三级地址名',
                adminName:'must|string|name=管理者账号',
                daysSet:'must|array|name=开放日期选择'
			};
		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		// await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = await service.insertNews(this._adminId, input);

		// this.log('添加了文章《' + input.desc + '》', LogModel.TYPE.NEWS);

		return result;
    }
    
     /**成了 编辑资讯 */
	async editNews() {
		await this.isAdmin();

		let rules = {};
		let type = this.getParameter('type');
		// 数据校验
			rules = {
				id: 'must|id',
				// titleTime:'must|string|max:20|name=时间备注',
				// cateId: 'must|id|name=一级分类',
				// cateName: 'must|string|name=一级地址名',
                desc: 'must|string|max:200|name=简介',
                mobile:'must|int|name=电话',
                titleRemark:'must|string|name=备注',
                // cateIdTwo: 'must|id|name=二级分类',
                // cateNameTwo: 'must|string|name=二级地址名',
                // cateIdThree: 'must|id|name=三级分类',
                // cateNameThree: 'must|string|name=三级地址名',
                adminName:'must|string|name=管理者账号',
                daysSet:'must|array|name=开放日期选择'
			};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = service.editNews(input);

		// this.log('修改了文章《' + input.title + '》', LogModel.TYPE.NEWS);

		return result;
	}

    /** 资讯列表 */
	async getNewsList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		let result = await service.getNewsList(input);

		// 数据格式化
        let list = result.list;
        try{
        //自动按时间变换
        //改
            for(let k=0;k<list.length;k++){
                //将添加此任务时的时间戳转化为日期
                list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D h:m:s');
                //将最新更新任务时的时间戳转化为日期
                list[k].NEWS_EDIT_TIME=timeUtil.timestamp2Time(list[k].NEWS_EDIT_TIME, 'Y-M-D h:m:s');
                for(let j=0;j<list[k].NEWS_DAYS_SET.length;j++){
                    console.log(timeUtil.time('Y-M-D'));
                    console.log(list[k].NEWS_DAYS_SET[j].day);
                   
                    if(list[k].NEWS_DAYS_SET[j].day==timeUtil.time('Y-M-D')){
                       
                        //如果是当天
                        //获取此刻时间
                        let inTime=0;
                        let nowTime=timeUtil.time();
                        for(let key=0;key<list[k].NEWS_DAYS_SET[j].times.length;key++){
                            console.log(timeUtil.time2Timestamp(list[k].NEWS_DAYS_SET[j].day+' '+list[k].NEWS_DAYS_SET[j].times[key].start+':00'));
                            console.log(timeUtil.time2Timestamp(list[k].NEWS_DAYS_SET[j].day+' '+list[k].NEWS_DAYS_SET[j].times[key].end+':00'));
                            if(timeUtil.time2Timestamp(list[k].NEWS_DAYS_SET[j].day+' '+list[k].NEWS_DAYS_SET[j].times[key].start+':00')<nowTime&&timeUtil.time2Timestamp(list[k].NEWS_DAYS_SET[j].day+' '+list[k].NEWS_DAYS_SET[j].times[key].end+':00')>nowTime){
                                inTime=1;
                                if(list[k].NEWS_STATUS_REST==1){
                                list[k].NEWS_STATUS=1;//0显示休息 //-1不是任何显示
                                list[k].NEWS_STATUS_REST=0;//0在时段内 1不在时段内
                                }
                                break; 
                            }
                        }
                        list[k].NEWS_DAYS_SET=list[k].NEWS_DAYS_SET[j].times;//记录该日的所有时段//不改
                        if(inTime==0){//不在时段内
                            if(list[k].NEWS_STATUS_REST==0){
                                list[k].NEWS_STATUS_REST=1;
                                list[k].NEWS_STATUS=0;
                            }
                        }
                        break;
                    }else{
                        list[k].NEWS_DAYS_SET=[];
                        list[k].NEWS_STATUS=0;
                        list[k].NEWS_STATUS_REST=1;
                       
                    }
                }
                // if(timeUtil.time()<=timeUtil.time2Timestamp();
            ////
        }
            for(let k = 0;k<list.length;k++){
                let data={};
                let where=list[k]._id;
                data[NewsModel.FIELD_PREFIX+'STATUS']=list[k].NEWS_STATUS;
                data[NewsModel.FIELD_PREFIX+'STATUS_REST']=list[k].NEWS_STATUS_REST;
                await NewsModel.edit(where,data);
            }
        }catch(e){
            console.log(e);
        }
            // if(timeUtil.time()<=timeUtil.time2Timestamp();
        
		result.list = list;

		return result;

	}
//手动修改状态
async restStatus() {
    await this.isAdmin();

    // 数据校验
    let rules = {
        id: 'must|id',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminNewsService();
    return await service.restStatus(input.id);
    // await service.statusNews(input.id, input.status);

}

/** 资讯状态修改 */
async statusNews() {
    await this.isAdmin();

    // 数据校验
    let rules = {
        id: 'must|id',
        status: 'must|int|in:0,1,2,3,4,8',
    };

    // 取得数据
    let input = this.validateData(rules);

    let service = new AdminNewsService();
    await service.statusNews(input.id, input.status);

}
   
	/** 资讯排序 */
	async sortNews() { // 数据校验
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.sortNews(input.id, input.sort);//sort的值是NEWS_HOME
	}

	
    


	

	/**
	 * 更新富文本信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			newsId: 'must|id',
			content: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		return await service.updateNewsContent(input);
	}


	

	
	/** 获取资讯信息用于编辑修改 */
	async getNewsDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.getNewsDetail(input.id);
	}



	/** 删除资讯 */
	async delNews() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let name = await this.getNameBeforeLog('news', input.id);

		let service = new AdminNewsService();
		await service.delNews(input.id);

		this.log('删除了文章《' + name + '》', LogModel.TYPE.NEWS);

	}

	/**
	 * 成了 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			newsId: 'must|id',
			imgList: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		return await service.updateNewsPic(input);
	}

}

module.exports = AdminNewsController;