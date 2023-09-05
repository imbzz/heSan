/**
 * Notes: 预约模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2021-12-08 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');
const AdminMeetService = require('../../service/admin/admin_meet_service.js');
const AdminTempService = require('../../service/admin/admin_temp_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const cacheUtil = require('../../../framework/utils/cache_util.js');
const LogModel = require('../../model/log_model.js');
const MeetModel = require('../../model/meet_model.js');/////

class AdminMeetController extends BaseAdminController {//继承语法

	// 计算可约天数函数
	_getLeaveDay(days) {
		let now = timeUtil.time('Y-M-D');
		let count = 0;
		for (let k in days) {
			if (days[k] >= now) count++;
		}
		return count;
	}

	/** 获得可预约天数列表 */
	async getDayList() {
		await this.isAdmin();

		let rules = {
			meetId: 'must|id',
			start: 'must|date',
			end: 'must|date',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.getDayList(input.meetId, input.start, input.end);
	}

	/** 生成自助签到码 */
	async genSelfCheckinQr() {
        await this.isAdmin();

		let rules = {
			page: 'must|string',
            // timeMark: 'must|string',//某一时间段的标记不适合固定二维码
            meetId:'must|string',
		};
		// 留下上述数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.genSelfCheckinQr(input.page, input.meetId);
	}

	/** 管理员按钮核销 */
	async checkinJoin() {
		await this.isAdmin();

		let rules = {
			joinId: 'must|id',
			flag: 'must|in:0,1'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		await service.checkinJoin(input.joinId, input.flag);
	}

	/** 管理员扫码核验 */
	async scanJoin() {
		await this.isAdmin();

		let rules = {
			meetId: 'must|id',
			code: 'must|string|len:15',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		await service.scanJoin(input.meetId, input.code);
	}

	/** 成了 预约排序 */
	async sortMeet() { // 数据校验
		await this.isAdmin();

		let rules = {
			meetId: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		await service.sortMeet(input.meetId, input.sort);
	}

	/** 成了 预约状态修改 */////////////////////////////////////////////////////////////
	async statusMeet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			meetId: 'must|id',
			status: 'must|int|in:0,1,9,10',
		};

		// 取得数据
		let input = this.validateData(rules);

		let name = await this.getNameBeforeLog('meet', input.meetId);

		let service = new AdminMeetService();
		await service.statusMeet(input.meetId, input.status);

		this.log('修改了预约《' + name + '》的状态', LogModel.TYPE.MEET);
	}


	/** 报名状态修改 */
	async statusJoin() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			joinId: 'must|id',
			status: 'must|int|in:0,1,8,9,10,98,99',
			reason: 'string|max:200',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.statusJoin(this._admin, input.joinId, input.status, input.reason);
	}

	/** 报名删除 */
	async delJoin() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			joinId: 'must|id'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.delJoin(input.joinId);
	}

	/** 预约项目列表 *//////////////////
	async getMeetList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

        let service = new AdminMeetService();
		let result = await service.getMeetList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {

			list[k].MEET_ADD_TIME = timeUtil.timestamp2Time(list[k].MEET_ADD_TIME);
			list[k].MEET_EDIT_TIME = timeUtil.timestamp2Time(list[k].MEET_EDIT_TIME);
            list[k].leaveDay = this._getLeaveDay(list[k].MEET_DAYS_SET);
            console.log(0);
            console.log(list[k].leaveDay);

		}
		result.list = list;

		return result;

	}

	/** 预约名单列表 */
	async getJoinList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			meetId: 'must|id',
			mark: 'must|string',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		let result = await service.getJoinList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].JOIN_EDIT_TIME = timeUtil.timestamp2Time(list[k].JOIN_EDIT_TIME);

			//分解成数组，高亮显示
			let forms = list[k].JOIN_FORMS;
			for (let j in forms) {
				forms[j].valArr = dataUtil.splitTextByKey(forms[j].val, input.search);
			}

		}
		result.list = list;

		return result;

	}

	/**成了 创建新的发布 。//////////////////////////////////////////*/
	async insertMeet() {
		await this.isAdmin();

		let rules = {
			title: 'must|string|min:2|max:50|name=标题',
			typeId: 'must|id|name=分类',
			typeName: 'must|string|name=分类',
			order: 'must|int|min:1|max:9999|name=排序号',
			daysSet: 'must|array|name=预约时间设置', 
            isShowLimit: 'must|int|in:0,1|name=是否显示可预约人数',
            //不再在这里设置这两个//有两个单独函数设置以下两个数据，同时上传图片
            // styleSet:'must|object|name=封面设置', 
            // content:'must|array|name=详细介绍',
			formSet: 'must|array|name=用户资料设置',
		};

		// 取得数据
        let input = this.validateData(rules);//这个函数很重要
        //input内容
        // daysSet: Array(1)
        // 0: {day: "2022-08-04", dayDesc: "2022年8月4日 (周四)", times: Array(1)}
        // length: 1
        // __proto__: Array(0)
        // formSet: Array(2)
        // 0: {type: "line", title: "姓名", desc: "请填写您的姓名", must: true, len: 50, …}
        // 1: {type: "line", title: "手机", desc: "请填写您的手机号码", must: true, len: 50, …}
        // length: 2
        // __proto__: Array(0)
        // isShowLimit: 1
        // order: 9999
        // title: "123"
        // typeId: "1"
        // typeName: "羽毛球场预约"
        let service = new AdminMeetService();

		let result = await service.insertMeet(this._adminId, input);
		// 清空缓存ax_ache的数据
		cacheUtil.clear();
        console.log(input.title);
        this.log('创建了新预约《' + input.title + '》', LogModel.TYPE.MEET);
        //这句话用来记录操作者的操作记录到数据库 但是预约可以上传，这是就上传失败，两者最后的上传代码都是同一个，但是这个会报错，先搁置

		return result;

	}


	/** 获取预约信息用于编辑修改 */
	async getMeetDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};
		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		let detail = await service.getMeetDetail(input.id);
		return detail;
	}

	/**成了 编辑预约....创建后的修改保存 */
	async editMeet() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=标题',
			typeId: 'must|id|name=分类',
			typeName: 'must|string|name=分类',
			order: 'must|int|min:1|max:9999|name=排序号',
			daysSet: 'must|array|name=预约时间设置',
		 
			isShowLimit: 'must|int|in:0,1|name=是否显示可预约人数', 

			formSet: 'must|array|name=用户资料设置',
		};

		// 取得数据
		let input = this.validateData(rules);//里面有传入的参数event.params和rule共同输入check函数

        let service = new AdminMeetService();
