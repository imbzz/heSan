const AdminBiz = require('../../../biz/admin_biz.js');
const pageHelper = require('../../../helper/page_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const helper = require('../../../helper/helper.js');


// const app = getApp()
// const db = wx.cloud.database()
// const stuData = db.collection('ax_admin_students')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // college={{college}}&adminId={{adminId}}&password={{password}}&type={{type}}&kind='全部'&condition='1'&export='全部 已完成'"
        refresherTriggered:false,
        adminId:'',//账号
        college:'',//学院中文名
        password:'',//密码
        type:'',//密码权限类型
        kind:'',//(本科/研究生/博士)
        condition:'',//验完没验完
        search: '',//搜索关键词
        ifopen:'',
        dataList:{
            total:0,
        },
        page:1,
        // stuList: [],
        // lazyloadIdx: 0,
        tapName: ''//标题
    },
    onChange(e) {
        this.setData({
            value: e.datail,
        })
    },

    url: async function (e) {
		pageHelper.url(e, this);
	},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        if(options&&options.adminId&&options.college&&options.password&&options.export&&options.ifopen)
        this.setData({//学院college  分类kind condition完成情况
            tapName: options.college+' '+options.export,
            adminId:options.adminId,
            password:options.password,
            college:options.college,
            ifopen:options.ifopen,
        })
        // type:'',//密码权限类型
        // kind:'',//(本科/研究生/博士)
        // condition:'',//验完没验完
        if(options&&options.type&&options.condition){
            this.setData({
                type:options.type,
                condition:options.condition,
            })
        }
        if(options&&options.kind){
             this.setData({
                kind:options.kind,
            })
        }
        console.log('列表');
        console.log(this.data);
        this._loadDetail(1);
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
        if(this.data.search!=''){
            let tapName = this.data.tapName+' '+this.data.search;
            this.setData({
                tapName,
            })
            this._loadDetail(1);
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
    
     _loadDetail:async function(page) {

        let params = {
            page:page,
        };
        
        //账号密码
        if(this.data.adminId&&this.data.password){
            params.adminId =this.data.adminId,
            params.password=this.data.password
        }
        // 搜索关键字
        if (this.data.search)
            params.search = this.data.search;

        // 搜索菜单
        if (this.data.sortType && helper.isDefined(this.data.sortVal)) {
            params.sortType = this.data.sortType;
            params.sortVal = this.data.sortVal;
        }

        //if (page == 1 && !this.data._dataList) { TODO???
        // if (this.data.page == 1) {
        //     this.setData({
        //         dataList: null
        //     })
        //         //第一页面且没有数据提示加载中
        // }


        let opt = {};
        if(this.data.ifopen=='1'){
            if(this.data.college=='全部'){//全部学院
                if(this.data.kind=='全部'){//全部年级
                    if(this.data.condition!='2'){
                        params.whereEx={//全部学院 全部年级的0/1
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_STATUS:this.data.condition,
                        }
                    }else{
                        params.whereEx={
                            STUDENTS_IFOPEN:this.data.ifopen,
                        }//全部学院 全部年级 全部人
                    }
                }else{//其他年级
                    if(this.data.condition!='2'){//不是全部
                        params.whereEx={// 某年级 0/1
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_KIND:this.data.kind,
                            STUDENTS_STATUS:this.data.condition,
                        }
                    }else{
                        params.whereEx={// 某年级 全部
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_KIND:this.data.kind,
                        }
                    }  
                }
            }else{//某学院
                if(this.data.kind=='全部'){
                    if(this.data.condition!='2'){
                        params.whereEx={//某学院 0/1
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_COLLEGE:this.data.college,
                            STUDENTS_STATUS:this.data.condition,
                        }
                    }else{//某学院 全部
                        params.whereEx={
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_COLLEGE:this.data.college,
                        }
                    }
                }else{//某学院 某年级
                    if(this.data.condition!='2'){//不是全部
                        params.whereEx={
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_COLLEGE:this.data.college,
                            STUDENTS_KIND:this.data.kind,
                            STUDENTS_STATUS:this.data.condition,
                        }
                    }else{
                        params.whereEx={//某学院 某年级 全部
                            STUDENTS_IFOPEN:this.data.ifopen,
                            STUDENTS_COLLEGE:this.data.college,
                            STUDENTS_KIND:this.data.kind,
                        }
                    }  
                }
            }
        }else if(this.data.ifopen=='0'){
            params.whereEx={
                STUDENTS_IFOPEN:this.data.ifopen,
                STUDENTS_COLLEGE:this.data.college,
            }
        }
        

        
        //if (this.data._dataList && this.data._dataList.list && this.data._dataList.list.length > 0)//
        opt.title = 'bar'; //this//_dataList//admin/meet_list//1//bar
        await cloudHelper.dataList(this, 'dataList', 'admin/student_list', params, opt);
        console.log(this.data);
        // wx.showLoading({
        //   title: '加载中...',
        // })
        // let res = await listData.skip(20 * page).get()
        // wx.hideLoading()
        // console.log('请求来的数据', res.data)
        // this.setData({
        //     stuList: this.data.stuList.concat(res.data)
        // })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this._loadDetail(this.data.dataList.page + 1);
    },

    onPullDownRefresh: async function () {
        // 下拉刷新
        this.setData({
            refresherTriggered: true
        });
        await this._loadDetail(1);
        this.setData({
            refresherTriggered: false
        });

    },
    // gotoSearch: function() {
    //     wx.navigateTo({
    //       url: '../search/search',
    //     })
    // },
    changeOpen: async function(e) {
        let item = e.currentTarget.dataset.info;
        console.log(item);
        let callback = async()=>{
            let studentData= item;
            let param ={
                adminId:this.data.adminId,
                studentNumber:studentData.STUDENTS_NUMBER,
                className:studentData.STUDENTS_CLASS,
            }
            await cloudHelper.callCloudSumbit('admin/student_ifopen_change',param).then(res => {
                console.log(res);
                // changeNumber,
                // changeOpen,
                if(res.data.changeNumber==1&&res.data.changeOpen=='0'){
                    wx.showToast({
                        title: '关闭成功',
                        icon:'none',
                        duration:1500
                      })
                }else if(res.data.changeNumber==1&&res.data.changeOpen=='1'){
                    wx.showToast({
                        title: '开启成功',
                        icon:'none',
                        duration:1500
                      })
                }else{
                    wx.showToast({
                        title: '系统错误',
                        icon:'none',
                        duration:1500
                      })
                }
              this._loadDetail(1);
            });
        }

        if(item.STUDENTS_IFOPEN=='1'){
            pageHelper.showConfirm('您确定要关闭[ '+item.STUDENTS_NAME+' ]同学的上报要求吗?', callback);
        }else if(item.STUDENTS_IFOPEN=='0'){
            pageHelper.showConfirm('您确定要开启[ '+item.STUDENTS_NAME+' ]同学的上报要求吗?', callback);
        }
        
        // var index = e.target.dataset['index']
        // console.log(this.data.dataList.list[index].STUDENTS_IFOPEN)
        // const id = this.data.dataList.list[index]._id
        // await db.collection('ax_admin_students').doc(id).update({
        //     data: {
        //       STUDENTS_IFOPEN: !this.data.dataList.list[index].STUDENTS_IFOPEN
        //     },
        //     success: function(res) {
        //       console.log(res.data)
        //     },
        //   })
        //   this._loadDetail(1); 
    }

})