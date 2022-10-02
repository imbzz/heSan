/**
 * Notes: 注册登录模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const AdminBiz = require('./admin_biz.js');
const setting = require('../setting/setting.js');
const dataHelper = require('../helper/data_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');
const app = getApp();
class PassportBiz extends BaseBiz {

	/**
	 * 页面初始化 分包下使用
	 * @param {*} skin   
     * PID: 'A00', // 运动场馆预定

	NAV_COLOR: '#ffffff',白色
	NAV_BG: '#24C68A',绿色
	MEET_NAME: '预约', 
	MENU_ITEM: ['首页', '预约日历', '我的'], // 第1,4,5菜
	NEWS_CATE: '1=场馆动态|leftpic,2=运动常识|rightpic',
	MEET_TYPE: '1=羽毛球场预约|leftbig2,2=足球场预约|leftbig3,3=篮球场预约|leftbig,4=乒乓球预约|upimg,5=网球场预约|upimg,6=游泳馆预约|upimg,7=健身房预约|leftbig3',
	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,


	 * @param {*} that 
	 * @param {*} isLoadSkin  是否skin加载为data
	 * @param {*} tabIndex 	是否修改本页标题为设定值
	 * @param {*} isModifyNavColor 	是否修改头部导航颜色
	 */
	static async initPage({
		skin,
		that,
		isLoadSkin = false,
		tabIndex = -1,
		isModifyNavColor = true
	}) {

		if (isModifyNavColor) {
			wx.setNavigationBarColor({ //顶部
				backgroundColor: '#2499f2',
			    frontColor: '#ffffff',
			});
		}


		if (tabIndex > -1) {
			wx.setNavigationBarTitle({
				title: skin.MENU_ITEM[tabIndex]
			});
		}

		skin.IS_SUB = setting.IS_SUB;
		if (isLoadSkin) {
			skin.newsCateArr = dataHelper.getSelectOptions(skin.NEWS_CATE);
			skin.meetTypeArr = dataHelper.getSelectOptions(skin.MEET_TYPE);
			that.setData({
				skin
			});
		}
	}
///////////////////////////////////////////
	static async adminLogin(name, pwd, that) {
		if (name.length < 5 || name.length > 30) {
			wx.showToast({
				title: '账号输入错误(5-30位)',
				icon: 'none'
			});
			return;
		}

		if (pwd.length < 5 || pwd.length > 30) {
			wx.showToast({
				title: '密码输入错误(5-30位)',
				icon: 'none'
			});
			return;
		}

		let params = {
			name,
			pwd
		};
		let opt = {
			title: '登录中'
		};

		try {
            
			await cloudHelper.callCloudSumbit('admin/login', params, opt).then(res => {
                if (res && res.data && res.data.name) AdminBiz.adminLogin(res.data);
               //login:res=
               //code: 200
               // data:
               // cnt: 49
               // last: "2022-08-01 22:04:22"
               // name: "系统管理员"
               // token: "zdm2grxqepwy3ssv9jcs4qpg9blqnqqp" 云函数获取
               // type: 1
               // __proto__: Object
               // msg: "admin/login:ok"
				wx.reLaunch({
					url: '/pages/admin/index/home/admin_home?name='+name+'&pwd='+pwd,
				});
			});
		} catch (e) {
			console.log(e);
		}

    }
    ////////////////////////////////
    static  async userLogin(){
            //   尝试从本地中获取用户信息
        try{
            var isLogin = await wx.getStorageSync('userInfo');
            console.log("缓存中的用户信息-->", isLogin);
            var openid = await wx.getStorageSync('openid');
            console.log("缓存中的openid-->", openid);
            if (isLogin&&openid){
                const publisherName = isLogin.nickName
                const searchAns = await this.searchUser(openid);
                console.log("搜索结果-->", searchAns);
                if (searchAns.data.length === 0) { //如果数据库的user表中没有该用户的数据，则新建一个用户的空白信息
                    const ans = await this.addUser(publisherName,openid);
                    console.log("当前用户在数据库user表中不存在,创建一条新的user数据-->", ans);
                    if (!ans) return false;
                  } else { 
                    const ans = await this.updateUserInfo(openid, publisherName);
                    console.log("当前用户在数据库user表中已存在,更新user的头像和昵称-->", ans);
                    if (!ans) return false;
                  }
                  return true;
              }else{
                var localUserInfo = await this.getUserAcception();
                if (!localUserInfo) {//点击了取消信息授权
                  wx.showToast({
                    title: '授权登录后才可以获取更多使用权限噢~',
                    icon: 'none',
                    duration: 2000
                  })
                  return false;
                }
                
                // 同意了信息授权
                wx.showLoading({
                  title: '正在授权'
                })
                  //调用云函数获取openid
                  const res = await wx.cloud.callFunction({
                      name:'getUserOpenid'
                  })
                  console.log(res);
                  // 判断云函数是否调用成功
                  if (!res) {
                    console.log("调用云函数获取openid失败", res);
                    return false;
                  }
                  // 0 获取openid
                  openid = res.result;
                  // 1 将openid保存到本地缓存
                  await wx.setStorageSync('openid', openid);
                  // 2 将openid保存到全局
                  app.globalData.openid = openid;
                  console.log("调用云函数获取openid,结果-->", openid);
                  // 四. 根据openid搜索user集合表
                  const searchAns = await this.searchUser(openid);
                  console.log("搜索结果-->", searchAns);
                  // 获取用户微信昵称
                  const publisherName = localUserInfo.nickName; //昵称
                  // 上传用户头像并获取用户微信头像地址
            
                  // 判断是新建还是更新  用户的头像和昵称
                  if (searchAns.data.length === 0) { //如果数据库的user表中没有该用户的数据，则新建一个用户的空白信息
                    const ans = await this.addUser(publisherName);
                    console.log("当前用户在数据库user表中不存在,创建一条新的user数据-->", ans);
                    if (!ans) return false;
                  } else { 
                    const ans = await this.updateUserInfo(openid, publisherName);
                    console.log("当前用户在数据库user表中已存在,更新user的头像和昵称-->", ans);
                    if (!ans) return false;
                  }
                //   imageUrl: publisherImageUrl, gender: localUserInfo.gender
                  var userInfo = { nickName: publisherName };
                  console.log("处理后的用户信息--->", userInfo);
                
                  // 将用户信息保存到本地缓存
                  await wx.setStorageSync('userInfo', userInfo);
                  // 保存到全局
                  app.globalData.userInfo = userInfo;
                  wx.showToast({
                    title: '登录成功',
                    duration: 1500
                  })
                //   this.onShow();//刷新页面
                return true;
            }
            }catch(e){
                console.log(e);
            }    
    }
