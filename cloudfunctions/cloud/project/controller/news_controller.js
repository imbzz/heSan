/**
 * Notes: 资讯模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2020-09-29 04:00:00 
 */

const BaseController = require('./base_controller.js');
const NewsService = require('../service/news_service.js');
const timeUtil = require('../../framework/utils/time_util.js');
const NewsModel = require('../model/news_model.js');
// 'news/addStatus':'news_controller@addNewsStatus',
// async function inc(collectionName, where, field, val = 1) 
class NewsController extends BaseController {

    // 自增status
    async addNewsStatus(){
        // 数据校验
		let rules = {
            id: 'must|id',
            status:'must|status'
        };
        
        let input = this.validateData(rules);
        switch(input.status){
            case '1':input.status='NEWS_STATUS_NOMAL';break;
            case '2':input.status='NEWS_STATUS_BUSY';break;
            case '3':input.status='NEWS_STATUS_CROWDING';break;
        }
        // static async inc(where, field, val = 1, mustPID = true)
		await NewsModel.inc(input.id,input.status);
    }
	// 把列表转换为显示模式
	transNewsList(list) {
        let ret = [];
		for (let k in list) {
			let node = {};
			node.type = 'news';
			node._id = list[k]._id;
			node.desc = list[k].NEWS_DESC;
			node.ext = list[k].NEWS_EDIT_TIME;
            node.cateId = list[k].NEWS_CATE_ID;
            // node.cateName = list[k].NEWS_CATE_NAME;
            // node.cateNameTwo = list[k].NEWS_CATE_NAME_TWO;
            // node.cateNameThree=list[k].NEWS_CATE_NAME_THREE;
            node.titleRemark=list[k].NEWS_TITLE_REMARK;
            // node.titleTime=list[k].NEWS_TITLE_TIME;
            node.titleMobile=list[k].NEWS_MOBILE;
            node.status=list[k].NEWS_STATUS;
            node.adminRest=list[k].NEWS_STATUS_ADMIN_REST;
            node.adminDaysSet=list[k].NEWS_DAYS_SET;
            node.updateTime=list[k].NEWS_ADD_TIME;
			ret.push(node);
		}
		return ret;
	}

	/** 首页资讯列表 */
	async getHomeNewsList() {
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new NewsService();
		let list = await service.getHomeNewsList(input);

		for (let k in list) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D h:m:s');
		}

		let result = await this.transNewsList(list);
        return result;
	}


	/** 资讯列表 */
	async getNewsList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			cateId: 'string',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new NewsService();
		let result = await service.getNewsList(input);

		// 数据格式化
		let list = result.list;
        let temp_Status_rest=[];
        for(let i=0;i<list.length;i++){
            temp_Status_rest.push(list[i].NEWS_STATUS_REST);
        }
        console.log(temp_Status_rest);
        try{
        //自动按时间变换
        //此算法只用来修改是否在时间段内并在时间段转折点更改一次状态,不计算人数反馈
        //用到数据
        //NEWS_ADD_TIME,NEWS_EDIT_TIME,NEWS_DAYS_SET,NEWS_STATUS_REST,NEWS_STATUS,
        for(let k=0;k<list.length;k++){
            //将添加此任务时的时间戳转化为日期
            list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D h:m:s');
            //将最新更新任务时的时间戳转化为日期
            list[k].NEWS_EDIT_TIME=timeUtil.timestamp2Time(list[k].NEWS_EDIT_TIME, 'Y-M-D h:m:s');
            // console.log(list[k].NEWS_DAYS_SET.length);
            let dayNumber=list[k].NEWS_DAYS_SET;
            let j = 0;
            let dayLength=dayNumber.length;
            for(j=0;j<dayNumber.length;j++){
                // console.log(timeUtil.time('Y-M-D'));
                // console.log(dayNumber[j].day);
               //如果在今天
                if(dayNumber[j].day==timeUtil.time('Y-M-D')){
                   
                    //如果是当天
                    //获取此刻时间
                    let inTime=0;
                    let nowTime=timeUtil.time();
                    for(let key=0;key<dayNumber[j].times.length;key++){
                        // console.log(timeUtil.time2Timestamp(dayNumber[j].day+' '+dayNumber[j].times[key].start+':00'));
                        // console.log(timeUtil.time2Timestamp(dayNumber[j].day+' '+dayNumber[j].times[key].end+':00'));
                        if(timeUtil.time2Timestamp(dayNumber[j].day+' '+dayNumber[j].times[key].start+':00')<nowTime&&timeUtil.time2Timestamp(dayNumber[j].day+' '+dayNumber[j].times[key].end+':00')>nowTime){
                            inTime=1;
                            if(list[k].NEWS_STATUS_REST==1){
                            list[k].NEWS_STATUS=1;//0显示休息 //-1不是任何显示
                            list[k].NEWS_STATUS_REST=0;//0在时段内 1不在时段内
                            }
                            break; 
                        }
                    }
                    list[k].NEWS_DAYS_SET=dayNumber[j].times;//记录该日的所有时段//不改
                    if(inTime==0){//不在时段内
                        if(list[k].NEWS_STATUS_REST==0){
                            list[k].NEWS_STATUS_REST=1;
                            list[k].NEWS_STATUS=0;
                        }
                         //兼容自动刷新函数在到点的下一秒将状态变为畅通时的bug
                         if(list[k].NEWS_STATUS_REST==1&&list[k].NEWS_STATUS!=0){
                            temp_Status_rest[k]=0;
                            list[k].NEWS_STATUS=0;
                        }
                    }
                    break;
                }
            }
            if(j==dayLength){
                //如果不在选中的日期内,状态没有被修改成休息,则修改
                if(list[k].NEWS_STATUS_REST!=1||list[k].NEWS_STATUS!=0){
                    temp_Status_rest[k]=0;
                    list[k].NEWS_STATUS_REST=1;
                    list[k].NEWS_STATUS=0;
                    list[k].NEWS_DAYS_SET=[];
                }else{//已经修改则直接取空时间段
                    list[k].NEWS_DAYS_SET=[];
                    // list[k].NEWS_STATUS=0;
                    // list[k].NEWS_STATUS_REST=1;
                }
            }
            // if(timeUtil.time()<=timeUtil.time2Timestamp();
        }
            let i = 0;
            for(let k = 0;k<list.length;k++){
                if(temp_Status_rest[k]!=list[k].NEWS_STATUS_REST){
                let data={};
                let where=list[k]._id;
                
                data[NewsModel.FIELD_PREFIX+'STATUS']=list[k].NEWS_STATUS;
                data[NewsModel.FIELD_PREFIX+'STATUS_REST']=list[k].NEWS_STATUS_REST;
                await NewsModel.edit(where,data);
                console.log(i+1);
                }
            }
    }catch(e){
        console.log(e);
    }

		result.list = this.transNewsList(list);

		return result;

	}


	/** 浏览资讯信息 */
	async viewNews() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new NewsService();
		let news = await service.viewNews(input.id);

		if (news) {
			// 显示转换 
			news.NEWS_ADD_TIME = timeUtil.timestamp2Time(news.NEWS_ADD_TIME, 'Y-M-D');
		}

		return news;
	}



}

module.exports = NewsController;