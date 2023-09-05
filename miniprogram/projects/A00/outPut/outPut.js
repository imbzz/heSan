const AdminBiz = require('../../../biz/admin_biz.js');
const pageHelper = require('../../../helper/page_helper.js');
const PassportBiz = require('../../../biz/passport_biz.js');
import Dialog from '../../../vantui/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false, //控制弹出层
        columns: ['全部学院', '经济与统计学院', '法学院', '教育学院', '体育学院', '人文学院', '外国语学院', '新闻与传播学院', '管理学院(中法旅游学院)', '公共管理学院', '音乐舞蹈学院', '美术与设计学院', '数学与信息科学学院', '物理与材料科学学院', '化学化工学院', '地理科学与遥感学院', '生命科学学院', '机械与电气工程学院','马克思主义学院','电子与通信工程学院', '计算机科学与网络工程学院', '建筑与城市规划学院', '土木工程学院', '环境科学与工程学院', '网络空间安全学院', '国际教育学院', '教师培训学院'],
        adm: '', //账号
        academyName: '', //动态显示学院名
        pwd: '', //密码academy_jw
        type: 3, //密码权限类别
        param: '2', //区分两个登录页面(2号页面)
        // radio: '1', //本科1 or 研究生2
        myCache: {
            cacheName: '',
            cacheAdm: '',
            cachePwd: '',
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            academyName: wx.getStorageSync("myCache").cacheName,
            adm: wx.getStorageSync("myCache").cacheAdm,
            pwd: wx.getStorageSync("myCache").cachePwd
        })
        if (options && options.type == 2) {
            this.setData({
                type: options.type,
            })
        }
        // console.log(this.data.type+'11111111111111111');
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

    // onChangeStudent: function (event) {
    //     this.setData({
    //         radio: event.detail,
    //     });
    // },

    bindBackTap: function (e) {
        wx.reLaunch({
            url: pageHelper.fmtURLByPID('/pages/my/index/my_index'),
        });
    },

    bindLoginTap: async function (e) {
        if (this.data.academyName == '全部学院') {
            this.data.academyName = '全部';
        }
        this.setData({
            myCache: {
                cacheName: this.data.academyName,
                cacheAdm: this.data.adm,
                cachePwd: this.data.pwd,
            },
        })
        Dialog.confirm({
                title: '温馨提示',
                message: '是否保存 账号 和 密码 ？',
            })
            .then(() => {
                // on confirm
                wx.setStorage({
                    key: "myCache",
                    data: this.data.myCache
                })
                let result = PassportBiz.adminLogin(this.data.adm, this.data.pwd, this.data.academyName, this.data.param, this); //第三个参数只是凑个数没用
                let temp = result;
                return temp;
            })
            .catch(() => {
                // on cancel
                if (wx.getStorageSync('myCache')) {
                    wx.removeStorageSync('myCache')
                }
                let result = PassportBiz.adminLogin(this.data.adm, this.data.pwd, this.data.academyName, this.data.param, this); //第三个参数只是凑个数没用
                let temp = result;
                return temp;
            });
    },
    onClose() { //点击空白处开闭弹出层（选择器）及选择器左上角的取消
        this.setData({
            show: false
        });
    },
    onConfirm(e) { //选择器右上角的确定，点击确定获取值
        this.setData({
            academyName: e.detail.value,
            show: false
        })
    },
    showPopup() {
        this.setData({
            show: true
        });
    },

})