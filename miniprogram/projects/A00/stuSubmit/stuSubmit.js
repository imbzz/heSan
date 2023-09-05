// projects/A00/stuSubmit/stuSubmit.js
const cloudHelper = require('../../../helper/cloud_helper.js');
const pageHelper = require('../../../helper/page_helper.js')
let PassortBiz = require('../../../biz/passport_biz.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        studentNumber: '', //学号
        // radio: '1',//检查地点
        show: false, //控制弹出层
        schoolName: '广州大学', //学校名字
        className: '',
        columns: ['广州大学']
    },
    onChangeNum(event) {

        // event.detail 为当前输入的值
        if (event.detail) {
            this.setData({
                studentNumber: event.detail
            })
        }
        console.log(this.data.studentNumber);
    },
    onChangeClass(event) {
        // event.detail 为当前输入的值
        if (event.detail) {
            this.setData({
                className: event.detail
            })
        }
        console.log(this.data.className);
    },
    onChangePlace(event) {
        this.setData({
            radio: event.detail,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        //获取openid
        var openid = wx.getStorageSync('openid');
        if (openid) {
            this.setData({
                openid: openid,
            })
        }
        var studentNumber = wx.getStorageSync('studentNumber');
        if (studentNumber) {
            this.setData({
                studentNumber: studentNumber,
            })
        }
        var className = wx.getStorageSync('className');
        if (className) {
            this.setData({
                className: className,
            })
        }
    },


    /**
     * 上报32106100028
     */
    onFinishSubmit: async function () {

        if (await PassortBiz.userLogin() == false) {
            return;
        }

        if (this.data.studentNumber == '') {
            pageHelper.showModal('请输入学号');
            return;
        }
        if (this.data.className == '') {
            pageHelper.showModal('请输入班别');
            return;
        }

        let callback = async () => {
            let param;
            let adminId;
            if (this.data.studentNumber && this.data.schoolName) {
                switch (this.data.schoolName) {
                    case '广州大学':
                        adminId = 'admin';
                        break;
                }
                param = {
                    studentNumber: this.data.studentNumber,
                    className: this.data.className,
                    adminId: adminId,
                    openid: this.data.openid
                }
                await cloudHelper.callCloudSumbit('admin/student_finish_submit', param).then(res => {
                    if (res.data == 1) {
                        pageHelper.showSuccToast('上报成功');
                        var studentNumber = wx.getStorageSync('studentNumber');
                        var className = wx.getStorageSync('className');
                        if (studentNumber != this.data.studentNumber || className != this.data.className) {
                            let stuNumber = this.data.studentNumber;
                            let claName = this.data.className;
                            let callback2 = function () {
                                wx.setStorageSync('studentNumber', stuNumber);
                                wx.setStorageSync('className', claName);
                                wx.navigateToMiniProgram({
                                    appId: 'wx20489798118cf47f',
                                    path: '',
                                    envVersion: 'release', // 打开正式版
                                    success(res) {
                                        // 打开成功
                                    },
                                    fail: function (err) {
                                        console.log(err);
                                    }
                                })
                            }
                            let callback3 = function () {
                                wx.navigateToMiniProgram({
                                    appId: 'wx20489798118cf47f',
                                    path: '',
                                    envVersion: 'release', // 打开正式版
                                    success(res) {
                                        // 打开成功
                                    },
                                    fail: function (err) {
                                        console.log(err);
                                    }
                                })
                            }
                            setTimeout(() => {
                                pageHelper.showConfirm('是否保存[ ' + this.data.studentNumber + ' ] [' + this.data.className + ']?', callback2, callback3);
                            }, 700);
                        } else {
                            setTimeout(() => {
                                wx.navigateToMiniProgram({
                                    appId: 'wx20489798118cf47f',
                                    path: '',
                                    envVersion: 'release', // 打开正式版
                                    success(res) {
                                        // 打开成功
                                    },
                                    fail: function (err) {
                                        console.log(err);
                                    }
                                })
                            }, 700);
                            
                        }

                    }
                });
            }

        }
        pageHelper.showConfirm('您确定上报信息[ ' + this.data.studentNumber + ' ] [' + this.data.className + ']正确吗?', callback);

    },

    showPopup() {
        this.setData({
            show: true
        });
    },
    onClose() { //点击空白处开闭弹出层（选择器）及选择器左上角的取消
        this.setData({
            show: false
        });
    },
    onConfirm(e) { //选择器右上角的确定，点击确定获取值
        this.setData({
            schoolName: e.detail.value,
            show: false
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
    onShow() {

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
    onPullDownRefresh() {

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

    },

})