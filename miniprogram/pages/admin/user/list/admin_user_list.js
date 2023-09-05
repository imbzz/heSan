const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const helper = require('../../../../helper/helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		await this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {},

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
    
   

	url: async function (e) {
		pageHelper.url(e, this);
	},


	bindCommListCmpt: function (e) {
        // console.log(1);
    
        // console.log(e.detail.dataList);
        // console.log(0);

        if (helper.isDefined(e.detail.search))
            this.setData({
                search: '',
                sortType: '',
            });
        else {
            this.setData({
                dataList: e.detail.dataList,
            });
            if (e.detail.sortType)
                this.setData({
                    sortType: e.detail.sortType,
                });
        }

	},

	bindDelTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/user_del', params, opts).then(res => {
					
					pageHelper.delListNode(id, this.data.dataList.list, 'USER_MINI_OPENID');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindStatusTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = pageHelper.dataset(e, 'status');

		let params = {
			id,
			status
		}
		try {
			await cloudHelper.callCloudSumbit('admin/user_status', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'USER_STATUS', status, 'USER_MINI_OPENID');
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: '已签到',
				type: 'status',
				value: 1
			}, 
			{
				label: '未签到',
				type: 'status',
				value: '0'
			},

        ]
        
		this.setData({
			sortItems,
			sortMenus
		})


	}

})