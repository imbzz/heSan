// projects/A00/more/more.js
let PassortBiz = require('../../../biz/passport_biz.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [

          ],
        adm: '',
        pwd: '',
        academyName: '',
        param: '',
    },
    gotoPage: async function (options) {
        if(await PassortBiz.userLogin()==false){
            return;
        };
        wx.navigateTo({
            url: '../../../pages/admin/index/login/admin_login', //要跳转到的页面路径
        })
    },
    gotoYss: function (opinions) {
        wx.navigateToMiniProgram({
            appId: 'wx80f82a9098907eed',
            path: '',
            envVersion: 'release', // 打开正式版
            success(res) {
                // 打开成功
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },
    gotoYue: function (opinions) {
        wx.navigateToMiniProgram({
            appId: 'wx82d43fee89cdc7df',
            path: '',
            envVersion: 'release', // 打开正式版
            success(res) {
                // 打开成功
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },
    gotoSui: function (opinions) {
        wx.navigateToMiniProgram({
            appId: 'wx2ac2313767a99df9',
            path: '',
            envVersion: 'release', // 打开正式版
            success(res) {
                // 打开成功
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },
    gotoSubmit: async function (opinion) {
        if(await PassortBiz.userLogin()==false){
            return;
        };
        wx.navigateTo({
          url: '../stuSubmit/stuSubmit',
        })
    },
    gotoOutput: async function (opinion) {
        if(await PassortBiz.userLogin()==false){
            return;
        };
        wx.navigateTo({
            url: '../outPut/outPut?',
          })
    },
    afterRead(event) {
        const { file } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: '', // 仅为示例，非真实的接口地址
          filePath: file.url,
          name: 'file',
          formData: { user: 'test' },
          success(res) {
            // 上传完成需要更新 fileList
            const { fileList = [] } = this.data;
            fileList.push({ ...file, url: res.data });
            this.setData({ fileList });
          },
        });
      },
      //跳转更多页面
      bindContact: function(e){
        wx.navigateTo({
			url: '../../../pages/about_us/about_us',
		});
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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

    }
})