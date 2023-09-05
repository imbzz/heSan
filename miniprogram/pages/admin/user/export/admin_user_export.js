const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js'); 
const fileHelper = require('../../../../helper/file_helper.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: '',
        time: '',
        couldKey:'',
        condition: '2',//状态(0/1)
        conditionName:'',
        adminId:'',//账号(admin)
        password:'',//密码(学院对应密码)
        college:'',//学院(中文名)
        kind:'',//年级(本科/研究生/博士生/全部)
        ifopen:'1',
        openid:'',
        searchKey:'',//搜索值
		cloudUrl:'',
        isLoad: false,
        exit:0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
        console.log(options);
		// if (!AdminBiz.isAdmin(this)) return;
        var openid = await wx.getStorageSync('openid');
        // if (options && options.condition &&options.adminId
        //     &&options.password&&options.college&&options.grade) {//状态
		// 	this.setData({
        //         condition: options.condition,
        //         adminId: options.adminId,
        //         password: options.password,
        //         college: options.college,
        //         grade:options.grade
        //     })
        // }
        if(openid){
            this.setData({
                openid:openid,
            })
        }
        console.log('openid:'+this.data.openid);
        // condition={{condition}}&adminId={{adminId}}&password={{password}}&college={{college}}&kind={{kind}}&searchKey={{search}}"
        if(options&&options.condition){
            this.setData({
                condition:options.condition,
            })
        }
        if(options&&options.adminId){
            this.setData({
                adminId: options.adminId,
            })
        }
        if(options&&options.password){
            this.setData({
                password: options.password,
            })
        }
        if(options&&options.kind){
            this.setData({
                kind: options.kind,
            })
        } 
        if(options&&options.college){
            this.setData({
                college: options.college, 
            })
        }
        if(options&&options.ifopen){
            this.setData({
                ifopen:options.ifopen,
            })
        }
    
        if(options&&options.condition){
            let conditionName;
            switch(options.condition){
                case '2':conditionName='全部';break;
                case '1':conditionName='已完成';break;
                case '0':conditionName='未完成';break;
            }
            this.setData({
                conditionName,
            })
        }
        if (options && options.searchKey) {//搜索条件
			this.setData({
				searchKey: options.searchKey
            })
        }
        if(this.data.url===''){
            this.setData({
                exit:0,
            })
        }else{
            this.setData({
                exit:1,
            })
        }
        console.log('用户数据导出:');
        console.log(this.data);
        // this._loadDetail(this.data.exit,this.data.condition,this.data.cloudUrl);//this.data.cloudKey
        await this._loadDetail(this.data.exit,this.data.adminId,this.data.password,this.data.openid);
	},
    /**
     * 加载旧路径
     * @param {*} isDel 是否删除旧文件
     * @param {*} condition 状态
     * @param {*} cloudUrl 云存储路径
     * @param {*} adminId  账号
     * @param {*} password 密码对应学院
     */
	_loadDetail: async function (isDel,adminId,college,openid) {//cloudKey
		if (!AdminBiz.isAdmin(this)) return;

		let params = {//需要根据页面传参优化下面数据
            isDel,
            adminId,
            college,
            openid,
            // college,
            // cloudKey,
		}
		let options = {
			title: 'bar'
        }
        //'admin/user_data_get': 'admin/admin_export_controller@userDataGet',
		let data = await cloudHelper.callCloudData('admin/student_data_get', params, options);
        console.log(data);
        console.log(1);
		if (!data) return;

		this.setData({
			isLoad: true,
			url: data.url,
            time: data.time,
            // cloudUrl:data.cloudUrl,
            // cloudKey:data.cloudKey,
		})

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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
        if(this.data.url===''){
            this.setData({
                exit:0,
            })
        }else{
            this.setData({
                exit:1,
            })
        }
        
        // await this._loadDetail(this.data.exit,this.data.condition);
        await this._loadDetail( this.data.exit,this.data.adminId,this.data.password,this.data.openid);
		wx.stopPullDownRefresh();
	},

	bindOpenTap:function(e) {
		fileHelper.openDoc('客户数据', this.data.url);
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
   //生成
	bindExportTap: async function (e) {
		try {
			let options = {
				title: '数据生成中'
            }
            let params={}
        
                params = {
                    condition: this.data.condition,//状态
                    adminId:this.data.adminId,//账号
                    college:this.data.college,//密码
                    kind:this.data.kind,//年级
                    openid:this.data.openid,
                    searchKey:this.data.searchKey,
                    ifopen:this.data.ifopen,
                }
            
			await cloudHelper.callCloudData('admin/student_data_export', params, options).then(res => {
                // isDel,adminId,college
				this._loadDetail(0,this.data.adminId,this.data.password,this.data.openid);
				pageHelper.showModal('数据文件生成成功(' + res.total + '条记录), 请点击「直接打开」按钮或者复制文件地址下载');

			});
		} catch (err) {
			console.log(err);
			pageHelper.showNoneToast('导出失败，请重试');
		}

	},

	bindDelTap: async function (e) {
		try {
			let options = {
                title: '数据删除中',
            }
            let params ={
                adminId:this.data.adminId,
                college:this.data.password,
                openid:this.data.openid
            }
			await cloudHelper.callCloudData('admin/student_data_del',params,options).then(res => {
				this.setData({
					url: '',
                    time: '',
                    cloudUrl:'',
				});
				pageHelper.showSuccToast('删除成功');
			});
		} catch (err) {
			console.log(err);
			pageHelper.showNoneToast('删除失败，请重试');
		}

	},


})