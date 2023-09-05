/**
 * Notes: 导出模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2022-01-15 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');
const AdminExportService = require('../../service/admin/admin_export_service.js');

class AdminExportController extends BaseAdminController {

	/**************报名数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async joinDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();

		if (input.isDel === 1)
			await service.deleteJoinDataExcel(); //先删除

		return await service.getJoinDataURL();
	}

	/** 导出数据 */
	async joinDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			meetId: 'id|must',
			startDay: 'date|must',
			endDay: 'date|must',
			status: 'int|must|default=1'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();
		return await service.exportJoinDataExcel(input);
	}

	/** 删除导出的报名数据文件 */
	async joinDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();
		return await service.deleteJoinDataExcel();
	}

	/************** 用户数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async userDataGet() {
		await this.isAdmin();
        
		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();

		if (input.isDel === 1)
			await service.deleteUserDataExcel(); //先删除 
	
		return await service.getUserDataURL();
	}

	/** 导出数据 */
	async userDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
            condition: 'string|name=完成上报条件',

		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();
		return await service.exportUserDataExcel(input.condition);
	}

	/** 删除导出的用户数据 */
	async userDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();
		return await service.deleteUserDataExcel();
	}
    /************** 学生上报数据导出 BEGIN ********************* */
    /** 当前是否有导出文件生成 */
	async studentDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
            isDel: 'int|must', //是否删除已有记录
            adminId:'string|must',
            college:'string|must',
            openid:'string|must',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();

		if (input.isDel === 1)
			await service.deleteStudentDataExcel(input.adminId+input.college+input.openid); //先删除 
	
		return await service.getStudentDataURL(input.adminId+input.college+input.openid);
	}

	/** 导出数据 */
	async studentDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
            adminId:'string|name=账号id',
            condition: 'string|name=导出条件',
            kind:'string|name=年级',
            college:'string|name=学院中文名',
            openid:'string|name=openid',
            searchKey:'string|name=搜索条件',
            ifopen:'string|must',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();
		return await service.exportStudentDataExcel(input);
	}

	/** 删除导出的用户数据 */
	async StudentDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {
            adminId:'string|must',
            college:'string|must',
            openid:'string|must',
        };

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminExportService();
		return await service.deleteStudentDataExcel(input);
	}
}

module.exports = AdminExportController;