const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');
const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');

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
        this.setData({
            name:options.name,
            pwd:options.pwd,
            type:options.type
        })
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
        if(this.data.type==1){
        pageHelper.url(e, this);
        }else{
            wx.showToast({
                title: '超级管理者才可编辑',
                icon:'none',
                duration:1500,
              })
        }
	},
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//以下函数都是操作每个小方块内的按键
//操作搜索的按键在组件内  组件路径miniprogram——>cmpts——>public——>list——>comm_list_cmpt
	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
    },
    //创建文章页面
    bindeCreatNews:function(e){
        let type = parseInt(this.data.type);
        if(type==1){
            this.url(e);
        }else{
            wx.showToast({
              title: '超级管理者才可创建',
              icon:'none',
              duration:1500,
            })
        }
    },
    //手动关闭和开启
    bindOpenOrClose: async function(e){
        let type = parseInt(this.data.type);
    
        if(type==1){
            let id = e.currentTarget.dataset.id;
            let params = {
                id,
            }
            try {
                await cloudHelper.callCloudSumbit('admin/news_status_rest', params).then(res => {
                    pageHelper.modifyListNode(id, this.data.dataList.list, 'NEWS_STATUS_ADMIN_REST',res.data.adminRest, '_id');
                    this.setData({
                        dataList: this.data.dataList
                    });
                    pageHelper.showSuccToast('设置成功');
                });
            } catch (e) {
                console.log(e);
            }
       }else{
        wx.showToast({
          title: '超级管理者才可开启关闭',
          icon:'none',
          duration:1500,
        })
    }
    },
    ///上首页函数
	bindSortTap: async function (e) {
         let type = parseInt(this.data.type);
    
        if(type==1){
		if (!AdminBiz.isAdmin(this)) return;
        
		let id = e.currentTarget.dataset.id;
        let sort =e.currentTarget.dataset.sort;


		if (!id || !sort) return;
        sort= parseInt(sort)
		let params = {
			id,
			sort
		}
        console.log(1);
		try {
			await cloudHelper.callCloudSumbit('admin/news_sort', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'NEWS_ORDER', sort);
				this.setData({
					dataList: this.data.dataList
                });
                if(sort==0){
                    pageHelper.showSuccToast('置顶成功');
                }else{
                    pageHelper.showSuccToast('取消置顶成功');
                }    
			});
		} catch (e) {
			console.log(e);
        }
    }else{
        wx.showToast({
            title: '超级管理者才可开启关闭',
            icon:'none',
            duration:1500,
          })
    }
	},



    //删除
	_del: async function (id, that) {
		if (!AdminBiz.isAdmin(this)) return;
        if (!id) return;
        if(that.data.type==1){

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/news_del', params, opts).then(res => {
					pageHelper.delListNode(id, that.data.dataList.list, '_id');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);//回调函数判断是否删减
      }else{
        wx.showToast({
            title: '超级管理者才可删除',
            icon:'none',
            duration:1500,
          })
      }
	},

	bindReviewTap: function (e) {
		let id = pageHelper.dataset(e, 'id');
		wx.navigateTo({
			url: pageHelper.fmtURLByPID('/pages/news/detail/news_detail?id=' + id),
		});
	},

	bindStatusSelectTap: async function (e) {
        if (!AdminBiz.isAdmin(this)) return;
        
		let itemList = ['畅通','忙碌','拥挤','删除'];
        let id = pageHelper.dataset(e, 'id');
        let ifrest=parseInt(pageHelper.dataset(e, 'ifrest'));
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
                    case 0: { //畅通
                        if(ifrest==0){
                            await this._setStatus(id, 1, this);
                            break;
                        }else{
                            wx.showToast({
                              title: '休息时段不可修改状态',
                              icon:'none',
                              duration:1500
                            })
                            break;
                        }
					}
                    case 1: { //忙碌
                        if(ifrest==0){
						await this._setStatus(id, 2, this);
                        break;
                    }else{
                        wx.showToast({
                          title: '休息时段不可修改状态',
                          icon:'none',
                          duration:1500
                        })
                        break;
                    }
                    }
                    case 2: { //拥挤
                        if(ifrest==0){
						await this._setStatus(id, 3, this);
                        break;
                    }else{
                        wx.showToast({
                          title: '休息时段不可修改状态',
                          icon:'none',
                          duration:1500
                        })
                        break;
                    }
                    }
                    case 3: { //删除  
						await this._del(id, this);
                        break;
                    }
				}

			},
			fail: function (res) {}
		})
	},


	_setStatus: async function (id, status, that) {
		status = Number(status);
		let params = {
			id,
			status
		}

		try {
			await cloudHelper.callCloudSumbit('admin/news_status', params).then(res => {
				pageHelper.modifyListNode(id, that.data.dataList.list, 'NEWS_STATUS', status, '_id');
				that.setData({
					dataList: that.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {
		let arr = await AdminNewsBiz.getCateList();

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: '畅通',
				type: 'status',
				value: 1
			},
			{
				label: '停用',
				type: 'status',
				value: 0
			},
			{
				label: '忙碌',
				type: 'status',
				value: 2
            },
            {
				label: '拥挤',
				type: 'status',
				value: 3
			}
		]
		sortMenus = sortMenus.concat(arr);
		this.setData({
			sortItems,
			sortMenus
		})
	}

})