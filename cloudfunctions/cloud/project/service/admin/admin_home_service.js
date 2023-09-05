/**
 * Notes: 后台HOME/登录模块 
 * Date: 2021-03-15 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');

const dataUtil = require('../../../framework/utils/data_util.js');
const cacheUtil = require('../../../framework/utils/cache_util.js');

const cloudBase = require('../../../framework/cloud/cloud_base.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const config = require('../../../config/config.js');
const AdminModel = require('../../model/admin_model.js');
const LogModel = require('../../model/log_model.js');

const UserModel = require('../../model/user_model.js');
const MeetModel = require('../../model/meet_model.js');
const NewsModel = require('../../model/news_model.js');
const JoinModel = require('../../model/join_model.js');

class AdminHomeService extends BaseAdminService {

	/**
	 * 首页数据归集
	 */
	async adminHome({name}) {
		let where = {
            NEWS_ADMIN_NAME:name,
        };
        let where1 = {
            NEWS_ADMIN_NAME:name,
            NEWS_STATUS:1
        }
        let where2 = {
            NEWS_ADMIN_NAME:name,
            NEWS_STATUS:2
        }
        let where3 = {
            NEWS_ADMIN_NAME:name,
            NEWS_STATUS:3
        }
		// let userCnt = await UserModel.count(where);
		// let meetCnt = await MeetModel.count(where);
        let newsCnt = await NewsModel.count(where);
        let newsCnt1 = await NewsModel.count(where1);
        let newsCnt2 = await NewsModel.count(where2);
        let newsCnt3 = await NewsModel.count(where3);
        // let joinCnt = await JoinModel.count(where);
        
		return {
			// userCnt,
			// meetCnt,
            newsCnt,
            newsCnt1,
            newsCnt2,
            newsCnt3
			// joinCnt
		}
	}

	/** 清除缓存 */
	async clearCache() {
		await cacheUtil.clear();
	}

	/**
	 * 管理员登录
	 * @param {*} cloudID 
	 */
	async adminLogin({
        name, 
        pwd,
        param,
        college
    }) {
        let find=0;
        for(let key=0;key<config.SUPER_ADMIN_LIST.length;key++){
            if(config.SUPER_ADMIN_LIST[key].ADMIN_NAME==name){
                for(let j in config.SUPER_ADMIN_LIST[key].ADMIN_PWD){
                    let actionNameArr = config.SUPER_ADMIN_LIST[key].ADMIN_PWD[j].split('@');
                    if(college==''&&actionNameArr[0]==pwd&&actionNameArr[1]==param){
                        find=1;//管理者登录 //写的冗杂为了比较容易看懂
                        break;
                    }else if(actionNameArr[0]==pwd&&actionNameArr[1]==param&&college==actionNameArr[2]){
                        find =1;//导出登录
                        break;
                    }
                }
            }
        }
        if(find==0){
            this.AppError('管理员账号或密码不正确');
        }
		// if (password != config.ADMIN_PWD)
		// 	this.AppError('管理员账号或密码不正确');
		// 判断是否存在
		let where = {
            ADMIN_LOGIN_NAME:name,
		}
		let fields = 'ADMIN_ID,ADMIN_NAME,ADMIN_LOGIN_NAME,ADMIN_TYPE,ADMIN_LOGIN_TIME,ADMIN_LOGIN_CNT,ADMIN_ADMINER_LIST';
		let admin = await AdminModel.getOne(where, fields);
		if (!admin)
			this.AppError('管理员不存在');

        let cnt = admin.ADMIN_LOGIN_CNT;
        

		// 生成token
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: tokenTime,
			ADMIN_LOGIN_TIME: timeUtil.time(),
			ADMIN_LOGIN_CNT: cnt + 1
		}
		await AdminModel.edit(where, data);
        let adminList=admin.ADMIN_ADMINER_LIST;
        let type;
        for(let k in adminList){
            if(pwd==adminList[k].pwd){
                type=adminList[k].type;
            }
        }
		let last = (!admin.ADMIN_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(admin.ADMIN_LOGIN_TIME);

		// 写日志//不写了 没钱真的没钱
		// this.insertLog('登录了系统', admin, LogModel.TYPE.SYS);

		return {
			token,
			name: admin.ADMIN_NAME,
			type,
			last,
            cnt,
            login_name:name,
		}

	}


}

module.exports = AdminHomeService;