const AdminBiz = require('../../../biz/admin_biz.js');
const pageHelper = require('../../../helper/page_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
import Notify from '../../../vantui/@vant/weapp/notify/notify';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        kind: '',
        ifopen: '1',
        type: 3,
        nowDay: '',
        adminId: '',
        password: '',
        college: '',
        isLoad: false,
        allForCollege: 0, //学院全部
        allUnForCollege: 0, //没验的学院全部
        allFreshForCollege: 0, //学院本科全部
        unFreshForCollege: 0, //本科未完成
        allGraduateForCollege: 0, //研究生全部
        unGraduateForCollege: 0, //研究生未完成
        allDoctorForCollege: 0, //博士全部
        unDoctorForCollege: 0, //博士生未完成
        isloginmessage: false, //是否提醒登录成功
    },
    //每个类别导出数据
    // gotoExport: function(e){ 
    //     console.log(e.currentTarget.dataset.export)   
    //     wx.navigateTo({
    //       url: '../stuDetail/stuDetail?name='+this.data.college.concat(e.currentTarget.dataset.export)+'&type='+this.data.type,
    //     })
    // },
    //导入数据
    // gotoInput:function(){
    //     wx.navigateTo({
    //         url: '../../../pages/admin/user/uploadd/admin_upload_file',
    //       })
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.data.academyName+'&adminId'+this.data.adm+'&password='+this.data.pwd,
        
        let pages = getCurrentPages(); //页面对象
        let prevpage = pages[pages.length - 2]; //上一个页面对象
        if(prevpage.route == 'projects/A00/outPut/outPut'){
            this.data.isloginmessage = true
        }


        if (options && options.college) {
            this.setData({
                college: options.college //类别
            })
        }
        if (options && options.adminId) {
            this.setData({
                adminId: options.adminId //类别
            })
        }
        if (options && options.password) {
            this.setData({
                password: options.password //类别
            })
        }
        if (options && options.type) {
            this.setData({
                type: options.type //权限控制 2
            })
        }
        console.log(this.data);
        this._loadDetail(this.data.adminId, this.data.college);
        // 登录成功提醒

    },

    //页面跳转
    url: function (e) {
        pageHelper.url(e, this);
    },
    /**
        * 加载旧路径 adminId:'string|must',
           college:'string|must|comment=学院中文',
        * @param {*} adminId  账号
        * @param {*} college 密码对应学院
        */
    _loadDetail: async function (adminId, college) { //cloudKey
        if (!AdminBiz.isAdmin(this)) return;

        let params = { //需要根据页面传参优化下面数据
            adminId,
            college,
            ifopen: this.data.ifopen,
            // college,
            // cloudKey,
        }
        let options = {
            title: 'bar'
        }
        //'admin/user_data_get': 'admin/admin_export_controller@userDataGet',
        let data = await cloudHelper.callCloudData('admin/user_data_count', params, options);
        console.log(data);
        if (!data) return;

        this.setData({
            isLoad: true,
            nowDay: data.nowDay,
            allForCollege: data.allForCollege, //学院全部
            allUnForCollege: data.allUnForCollege, //没验的学院全部
            allFreshForCollege: data.allFreshForCollege, //学院本科全部
            unFreshForCollege: data.unFreshForCollege, //本科未完成
            allGraduateForCollege: data.allGraduateForCollege, //研究生全部
            unGraduateForCollege: data.unGraduateForCollege, //研究生未完成
            allDoctorForCollege: data.allDoctorForCollege, //博士全部
            unDoctorForCollege: data.unDoctorForCollege, //博士生未完成
            // cloudUrl:data.cloudUrl,
            // cloudKey:data.cloudKey,
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {

        if (this.data.adminId && this.data.college) {
            await this._loadDetail(this.data.adminId, this.data.college);
            if(this.data.isloginmessage){
                Notify({
                    type: 'success',
                    message: '登录成功！'
                });
                this.data.isloginmessage = false;
            }
            
        }
       
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: async function () {
        if (this.data.adminId && this.data.college) {
            await this._loadDetail(this.data.adminId, this.data.college);
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})