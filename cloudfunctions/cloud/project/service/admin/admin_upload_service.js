/**
 * Notes: 预约后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2022-12-08 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const uploadModel = require('../../model/uploadFile_model.js');
const util = require('../../../framework/utils/util.js');
const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const UserModel = require('../../model/user_model.js');
const adminModel = require('../../model/admin_students_model.js');
const DataService = require('./../data_service');
const config = require('../../../config/config.js');

const cloudBase = require('../../../framework/cloud/cloud_base.js');
// 云函数入口文件
const cloud = cloudBase.getCloud();
const db = cloud.database();

// 导出报名数据KEY
const EXPORT_JOIN_DATA_KEY = 'join_data';

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = '0';

class AdminUploadService extends BaseAdminService {
	// #####################导出报名数据
	/**获取报名数据 */
	// async getJoinDataURL() {
	// 	let dataService = new DataService();
	// 	return await dataService.getExportDataURL(EXPORT_JOIN_DATA_KEY);
	// }

	/**删除报名数据 */
	// async deleteJoinDataExcel() {
	// 	let dataService = new DataService();
	// 	return await dataService.deleteDataExcel(EXPORT_JOIN_DATA_KEY);
	// }

	// 根据表单提取数据
	// _getValByForm(arr, mark, title) {
	// 	for (let k in arr) {
	// 		if (arr[k].mark == mark) return arr[k].val;
	// 		if (arr[k].title == title) return arr[k].val;
	// 	}

	// 	return '';
	// }


    /************************上传学生数据 **************************/
    /**
     * 
     * @param {*} studentNumber
     * @param {*} adminId
     */
    async studentFinishSubmit({
        studentNumber,
        adminId,
        openid,
    }){
        let Model;
        switch(adminId){
            case 'admin': Model=adminModel;break;
        }
        let where ={
            STUDENTS_NUMBER:studentNumber
        }

        let result = await Model.getOne(where);
        if(result){
            if(result.STUDENTS_IFOPEN==0){
                this.AppError('您的信息在状态关闭名单中,请联系辅导员开启方可完成上报');
            }
                let  dataList= await db.collection('user').where({
                    _openid: openid
                  }).get();
                  let UserData= dataList.data[0];
                  let dayTime =timeUtil.getDayFirstTimestamp();
                if(!UserData.USER_SUBMIT_TIME&&!UserData.USER_SUBMIT_NUMBER){
                    //之前没有数据的情况 兼容 添加
                    await db.collection('user').where({ _openid: openid}).update({
                        data:{
                            USER_SUBMIT_TIME:dayTime,
                            USER_SUBMIT_NUMBER:1,
                        }
                    });
                }else{//已有
                    let submitNumber=0;
                    if(UserData.USER_SUBMIT_TIME==dayTime){//如果是当天
                        if(UserData.USER_SUBMIT_NUMBER!=2){
                            submitNumber =UserData.USER_SUBMIT_NUMBER+1;
                        }else{
                            //为两次时
                            this.AppError('今日上报次数已达上限');
                        }
                    }else{
                        submitNumber =1;
                    }
                    await db.collection('user').where({ _openid: openid}).update({
                        data:{
                            USER_SUBMIT_TIME:dayTime,
                            USER_SUBMIT_NUMBER:submitNumber,
                        }
                    });
                }
                let data ={
                    STUDENTS_STATUS:'1',
                }
                return await Model.edit(where,data);
           
        }else{
            this.AppError('学号信息错误或尚未导入数据');
        }
    }


    async uploadStudentFile({//更新文件数据条到load,不处理数据库人员情况  返回云存储地址和数据库key
        adminId,//账号id
        college,//学院
        cloudUrl,//路径
    }){
        //清除文件数据条
        let whereUpload = {
            UPLOAD_KEY: adminId+college,
        }
        await uploadModel.del(whereUpload);
        //上传存储 //第三个参数要修改
        // let dataService = new DataService();
        //待优化 返回uploadExport,
                   //fileCloudPath:
        //  fileData = await dataService.transTempFileOne(newUrl,config.FILE_ADMIN_STUDENT,adminId+college);
        // if(!fileData){
        //     dataService.AppError('文件上传失败,请检查网络重试');
        // }
        //生成临时文件路径

        let dataUpload = {
            UPLOAD_KEY:adminId+college,
            UPLOAD_CLOUD_ID:cloudUrl,
            UPLOAD_SUM_NUMBER:0
        }
        try{
        //存upload数据集里面
        let fileData = await uploadModel.insert(dataUpload);
        if(fileData){
           let Url =cloudUrl;
            return Url;
        }
       //  里面有dataUpload,cloudUrl
        }catch(e){
            console.log(e);
        }
        //插入admin_student
    }
/**
 * 拉取存储的文件进行学生信息数据库插入
 */
    async addStudentInfo2Database(adminId,college,cloudUrl){
        let dataService = new DataService();
        return await dataService.addStudentInfo2Database(adminId,college,cloudUrl);
    }

    /**获取上传的文件网络路径和云储存路径 */
	async getStudentDataURL(Key) {
		let dataService = new DataService();
		return await dataService.getUploadDataURL(Key);
	}

	/**删除文件数据  //先删除数据库的学生数据条(adminId+college),load的存储(adminId+college)文件,
    //不处理load的文件数据条*/
	async deleteStudentFile({
        adminId,
        college,
    }) {
        //选择对应的数据集
        let Model;
        switch(adminId){
            case'admin': Model = adminModel;break;
        }
        let where={
            STUDENTS_KEY:adminId+college,
        }
        //清除学生数据
        let result=await Model.del(where);//清除数据库里面adminId+college对应的学生数据
        let dataService = new DataService();
        await dataService.deleteUploadFILE(adminId+college);
        return result;
        
	}

}

module.exports = AdminUploadService;