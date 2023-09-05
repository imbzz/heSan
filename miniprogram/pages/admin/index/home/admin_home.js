const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
import Notify from '../../../../vantui/@vant/weapp/notify/notify';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
        isloginmessage: false, //是否提示登录成功
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
        let pages = getCurrentPages(); //页面对象
        let prevpage = pages[pages.length - 2]; //上一个页面对象
        if(prevpage.route == "pages/admin/index/login/admin_login"){
            this.data.isloginmessage = true;
        }

		if (!AdminBiz.isAdmin(this)) return;
        this.setData({
            name:options.name,
            pwd:options.pwd,
        })
        this._loadDetail(options.name,options.pwd);
        
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail(this.data.name,this.data.pwd);
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function (name,pwd) {///

		let admin = AdminBiz.getAdminToken();
		this.setData({
			isLoad: true,
            admin,
		});
 
		try {
            let param={
                name,
                pwd,
            }
			let opts = {
				title: 'bar'
            }
            //首页的活动数获取
			let res = await cloudHelper.callCloudData('admin/home', param, opts);
			this.setData({
				data: res
			});

		} catch (err) {
			console.log(err);
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
        // 登录成功提醒
        if(this.data.isloginmessage){
            Notify({ type: 'success', message: '登录成功！' });
            this.data.isloginmessage = false;
        }
        
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindExitTap: function (e) {

		let callback = function () {
			AdminBiz.clearAdminToken();
			wx.reLaunch({
				url: '../../../../projects/A00/more/more',
			});
		}
		pageHelper.showConfirm('您确认退出?', callback);
	},

	bindSettingTap: function (e) {
		let itemList = ['清除数据缓存'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //清除缓存
						await this._clearCache();
						break;
					}
				}
			},
			fail: function (res) {}
		})
	},

	_clearCache: async function () {
		try {
			let opts = {
				title: '数据缓存清除中'
			}
			await cloudHelper.callCloudSumbit('admin/clear_cache', {}, opts).then(res => {
				pageHelper.showSuccToast('清除成功');
			});
		} catch (err) {
			console.error(err);
		}
	}

})