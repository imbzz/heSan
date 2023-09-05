const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js'); 
const fileHelper = require('../../../../helper/file_helper.js'); 
const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
            adminId:'',
            college:'',
            password:'',
            newUrl: '',
            oldUrl:'',
            time: '',
            condition: '',
            couldKey:'',
            // cloudUrl:'',
            isLoad: false,
            exit:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // onLoad(options) {
    //    console.log('可还行11111111111111111111111');
    //    if (!AdminBiz.isAdmin(this)) return;
	// 	if (options && options.condition) {//condition是核酸状态 此处不需要
            
	// 		this.setData({
	// 			condition: options.condition
    //         })
           
	// 	}
    //     if(this.data.cloudUrl===''){//此处不需要
    //         this.setData({
    //             exit:0,
    //         })
    //     }else{
    //         this.setData({
    //             exit:1,
    //         })
    //     }
    //     this._loadDetail(this.data.exit,this.data.condition,this.data.cloudUrl);
    // },

    onLoad(options) {
        console.log(0);
		if (!AdminBiz.isAdmin(this))
            return;
        
        //此处要传入参数
        // adminId: 账号
        // college: 学院名(中文名,字符留到云函数操作方便随时修改)
        if(options&&options.adminId){
            this.setData({
                adminId:options.adminId,
            })
        }
        if(options&&options.college){
            this.setData({
                college:options.college,
            })
        }
        if(options&&options.password){
            this.setData({
                password:options.password,
            })
        }
        console.log('关闭');
       console.log(this.data);
        this._loadDetail(this.data.adminId,this.data.password);//this.data.cloudKey
	},


	// _loadDetail: async function (isDel,condition,cloudUrl) {//cloudKey
	// 	if (!AdminBiz.isAdmin(this)) return;

	// 	let params = {
    //         isDel,
    //         condition,
    //         cloudUrl,
    //         // cloudKey,
	// 	}
	// 	let options = {
	// 		title: 'bar'
	// 	}
	// 	let data = await cloudHelper.callCloudData('admin/user_data_get', params, options);
    //     console.log(data);
    //     console.log(1);
	// 	if (!data) return;

	// 	this.setData({
	// 		isLoad: true,
	// 		oldUrl: data.url,
    //         time: data.time,
    //         // cloudKey:data.cloudKey,
	// 	})

	// },
    _loadDetail: async function (adminId,college){
        if (!AdminBiz.isAdmin(this)) return;

		let params = {
            adminId,
            college,
            // cloudKey,
		}
		let options = {
			title: 'bar'
		}
		let data = await cloudHelper.callCloudData('admin/student_file_dataget', params, options);
        console.log(data);
        console.log(1);

            if (!data) return;
            this.setData({
                sumNumber:data.sumNumber,
                oldUrl: data.oldUrl,
                time: data.time,
                isLoad: true,
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
	// onPullDownRefresh: async function () {
    //     if(this.data.cloudUrl===''){//去掉
    //         this.setData({
    //             exit:0,
    //         })
    //     }else{
    //         this.setData({
    //             exit:1,
    //         })
    //     }

    //     await this._loadDetail(this.data.exit,this.data.condition);//此行去掉
    //     // await this.__loadDetail(this.adminId,this.college);
	// 	wx.stopPullDownRefresh();
    // },
    
    onPullDownRefresh: async function () {
        if(this.data.adminId&&this.data.password){
            await this._loadDetail(this.data.adminId,this.data.password);//此行去掉
            // await this.__loadDetail(this.adminId,this.college);
        }else{
            pageHelper.showNoneToast('账号和分类不存在');
        }
		wx.stopPullDownRefresh();
	},

    bindOpenTap:function(e) {
		fileHelper.openDoc('客户数据', this.data.oldUrl);
	},

	url: async function (e) {
		pageHelper.url(e, this);
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    catchDelFileTap:async function(){
        let that = this;
		let callback = function () {
			that.setData({
				newUrl: ''
			});
		}
		pageHelper.showConfirm('确定要删除临时选择文件吗？', callback);
    },

    bindChooseFile:async function(){
        let that = this;
        wx.chooseMessageFile({
          count: 1,
          type:'file',
          success(res){
              const path = res.tempFiles[0].path;
              that.setData({
                  newUrl:path,
              })
          }
        })
    },

    /**
     * 上传按键
     */
    bindFileAddSubimit:async function(){
     //后期可优化,此bug出现的几率极少
        //如果上传过程中出现网络中断,可能会无法清除已经上传的部分数据,
        //上传过程最多不超10s,只要保证十秒不断网就行
        let adminId=this.data.adminId;//账号admin
        // let college=this.data.college;//学院
        let password=this.data.password;
        let newUrl=this.data.newUrl;//新文件的临时路径
        let oldUrl=this.data.oldUrl;//
        let that = this;
		let callback = function () {
			that.bindFileDel()
        }
        if(this.data.newUrl==''&&this.data.oldUrl==''){
            pageHelper.showModal('请选择文件再上传');
            return;
        }

        //判断是否有新文件
        if(this.data.newUrl===''){
            pageHelper.showConfirm('不选择新文件则会删除原数据,确定要删除吗?',callback);
            return;
        }
        //无清除旧文件及数据
        try{
            
            if(this.data.newUrl!=''){

               let newFileUrl=await AdminNewsBiz.UploadFile(adminId,password,newUrl,oldUrl);
                
                 if(newFileUrl!=''){
                     //将云存储路径缓存本地 防止下面的云函数运行一半出错时可以用路径删除所有数据重开
                     wx.setStorageSync('uploadCloudUrl', newFileUrl);

                    let params = {
                        adminId,
                        college:password,//学院
                        cloudUrl:newFileUrl,
                    }
                    let options = {
                        title:'学生数据入库中',
                    }
                    wx.showLoading({
                        title: '数据生成中...',
                        mask: true
                    });
                    await cloudHelper.callCloudSumbit('admin/student_database_insert',params,options).then(res=>{
                        console.log(res.data);
                        this.setData({
                            newUrl:'',
                            cloudUrl:'',
                            oldUrl:res.data.oldUrl,
                            studentNumber: res.data.sumNumber,
                            time:res.data.time,
                        })
                       //插入成功则删除云存储缓存
                       if(res.data.oldUrl){
                        wx.removeStorageSync('uploadCloudUrl');
                       }
                        pageHelper.showModal('数据插入成功(' + res.data.sumNumber + '条记录), 如有错误请删除旧数据文件再上传');
                       
                    })
                // }
            }
            }
        }catch(e){
            console.log(e);
        }
      
        //有清除旧文件数据添加新文件数据
    },

    //删除改密码对应上传 所以内容:包括插入的数据 
    bindFileDel:async function(){
        //删除数据文件 ||wx.getStorageInfoSync('uploadCloudUrl')
        //后期可优化,此bug出现的几率极少
        //如果上传过程中出现网络中断,可能会无法清除已经上传的部分数据,
        //上传过程最多不超10s,只要保证十秒不断网就行
     if(this.data.oldUrl==''){
         pageHelper.showSuccToast('已经无旧文件,请重新上传文件');
         return;
     }
     try {
         let params = {
             adminId:this.data.adminId,
             college:this.data.password,
         }
         let options = {
             title: '数据删除中',
             
         }
         await cloudHelper.callCloudSumbit('admin/student_file_delete', params, options).then(res => {
             console.log(res);
             //此处可以加上判断是否删除成功
             this.setData({
                 oldUrl: '',
                 time: '',
                 cloudUrl:'',
             });
             pageHelper.showModal('删除成功,成功删除('+(res.data)+')条数据');
         });
     } catch (err) {
         console.log(err);
         pageHelper.showNoneToast('删除失败，请重试');
     }
     },
 
    

})