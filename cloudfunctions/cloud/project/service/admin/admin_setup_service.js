/**
 * Notes: 设置管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2021-07-11 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const SetupModel = require('../../model/setup_model.js');
const config = require('../../../config/config.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const util = require('../../../framework/utils/util.js');

class AdminSetupService extends BaseAdminService {


	/** 关于我们 */
	async setupAbout({
        setUpId,
		about,
		aboutPic
	}) {
        try{
            let data={};
            let temp={
                about,
                aboutPic,
            }
            for(let key in temp){
                if(!util.isDefined(data[SetupModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()])){
                    data[SetupModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()] = temp[key];
                }
            }
            await SetupModel.edit(setUpId,data);
        }catch(e){
            console.log(e);
        }
        
		// this.AppError('此功能为完工，不断完善中：qq:1756612361');
	}

	/** 联系我们设置 */
	async setupContact({
		address,
		phone,
		officePic,
        servicePic,
        setUpId,
	}) {
        try{
            let data={};
            let temp={
            address,
		    phone,
		    officePic,
            servicePic,
            };
            for(let key in temp){
                 if(!util.isDefined(data[SetupModel.FIELD_PREFIX+dataUtil.toLine(key). toUpperCase()])){
                 data[SetupModel.FIELD_PREFIX+dataUtil.toLine(key).toUpperCase()]=temp[key];
                }
            }
            await SetupModel.edit(setUpId,data);
        }catch(e){
            console.log(e);
        }
        

		// this.AppError('此功能为完工，不断完善中：qq:1756612361');
	}

	/** 小程序码 */
	async genMiniQr() {
		//生成小程序qr buffer
		let cloud = cloudBase.getCloud();

		let page = "projects/" + this.getProjectId() + "/default/index/default_index";
		console.log(page);

		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: 'qr',
			width: 280,
			check_path: false,
			env_version: 'release', //trial,develop
			page
		});

		let upload = await cloud.uploadFile({
			cloudPath: config.SETUP_PATH + 'qr.png',
			fileContent: result.buffer,
		});

		if (!upload || !upload.fileID) return;

		return upload.fileID;
	}

}

module.exports = AdminSetupService;