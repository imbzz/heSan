/**
 * Notes: 用户管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2022-01-22y 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');

const util = require('../../../framework/utils/util.js');
const timeUtil= require('../../../framework/utils/time_util.js');
const UserModel = require('../../model/user_model.js');
const JoinModel = require('../../model/join_model.js');
const AdminModel = require('../../model/admin_model.js');
const adminModel = require('../../model/admin_students_model.js');
const { getList } = require('../../../framework/database/model.js');
class AdminUserService extends BaseAdminService {



    /**
     * 开关闭学生
     * @param {*} adminId
     * @param {*} studentNumber
     */
    async openStudentStatus({
        adminId,
        studentNumber,
        className,
    }){
        let Model;
        switch(adminId){
            case 'admin':Model=adminModel;break;
        }
        let where ={
            STUDENTS_NUMBER:studentNumber,
            STUDENTS_CLASS:className,
        }
        let studentData =await Model.getOne(where);
        if(studentData.STUDENTS_IFOPEN=='1'){
            let data ={//关闭
                STUDENTS_IFOPEN:'0',
            }
            let changeNumber= await Model.edit(where,data);
            let changeOpen='0';
            return {
                changeNumber,
                changeOpen,
            }
        }else if(studentData.STUDENTS_IFOPEN=='0'){
            let data ={//开启
                STUDENTS_IFOPEN:'1',
            }
            let changeNumber= await Model.edit(where,data);
            let changeOpen='1';
            return {
                changeNumber,
                changeOpen,
            }
        }
    }

    /**
     * 或缺不同类别人数
     * @param {*} param0 
     */
    async getDiffNumber({
        adminId,//账号
        college,//学院
        ifopen,//是否开启
        // condition,//字符
    }){
        let StudentModel;
        switch(adminId){
            case 'admin':StudentModel=adminModel;break;
        }
        //学院的全部和未完成
        let nowDay =timeUtil.timestamp2Time(timeUtil.time());
        let allForCollege=0;//学院全部
        let allUnForCollege=0;//没验的学院全部
        let allFreshForCollege=0;//学院本科全部
        let unFreshForCollege=0;//本科未完成
        let allGraduateForCollege=0;//研究生全部
        let unGraduateForCollege=0;//研究生未完成
        let allDoctorForCollege=0;//博士全部
        let unDoctorForCollege=0;//博士生未完成
////////////////////////////////////////////////////数据库查语法写法
try{
          if(college=='全部'){
              let where1 ={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_IFOPEN:'1',
              }//全部
              //全部未完成
              let where2={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_STATUS:'0',
                STUDENTS_IFOPEN:'1',
              }
               //本科
               let where3={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_KIND:'本科',
                STUDENTS_IFOPEN:'1',
              }
              let where4={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_KIND:'本科',
                STUDENTS_IFOPEN:'1',
                STUDENTS_STATUS:'0'
              }
              //研究生
              let where5={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_KIND:'研究生',
                STUDENTS_IFOPEN:'1',
              }
              let where6={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_KIND:'研究生',
                STUDENTS_IFOPEN:'1',
                STUDENTS_STATUS:'0'
              }
              //博士生
             let where7={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_KIND:'博士',
                STUDENTS_IFOPEN:'1',
              }
              let where8={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_KIND:'博士',
                STUDENTS_IFOPEN:'1',
                STUDENTS_STATUS:'0'
              }
        //       let allForCollege=0;//学院全部
        // let allUnForCollege=0;//没验的学院全部
        // let allFreshForCollege=0;//学院本科全部
        // let unFreshForCollege=0;//本科未完成
        // let allGraduateForCollege=0;//研究生全部
        // let unGraduateForCollege=0;//研究生未完成
        // let allDoctorForCollege=0;//博士全部
        // let unDoctorForCollege=0;//博士生未完成
              allForCollege = await StudentModel.count(where1);
              allUnForCollege = await StudentModel.count(where2);
              allFreshForCollege = await StudentModel.count(where3);
              unFreshForCollege =await StudentModel.count(where4);
              allGraduateForCollege = await StudentModel.count(where5);
              unGraduateForCollege =await StudentModel.count(where6);
              allDoctorForCollege = await StudentModel.count(where7);
              unDoctorForCollege =await StudentModel.count(where8);
              return {
                nowDay,
                allForCollege,//学院全部
                allUnForCollege,//没验的学院全部
                allFreshForCollege,//学院本科全部
                unFreshForCollege,//本科未完成
                allGraduateForCollege,//研究生全部
                unGraduateForCollege,//研究生未完成
                allDoctorForCollege,//博士全部
                unDoctorForCollege,//博士生未完成
            }
          }else{
            let where1 ={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
            }//全部
            let where2={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_STATUS:'0'
            }
            let where3={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_KIND:'本科',
              }
              let where4={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_KIND:'本科',
                STUDENTS_STATUS:'0'
            }
            let where5={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_KIND:'研究生',
              }
              let where6={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_KIND:'研究生',
                STUDENTS_STATUS:'0'
            }
            let where7={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_KIND:'博士',
              }
              let where8={
                STUDENTS_IFOPEN:ifopen,
                STUDENTS_COLLEGE:college,
                STUDENTS_IFOPEN:'1',
                STUDENTS_KIND:'博士',
                STUDENTS_STATUS:'0'
            }
            //全部
            allForCollege = await StudentModel.count(where1);
            allUnForCollege = await StudentModel.count(where2);
            //本科
            allFreshForCollege = await StudentModel.count(where3);
            unFreshForCollege =await StudentModel.count(where4);
            //研究生
            allGraduateForCollege = await StudentModel.count(where5);
            unGraduateForCollege =await StudentModel.count(where6);
            //博士
            allDoctorForCollege = await StudentModel.count(where7);
            unDoctorForCollege =await StudentModel.count(where8);
          }
/////////////////////////////////////////////////////for循环写法
        // if(college=='全部'){
        //     let where ={}
        //     let field ='STUDENTS_COLLEGE,STUDENTS_KIND,STUDENTS_STATUS';
        //     var datalist = await StudentModel.getAllBig(where,field);
        //     console.log(datalist);
        //     for(let i = 0;i<dataList.length;i++){
        //          switch(datalist[i].STUDENTS_KIND){
        //              case '本科':
        //                  allForCollege++;
        //                  allFreshForCollege++;
        //                  if(datalist[i].STUDENTS_STATUS=='0'){
        //                     unFreshForCollege++;
        //                     allUnForCollege++;
        //                  }
        //                  break;
        //              case'研究生':
        //              allForCollege++;
        //              allGraduateForCollege++;
        //                  if(datalist[i].STUDENTS_STATUS=='0'){
        //                     unGraduateForCollege++;
        //                     allUnForCollege++;
        //                  }
        //                  break;
        //              case'博士生':
        //                  allForCollege++;
        //                 allDoctorForCollege++;
        //                 if(datalist[i].STUDENTS_STATUS=='0'){
        //                     unDoctorForCollege++;
        //                     allUnForCollege++;
        //                  }
        //                  break;
        //          }
        //     }
        // }else{
        //     let where ={STUDENTS_COLLEGE:college}
        //     let field ='STUDENTS_COLLEGE,STUDENTS_KIND,STUDENTS_STATUS';
        //     try{
        //     var datalist = await StudentModel.getAllBig(where,field);
        //     console.log(datalist);
        //     for(let i = 0;i<dataList.length;i++){
        //          switch(datalist[i].STUDENTS_KIND){
        //              case '本科':
        //                 allForCollege++;
        //                  allFreshForCollege++;
        //                  if(datalist[i].STUDENTS_STATUS=='0'){
        //                     unFreshForCollege++;
        //                     allUnForCollege++;
        //                  }
        //                  break;
        //              case'研究生':
        //              allForCollege++;
        //              allGraduateForCollege++;
        //                  if(datalist[i].STUDENTS_STATUS=='0'){
        //                     unGraduateForCollege++;
        //                     allUnForCollege++;
        //                  }
        //                  break;
        //              case'博士生':
        //                 allForCollege++;
        //                 allDoctorForCollege++;
        //                 if(datalist[i].STUDENTS_STATUS=='0'){
        //                     unDoctorForCollege++;
        //                     allUnForCollege++;
        //                  }
        //                  break;
        //          }
        //     }
        // }catch(e){
        //     console.log(e);
        // }
        // }
        return {
            nowDay,
            allForCollege,//学院全部
            allUnForCollege,//没验的学院全部
            allFreshForCollege,//学院本科全部
            unFreshForCollege,//本科未完成
            allGraduateForCollege,//研究生全部
            unGraduateForCollege,//研究生未完成
            allDoctorForCollege,//博士全部
            unDoctorForCollege,//博士生未完成
        }
}catch(e){
    console.log(e);
}
       
    }

	/** 获得某个用户信息 */
	async getUser({
		userId,
		fields = '*'
	}) {
		let where = {
			USER_MINI_OPENID: userId,
		}
		return await UserModel.getOne(where, fields);
	}

	/** 取得用户分页列表 */
	async getUserList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件 
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_ADD_TIME: 'desc'
		};
		let fields = '*';


		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
					USER_NAME: ['like', search]
				},
				{
					USER_MOBILE: ['like', search]
				},
				{
					USER_MEMO: ['like', search]
				},
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					where.and.USER_STATUS = Number(sortVal);
					break;
				case 'companyDef':
					// 单位性质 
					where.and.USER_COMPANY_DEF = (sortVal);
					break;

				case 'sort':
					// 排序
					if (sortVal == 'newdesc') { //最新
						orderBy = {
							'USER_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'newasc') {
						orderBy = {
							'USER_ADD_TIME': 'asc'
						};
					}
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);


		// 为导出增加一个参数condition
		result.condition = encodeURIComponent(JSON.stringify(where));

		return result;
    }
    

