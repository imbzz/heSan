const NewsBiz = require('../biz/news_biz.js');
const pageHelper = require('../helper/page_helper.js');
let dataHelper = require('../helper/data_helper.js');
const setting = require('../setting/setting.js');
const cloudHelper = require('../helper/cloud_helper.js');
const PassortBiz = require('../biz/passport_biz.js');
const untilTime = require('../helper/time_helper')

module.exports = Behavior({

    /**
     * 页面的初始数据
     */
    data: {

    },

    methods: {
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: async function (options) {
            if (options && options.id) {
                this.setData({
                    _params: {
                        cateId: 1,
                    }
                });
            } else {
                this.setData({
                    _params: {
                        cateId: 0,
                    }
                });
            }

            if (setting.IS_SUB) wx.hideHomeButton();

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {},

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: async function () {
            /*
			// 获取当前小程序的页面栈
			let pages = getCurrentPages();
			// 数组中索引最大的页面--当前页面
			let currentPage = pages[pages.length - 1];
			// 附加参数 
			if (currentPage.options && currentPage.options.id) {
				this.setData({
					_params: {
						cateId: currentPage.options.id,
					}
				});
			}
            */

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

        url: async function (e) {
            pageHelper.url(e, this);
        },

        bindCommListCmpt: function (e) {
            pageHelper.commListListener(this, e);
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },

        _setCateTitle: function (skin, cateId = null) {

            // 获取当前小程序的页面栈
            let pages = getCurrentPages();
            // 数组中索引最大的页面--当前页面
            let currentPage = pages[pages.length - 1];
            // 附加参数 
            if (currentPage.options && currentPage.options.id) {
                cateId = currentPage.options.id;
            }
            let cateList = dataHelper.getSelectOptions(skin.NEWS_CATE);
            for (let k in cateList) {
                if (cateList[k].val == cateId) {
                    wx.setNavigationBarTitle({
                        title: cateList[k].label
                    });

                    if (cateList[k].ext) { //样式
                        this.setData({
                            listMode: cateList[k].ext
                        });
                    } else {
                        this.setData({
                            listMode: 'leftpic'
                        });
                    }

                }
            }
            return '';

        },
        panel: function (e) {
            if (e.currentTarget.dataset.index != this.data.showIndex) {
                this.setData({
                    showIndex: e.currentTarget.dataset.index
                })
            } else {
                this.setData({
                    showIndex: 0
                })
            }
        },
        bindAddStatus: async function (e) {
            if(e.currentTarget.dataset.ifrest==0){
                wx.showToast({
                  title: '休息时段不可反馈',
                  icon:'none',
                  duration:1500
                })
                return;
            }
            if(await PassortBiz.userLogin()==false){
                return;
            };
                let status=e.currentTarget.dataset.status;
                let id=e.currentTarget.dataset.id;
                let params={
                    status,//传0,1,2,3字符
                    id
                };
                let statusTitle;
                
                switch(status){
                    case '1':statusTitle='畅通';break;
                    case '2':statusTitle='忙碌';break;
                    case '3':statusTitle='拥挤';break;
                }
                 //思路:回调函数 调用回调函数的函数在最下面、
                 //bug1:反馈只有一条
                 //bug2:过去的日期没有去掉
                let callback = async()=>{
                    try{
                        let _openid= await wx.getStorageSync('openid')
                        let where={
                            _openid,
                        }
                        let user= await wx.cloud.database().collection('user').where(where).get();
                        let nowStanpTime = new Date().getTime();
                        let nowTime=untilTime.timestamp2Time(nowStanpTime,'Y-M-D h:m:s');
                        let newsId=id;
                        let inputData = {
                            add_stamp_time:nowStanpTime,
                            news_id:newsId,
                            add_time:nowTime
                        }
                        
                        let User=user.data[0];
                        console.log(User);
                        if(User.USER_FEED_BACK.length==0){
                            User.USER_FEED_BACK.push(inputData);
                        }else{
                            for(let k=0;k<User.USER_FEED_BACK.length;k++){
                                if(User.USER_FEED_BACK[k].news_id==newsId){
                                    if((nowStanpTime-User.USER_FEED_BACK[k].add_stamp_time)<600000){
                                       return pageHelper.showModal('十分钟内可反馈一次,您上次的反馈时间是'+User.USER_FEED_BACK[k].add_time);
                                    }else if((nowStanpTime-User.USER_FEED_BACK[k].add_stamp_time)>600000){
                                        User.USER_FEED_BACK[k].add_stamp_time=nowStanpTime;
                                        User.USER_FEED_BACK[k].add_time=nowTime;
                                        break;
                                    }
                                }
                                if(k==(User.USER_FEED_BACK.length-1)&&User.USER_FEED_BACK[User.USER_FEED_BACK.length-1].news_id!=newsId){
                                    User.USER_FEED_BACK.push(inputData);
                                    console.log(User.USER_FEED_BACK);
                                    break;
                                }
                            }
                        }
                        console.log(User.USER_FEED_BACK);
                       await wx.cloud.database().collection('user').where({_openid:_openid}).update({
                          data:{
                            USER_FEED_BACK:User.USER_FEED_BACK,
                          }
                       })
                       /////
                        let opts ={
                            title:'反馈中'
                        }
                        await cloudHelper.callCloudSumbit('news/addstatus',params,opts).then(res => {
                            wx.showToast({
                              title: '反馈成功',
                              icon:'none',
                              duration:1500
                            })
                        });
                    }catch(e){
                        console.log(e);
                    }
                }
                pageHelper.showConfirm('您确定现场是[ '+statusTitle+' ]的吗?', callback);
              },
       
    }
})