/////////////////
  static async searchUser(openid) {
    try {
      // 3 在数据库中的user表中查找当前的openid
      const res = await wx.cloud.database().collection('user').where({
        _openid: openid
      })
        .get();
      console.log("搜索user表成功");
      return res;
    } catch (err) {
      console.log("搜索user表出现错误");
      return err;
    }
  }

  static async getUserAcception() {
    try {
      const res = await wx.getUserProfile({
        desc: '授权'
      });
      console.log("用户授权获取的信息-->", res);
      const localUserInfo = res.userInfo;
      // 将用户信息保存到本地缓存
      wx.setStorageSync('localUserInfo', localUserInfo);
      // 保存到全局
      app.globalData.localUserInfo = localUserInfo;
      return localUserInfo; //返回用户信息
    } catch (err) {
      console.log("用户点击取消授权");
    }
  }

  static async getImageInfo(imageUrl) {
    try {
      const res = await wx.getImageInfo({
        src: imageUrl,
      });
      return res;
    } catch (err) {
      console.log("获取头像图片信息失败", err);
    }
  }

  static async upLoadImage(filePath) {
    try {
      const res = await wx.cloud.uploadFile({
        cloudPath: filePath.slice(11), //根据图片的临时网址进行截取字符串作为图片名
        filePath: filePath, //图片的临时路径
      });
      console.log("图片上传成功,信息为-->", res)
      return res.fileID; //返回图片信息
    } catch (err) {
      console.log("图片上传失败-->", err)
      // 修改状态，标记任务执行异常
      this.setData({
        state: 1
      })
    }
  }
/////// publisherImageUrl, gender
  static async addUser(publisherName) {
    try {
      const res = await wx.cloud.database().collection('user')
        .add({
          data: {
            USER_NAME: publisherName, //用户的微信昵称
            USER_FEED_BACK:[],

            // imageUrl: publisherImageUrl, //图片在数据库中的地址
            // gender: gender,//性别
            // 为空数据的属性
            // fans: [], //粉丝
            // attention: [], //关注的用户
            // collection: [], //收藏的帖子
            // like: [],//点赞的帖子
            // searchHistory: [],//搜索历史
            // downLoadResource: [], //浏览过的资源，即点击过的资源
            // scanArticleList: [],//浏览过的帖子，即点击过的帖子
          }
        });
      return res;
    } catch (err) {
      console.log("用户信息新建失败", err);
    }
  }
//////, publisherImageUrl
  static async updateUserInfo(openid, publisherName) {
    try {
      const res = await wx.cloud.database().collection('user')
        .where({
            _openid: openid
        })
        .update({
          data: {
            USER_NAME: publisherName, //用户的微信昵称
            // imageUrl: publisherImageUrl, //图片在数据库中的地址
          }
        });
    //   wx.showToast({
    //     title: '登录成功',
    //     duration: 1500
    //   })
      return res;
    } catch (err) {
      console.log("用户信息更新失败", err);
    }
  }
}




module.exports = PassportBiz;