/** 取得用户分页列表 */
async getStudentList({
    adminId,
    password,
    search, // 搜索条件
    sortType, // 搜索菜单
    lsortVa, // 搜索菜单
    orderBy, // 排序
    whereEx, //附加查询条件 
    page,
    size,
    oldTotal = 0
}) {

    // STUDENTS_TITLE:'string|true|comment=搜索关键词',
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
    // STUDENTS_IFOPEN:'string|true|comment=是否开启',
    orderBy = orderBy || {
        STUDENTS_EDIT_TIME: 'desc'
    };
    let fields = '*';


    let where = whereEx;
    // where.and = {
    //     _pid: this.getProjectId() //复杂的查询在此处标注PID
    // };

    if (util.isDefined(search) && search) {
        where.or = [{
            STUDENTS_TITLE: ['like', search]
            }
            // ,
            // {
            //     USER_MOBILE: ['like', search]
            // },
            // {
            //     USER_MEMO: ['like', search]
            // },
        ];

    } else if (sortType && util.isDefined(sortVal)) {
        // 搜索菜单
        switch (sortType) {
            case 'status':
                where.and.STUDENTS_STATUS = Number(sortVal);
                break;
            case 'companyDef':
                // 单位性质 
                where.and.USER_COMPANY_DEF = (sortVal);
                break;

            case 'sort':
                // 排序
                if (sortVal == 'newdesc') { //最新
                    orderBy = {
                        'STUDENTS_EDIT_TIME': 'desc'
                    };
                }
                if (sortVal == 'newasc') {
                    orderBy = {
                        'STUDENTS_EDIT_TIME': 'asc'
                    };
                }
        }
    }
    let Model;
    switch(adminId){
        case 'admin':Model=adminModel;break;
    }
    let result = await Model.getList(where, fields, orderBy, page, size, true, oldTotal, false);


    // 为导出增加一个参数condition
    result.condition = encodeURIComponent(JSON.stringify(where));

    return result;
}

	/**删除用户 */
	async delUser(id) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

}

module.exports = AdminUserService;