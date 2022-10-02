App({
    //  全局数据
    globalData: {
      // 本地未处理的用户信息
      localUserInfo: '',
      // 用户信息
      userInfo: {},
      // openid
      openid: '',
      // 用户的头像云地址
      publisherImageUrl: '',
      // 判断是否展示实际版本的标记
      isReal: null,
      // 帖子是否自动通过审核
      isArticlePass:false,
      // 资源是否自动通过审核
      isResourcePass:false,
      // 评论是否自动通过审核
      isCommentPass:false,
    },
    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    async onLaunch() {
      // 初始化云环境
      await wx.cloud.init({
        env: 'hesuanofficial-8gp0jtoi3d51cbd9'
      })
  
  
      // 加载版本信息
    //   await wx.cloud.database().collection('deal')
    //     .get()
    //     .then(res => {
    //       this.globalData.isReal = res.data[0].isReal;
    //       this.globalData.isArticlePass = res.data[0].isArticlePass;
    //       this.globalData.isResourcePass = res.data[0].isResourcePass;
    //       this.globalData.isCommentPass = res.data[0].isCommentPass;
    //       if (res.data[0].isDeleCaChe) {//删除缓存
    //         console.log("清空缓存");
    //         wx.setStorageSync('openid', '');
    //         wx.setStorageSync('localUserInfo', '');
    //         wx.setStorageSync('userInfo', '');
    //         wx.setStorageSync('yibanInfo', '');
    //         wx.setStorageSync('resource', '');
    //         wx.setStorageSync('article', '');
    //         this.globalData.openid = '';
    //         this.globalData.userInfo = '';
    //         this.globalData.localUserInfo = '';
    //       }
    //       if(res.data[0].isDeleAdminCaChe){//删除管理员的登录缓存
    //         wx.setStorageSync('adminInfo', '');
    //       }
    //     })

        // 用于自定义导航栏
		await wx.getSystemInfo({
			success: e => {
				this.globalData.statusBar = e.statusBarHeight;
				let capsule = wx.getMenuButtonBoundingClientRect();
				if (capsule) {
					this.globalData.custom = capsule;
					this.globalData.customBar = capsule.bottom + capsule.top - e.statusBarHeight;
				} else {
					this.globalData.customBar = e.statusBarHeight + 50;
				} 
			}
		});
  
    },
  
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {
        this.checkForUpdate();
    },
  
    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function () {
  
    },
  
    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function (msg) {
  
    },
    
    
        checkForUpdate:function(){
            const updataMeneger = wx.getUpdateManager();
            updataMeneger.onUpdateReady(function(){
                wx.showModal({
                  title:'更新提示',
                  content:'新版本已准备好，是否重启应用？',
                  success:function(res){
                      if(res.confirm){
                          updataMeneger.applyUpdate();
                      }
                  }
                })
            })
            updataMeneger.onUpdateFailed(function(){
                wx.showModal({
                  title:'已有新版的上线了哟~',
                  content:'新版本已上线了哟~,请删除当前小程序,重新搜索打开'
                })
            })
        }
    
  })