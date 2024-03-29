/**
 * Notes: 后台登录与首页模块
 * Date: 2021-03-15 19:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');
const AdminHomeService = require('../../service/admin/admin_home_service.js');

class AdminHomeController extends BaseAdminController {


	// 管理首页 
	async adminHome() {
		await this.isAdmin();

		// 数据校验
		let rules = {
            name: 'must|string|name=账号',
			pwd: 'must|string|name=密码',
		};

		// 取得数据
        let input = this.validateData(rules);
		let service = new AdminHomeService();
		return await service.adminHome(input.name);
	}

	// 清除缓存  
	async clearCache() {
		let service = new AdminHomeService();
		await service.clearCache();
	}

	// 管理员登录  
	async adminLogin() {

		// 数据校验
		let rules = {
			name: 'required|string|min:5|max:30|name=管理员名',
            pwd: 'required|string|min:5|max:30|name=密码',
            college:'string',
            param:'string|must',//登录页面唯一性验证,防止密码串用
		};

		// 取得数据
		let input = this.validateData(rules);//数据校验

		let service = new AdminHomeService();
		return await service.adminLogin(input);
	}

}

module.exports = AdminHomeController;