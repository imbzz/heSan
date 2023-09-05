/**
 * Notes: 导出数据表
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2021-03-01 19:20:00 
 */


const BaseModel = require('./base_model.js');

class UploadModel extends BaseModel {

}

// 集合名
UploadModel.CL = "ax_upload";

UploadModel.DB_STRUCTURE = {
	_pid: 'string|true',
	UPLOAD_ID: 'string|true',
	UPLOAD_KEY: 'string|true',
    UPLOAD_CLOUD_ID: 'string|true|comment=cloudID',
    UPLOAD_SUM_NUMBER:'int|true|comment=数据总条数',

	UPLOAD_ADD_TIME: 'int|true',
	UPLOAD_EDIT_TIME: 'int|true',
	UPLOAD_ADD_IP: 'string|false',
	UPLOAD_EDIT_IP: 'string|false',
};

// 字段前缀
UploadModel.FIELD_PREFIX = "UPLOAD_";


module.exports = UploadModel;