//----------------------------------------------------------------------
		let result = service.editMeet(input);//这里设限制

		// 清空缓存-------------------------------
		cacheUtil.clear();
//-----------------------------------------------------------------
		this.log('修改了预约《' + input.title + '》内容', LogModel.TYPE.MEET);

		return result;
	}

	/** 成了 删除预约 *///////////////////////////////////////////
	async delMeet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			meetId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let name = await this.getNameBeforeLog('meet', input.meetId);

		let service = new AdminMeetService();
		await service.delMeet(input.meetId); 

		// 清空缓存
		cacheUtil.clear();

		this.log('删除了预约《' + name + '》', LogModel.TYPE.MEET);
	}

	/**成了
	 * 更新富文本信息 、、、、这是单独处理MeetContent的函数 
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateMeetContent() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			meetId: 'must|id',
			content: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);
		let service = new AdminMeetService();
		return await service.updateMeetContent(input);
	}


	/**
	 * 更新封面设置///////////
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateMeetStyleSet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			meetId: 'must|id',
			styleSet: 'object'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 清空缓存
		cacheUtil.clear();

		let service = new AdminMeetService();
		return await service.updateMeetStyleSet(input);
	}

	// 删除某时段预约记录
	async cancelJoinByTimeMark() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			meetId: 'must|id',
			timeMark: 'must|string',
			reason: 'string'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.cancelJoinByTimeMark(this._admin, input.meetId, input.timeMark, input.reason);
	}

	/** 创建模板 */
	async insertTemp() {
		await this.isAdmin();

		let rules = {
			name: 'must|string|min:1|max:20|name=名称',
			times: 'must|array|name=模板时段',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminTempService();
		let result = await service.insertTemp(input);

		return result;

	}

	/** 编辑模板 */
	async editTemp() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			isLimit: 'must|bool|name=是否限制',
			limit: 'must|int|name=人数上限',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminTempService();
		let result = service.editTemp(input);

		return result;
	}

	/** 模板列表 */
	async getTempList() {
		await this.isAdmin();

		let service = new AdminTempService();
		let result = await service.getTempList();

		return result;
	}

	/** 删除模板 */
	async delTemp() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminTempService();
		await service.delTemp(input.id);

	}

}

module.exports = AdminMeetController;