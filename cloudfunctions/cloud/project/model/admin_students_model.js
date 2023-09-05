/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2020-10-14 19:20:00 
 */


const BaseModel = require('./base_model.js');
class adminModel extends BaseModel {}

// 集合名
adminModel.CL = "ax_admin_students";

adminModel.DB_STRUCTURE = {
	_pid: 'string|true',
	STUDENTS_ID: 'string|true',
    STUDENTS_KEY:'string|true',
    
    STUDENTS_TITLE:'string|true|comment=搜索关键词',
    STUDENTS_ORDER:'string|true|comment=序号',
    STUDENTS_COLLEGE:'string|true|comment=学院',
    STUDENTS_GRADE:'string|true|comment=年级',
    STUDENTS_NAME:'string|true|comment=姓名',
    STUDENTS_CLASS:'string|true|comment=班级',
    STUDENTS_NUMBER:'string|true|comment=学号',
    STUDNETS_KIND:'string|true|comment=人员类别',
    STUDENTS_ETHNIC_MINORITY:'string|true|comment=少数民族',
    STUDENTS_HONGKONG:'string|true|comment=港澳台生',
    STUDENTS_STATUS:'string|true|comment=是否完成核酸',
    STUDENTS_IFOPEN:'string|true|comment=是否开启',
    
    
    /**
     * { 
     *   number:序号
     *   college:学院
     *   grade:本科/研究生
     *   name:姓名
     *   class:班级
     *   studnetNumber:学号
     *   status:0/1(字符是否完成核酸)
     * }
     */

	STUDENTS_ADD_TIME: 'int|true',
	STUDENTS_ADD_IP: 'string|false',

	STUDENTS_EDIT_TIME: 'int|true',
	STUDENTS_EDIT_IP: 'string|false',
}

// 字段前缀
adminModel.FIELD_PREFIX = "STUDENTS_";

/**
 * 状态 0=待审核,1=正常 
 */
adminModel.STATUS = {
	UNUSE: 0,
	COMM: 1
};

adminModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常'
};


module.exports = adminModel;