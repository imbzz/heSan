/**
 * Notes: 预约后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code3721.com
 * Date: 2022-12-08 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const cloudBase=require('../../../framework/cloud/cloud_base.js');
const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const UserModel = require('../../model/user_model.js');
const adminModel = require('../../model/admin_students_model.js');
const DataService = require('./../data_service');
const config = require('../../../config/config.js');

const cloud = cloudBase.getCloud();
const db = cloud.database();

// 导出报名数据KEY
const EXPORT_JOIN_DATA_KEY = 'join_data';

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = '0';

class AdminExportService extends BaseAdminService {
	// #####################导出报名数据
	/**获取报名数据 */
	async getJoinDataURL() {
		let dataService = new DataService();
		return await dataService.getExportDataURL(EXPORT_JOIN_DATA_KEY);
	}

	/**删除报名数据 */
	async deleteJoinDataExcel() {
		let dataService = new DataService();
		return await dataService.deleteDataExcel(EXPORT_JOIN_DATA_KEY);
	}

	// 根据表单提取数据
	_getValByForm(arr, mark, title) {
		for (let k in arr) {
			if (arr[k].mark == mark) return arr[k].val;
			if (arr[k].title == title) return arr[k].val;
		}

		return '';
	}

	/**导出报名数据 */
	async exportJoinDataExcel({
		meetId,
		startDay,
		endDay,
		status
	}) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	// #####################导出用户数据

	/**获取用户数据 */
	async getUserDataURL() {
		let dataService = new DataService();
		return await dataService.getExportDataURL(EXPORT_USER_DATA_KEY);
	}

	/**删除用户数据 */
	async deleteUserDataExcel() {
		let dataService = new DataService();
		return await dataService.deleteDataExcel(EXPORT_USER_DATA_KEY);
	}

    
	/**导出用户数据 以数据条的方式记录*/
	async exportUserDataExcel(condition) {

        try{
            //key 当天日期
            // let StuInfo = await db.collection('ax_user').where({
            //     USER_STATUS:condition,///////可以修改
            // }).get()   //将获取到的数据对象赋值给变量，接下来需要用该对象向Excel表中添加数据
            let time=timeUtil.timestamp2Time(timeUtil.time(), 'Y-M-D');
            let title="";
        //     USER_STATUS: 'int|true|default=1|comment=状态 0=待审核,1=正常',
    
    
            if(condition=="0"){
                title="当日全部";
                let where={};
                let field="USER_STATUS,USER_NUMBER,USER_WORK,USER_DAYTIME,USER_STATUS";
                let orderBy={INFO_ADD_TIME: 'desc'}
                var data =await UserModel.getAllBig(where,field,orderBy);
            }else if(condition=="1"){
                title="当日已签";
                let where={
                    USER_STATUS:1, 
                };
                let field="USER_STATUS,USER_NUMBER,USER_WORK,USER_DAYTIME,USER_STATUS";
                let orderBy={INFO_ADD_TIME: 'desc'}
                var data =await UserModel.getAllBig(where,field,orderBy);
            }else{
                title="当日未签";
                let where={
                    USER_STATUS:0, 
                };
                let field="USER_NAME,USER_NUMBER,USER_WORK,USER_DAYTIME,USER_STATUS";
                let orderBy={INFO_ADD_TIME: 'desc'}
                var data =await UserModel.getAllBig(where,field,orderBy);
            }
            console.log(data);
            data.list=data;
            let alldata = [];
            let row = ['姓名', '学号','学院','最近核酸检测时间','当日是否检测'];
            alldata.push(row);  //将此行数据添加到一个向表格中存数据的数组中
            for (let key = 0; key<data.list.length; key++) {
                let arr = [];
                arr.push(data.list[key].USER_NAME);
                arr.push(data.list[key].USER_NUMBER);
                arr.push(data.list[key].USER_WORK);
                arr.push(data.list[key].USER_DAYTIME);
                arr.push(data.list[key].USER_STATUS);
                alldata.push(arr);
            }
    
            let dataService = new DataService();
            return await dataService.exportDataExcel(condition,title,data.total, alldata);
            
            //声明一个Excel表，表的名字用随机数产生
      
            //表格的属性，也就是表头说明对象
        } catch (error) {
            console.error(error)
        }
		// this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
    }

    
    /************************导出学生数据 **************************/
    /**获取用户数据 */
	async getStudentDataURL(cloudKey) {
		let dataService = new DataService();
		return await dataService.getExportDataURL(cloudKey);
	}

	/**删除用户数据 */
	async deleteStudentDataExcel(cloudKey) {
		let dataService = new DataService();
		return await dataService.deleteDataExcel(cloudKey);
	}

    /**
     * 单条数据表导出
     * @param {condition} 0未上报 1上报 2全部
     * @param {grade}     本科/研究生 /全部
     * @param {college}   学院/      /全部
     */
        async exportStudentDataExcel({
            adminId,//账号
            openid,//openid区分导出个人
            condition,//区分全部和普通查询
            kind,//区分(全部,研究生,本科生,博士)
            college,//区分(全部,学院名,)
            searchKey,//搜索关键词
            ifopen,
        }){
        try{
            //获取当天日期
            let StudentModel;
            //认证账号数据库
            switch(adminId){
                case 'admin':StudentModel=adminModel;break;
            }
            // let time=timeUtil.timestamp2Time(timeUtil.time(), 'Y-M-D');
            let where={}
            let orderBy={'STUDENTS_ORDER': 'asc',}
            let field='STUDENTS_ORDER,STUDENTS_COLLEGE,STUDENTS_GRADE,STUDENTS_NAME,STUDENTS_CLASS,STUDENTS_NUMBER,STUDENTS_KIND,STUDENTS_ETHNIC_MINORITY,STUDENTS_HONGKONG,STUDENTS_STATUS';
            //根据学院,年级,是否上报,获取表单列表
            if(college=='全部'){//全部学院
                if(kind=='全部'){//全部年级
                    if(condition!='2'){
                        where={//全部学院 全部年级的0/1
                            STUDENTS_STATUS:condition,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }else{
                        where={
                            STUDENTS_IFOPEN:ifopen
                        }//全部学院 全部年级 全部人
                    }
                }else{//其他年级
                    if(condition!='2'){//不是全部
                        where={// 某年级 0/1
                            STUDENTS_KIND:kind,
                            STUDENTS_STATUS:condition,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }else{
                        where={// 某年级 全部
                            STUDENTS_KIND:kind,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }  
                }
            }else{//某学院
                if(kind=='全部'){
                    if(condition!='2'){
                        where={//某学院 0/1
                            STUDENTS_COLLEGE:college,
                            STUDENTS_STATUS:condition,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }else{//某学院 全部
                        where={
                            STUDENTS_COLLEGE:college,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }
                }else{//某学院 某年级
                    if(condition!='2'){//不是全部
                        where={
                            STUDENTS_COLLEGE:college,
                            STUDENTS_KIND:kind,
                            STUDENTS_STATUS:condition,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }else{
                        where={//某学院 某年级 全部
                            STUDENTS_COLLEGE:college,
                            STUDENTS_KIND:kind,
                            STUDENTS_IFOPEN:ifopen
                        }
                    }  
                }
            }
            if(searchKey!=''){
                where.STUDENTS_TITLE=db.RegExp({
                    regexp: searchKey,
                    options: 'i'
                })
                // var StudentList =await StudentModel.getAllBig(where,field,orderBy);//
                // var StudentList =await StudentModel.searchGetAllBig(where,field,orderBy,searchKey);
            }
             var StudentList =await StudentModel.getAllBig(where,field,orderBy);
            let allList=[];
            let row = ['学院','年级','姓名','班别','学号','人员类别','当日是否完成核酸'];
            allList.push(row);
            for(let k=0;k<StudentList.length;k++){
                // STUDENTS_ORDER:'string|true|comment=序号',
                // STUDENTS_COLLEGE:'string|true|comment=学院',
                // STUDENTS_GRADE:'string|true|comment=年级',
                // STUDENTS_NAME:'string|true|comment=姓名',
                // STUDENTS_CLASS:'string|true|comment=班级',
                // STUDENTS_NUMBER:'string|true|comment=学号',
                // STUDNETS_KIND:'string|true|comment=人员类别',
                // STUDENTS_ETHNIC_MINORITY:'string|true|comment=少数民族',
                // STUDENTS_HONGKONG:'string|true|comment=港澳台生',
                // STUDENTS_STATUS:'string|true|comment=是否完成核酸',
                    let arr = [];
                    arr.push(StudentList[k].STUDENTS_COLLEGE);
                    arr.push(StudentList[k].STUDENTS_GRADE);
                    arr.push(StudentList[k].STUDENTS_NAME);
                    arr.push(StudentList[k].STUDENTS_CLASS);
                    arr.push(StudentList[k].STUDENTS_NUMBER);
                    arr.push(StudentList[k].STUDENTS_KIND);
                    // arr.push(StudentList[k].STUDENTS_ETHNIC_MINORITY);
                    // arr.push(StudentList[k].STUDENTS_HONGKONG);
                    arr.push(StudentList[k].STUDENTS_STATUS);
                    allList.push(arr);
            }
                let dataService = new DataService();
                let collegeString=config.collegeList[adminId][college];
                return await dataService.exportDataExcel(adminId+collegeString+openid,college,StudentList.length,allList);

            //-1全部 0未,1已经
            //新建数组生成excel
            //挂入云存储
            //返回云链接
        }catch(e){
            console.log(e);
        }
    } 

}

module.exports = AdminExportService;