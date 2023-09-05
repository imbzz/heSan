const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const PassportBiz = require('../../../../biz/passport_biz.js');
import Dialog from '../../../../vantui/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        pwd: '',
        college: '',
        param: '1', //登录页面验证,防止不同登录页面使用不属于该页面的密码也实现登录
        adminCache: {
            cacheAdm: '',
            cachePwd: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        AdminBiz.clearAdminToken();
        this.setData({
            name: wx.getStorageSync("adminCache").cacheAdm,
            pwd: wx.getStorageSync("adminCache").cachePwd
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
    onShow: function () {},

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

    bindBackTap: function (e) {
        wx.reLaunch({
            url: pageHelper.fmtURLByPID('/pages/my/index/my_index'),
        });
    },

    bindLoginTap: async function (e) {
        this.setData({
            adminCache: {
                cacheAdm: this.data.name,
                cachePwd: this.data.pwd
            },
        })
        Dialog.confirm({
                title: '温馨提示',
                message: '是否保存 账号 和 密码 ？',
            })
            .then(() => {
                // on confirm
                wx.setStorage({
                    key: "adminCache",
                    data: this.data.adminCache
                })
                let result = PassportBiz.adminLogin(this.data.name, this.data.pwd, this.data.college, this.data.param, this); //第三个参数只是凑个数没用
                let temp = result;
                return temp;
            })
            .catch(() => {
                // on cancel
                if(wx.getStorageSync('adminCache')){
                    wx.removeStorageSync('adminCache')
                }
                let result = PassportBiz.adminLogin(this.data.name, this.data.pwd, this.data.colleg, this.data.param, this); //第三个参数只是凑个数没用
                let temp = result;
                return temp;
            });


    },


})