/**
 * Notes: 资讯后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const cloudHelper = require('../helper/cloud_helper.js');
const dataHelper = require('../helper/data_helper.js');
const pageHelper = require('../helper/page_helper.js');
const setting = require('../setting/setting.js');

class AdminNewsBiz {

	// 提取简介
	static getDesc(desc, content) {
		if (desc) return dataHelper.fmtText(desc, 100);
		if (!Array.isArray(content)) return desc;

		for (let k in content) {
			if (content[k].type == 'text') return dataHelper.fmtText(content[k].val, 100);
		}
		return desc;
	}

    /**
     * 文件存储删除
     * @param {*} adminId 
     * @param {*} password 
     * @param {*} tempFilePath 
     */
    static async deleteFile(adminId,password){
        try{
            let options={
                title:'旧文件删除中',
            }
            let params ={
                adminId,
                password,
            }
            let res = await cloudHelper.callCloudSumbit('admin/student_file_delete', params,options);
            return res;
        }catch(e){
            console.log(e);
        }
        
    }


    /**
     * 文件上传
     * @param {*} adminId
     * @param {*} college
     * @param {*} tempFilePath 
     */
    static async UploadFile(adminId,password,tempFilePath,oldUrl){

        //清除所以旧数据
        if(oldUrl!=''){
            let res = await this.deleteFile(adminId,password);
            if(!res) return;
        }
        // 图片上传到云空间
		let FileData = await cloudHelper.transTempFileOne(tempFilePath,setting.FILE_ADMIN_STUDENT,adminId+password);
        try {
        if(FileData.cloudUrl) {
		
		let params = {
			adminId:adminId,
            college:password,
            cloudUrl:FileData.cloudUrl
        }
    
            let options = {
                title:'文件上传中',
            }
            wx.showLoading({
                title: '文件信息处理中..',
                mask: true
            });
    
			// 更新数据 从promise 里直接同步返回
            let res = await cloudHelper.callCloudSumbit('admin/student_file_upload', params,options);
            if(res){
            let cloudUrl=res.data;
            return cloudUrl;
            }
        }
	} catch (err) {
			console.error(err);
	}
    }

	/** 
	 * 图片上传
	 * @param {string} newsId 
	 * @param {Array} imgList  图片数组
	 */
	static async updateNewsPic(newsId, imgList) {

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.NEWS_PIC_PATH, newsId);

		// 更新本记录的图片信息
		let params = {
			newsId: newsId,
			imgList: imgList
		}

		try {
			// 更新数据 从promise 里直接同步返回
			let res = await cloudHelper.callCloudSumbit('admin/news_update_pic', params);
			return res.data.urls;
		} catch (err) {
			console.error(err);
		}
	}


	/** 
	 * 富文本中的图片上传
	 * @param {string} newsId 
	 * @param {Array} content  富文本数组
	 */
	static async updateNewsCotnentPic(newsId, content, that) {
		let imgList = [];
		for (let k in content) {
			if (content[k].type == 'img') {
				imgList.push(content[k].val);
			}
		}

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.NEWS_PIC_PATH, newsId);

		// 更新图片地址
		let imgIdx = 0;
		for (let k in content) {
			if (content[k].type == 'img') {
				content[k].val = imgList[imgIdx];
				imgIdx++;
			}
		}

		// 更新本记录的图片信息
		let params = {
			newsId,
			content
		}

		try {
			// 更新数据 从promise 里直接同步返回
			await cloudHelper.callCloudSumbit('admin/news_update_content', params);
			that.setData({
				formContent: content
			});
		} catch (e) {
			console.error(e);
			return false;
		}

		return true;
	}

	static getCateName(cateId) {
		let skin = pageHelper.getSkin();
		let cateList = dataHelper.getSelectOptions(skin.NEWS_CATE);

		for (let k in cateList) {
			if (cateList[k].val == cateId) return cateList[k].label;
		}
		return '';
    }
    static getCateNameThree(cateId) {
		let skin = pageHelper.getSkin();
		let cateList = dataHelper.getSelectOptions(skin.NEW_CATE_Three);

		for (let k in cateList) {
			if (cateList[k].val == cateId) return cateList[k].label;
		}
		return '';
    }
    static getCateNameTwo(cateId) {
		let skin = pageHelper.getSkin();
		let cateList = dataHelper.getSelectOptions(skin.NEW_CATE_TWO);

		for (let k in cateList) {
			if (cateList[k].val == cateId) return cateList[k].label;
		}
		return '';
	}


	/** 取得分类 */
	static async getCateList(skin) {
		
		let cateList = dataHelper.getSelectOptions(skin);

		let arr = [];
		for (let k in cateList) {
			arr.push({
				label: cateList[k].label,
				type: 'cateId',
				val: cateList[k].val, //for options
				value: cateList[k].val, //for list
			})
		}
		return arr;
	}

	/** 表单初始化相关数据 */
	static async initFormData(id = '') {
        let skin = pageHelper.getSkin();
		// let cateIdOptions = await AdminNewsBiz.getCateList(skin.NEWS_CATE);
        // let cateIdOptionsTwo = await AdminNewsBiz.getCateList(skin.NEW_CATE_TWO);
        // let cateIdOptionsThree = await AdminNewsBiz.getCateList(skin.NEW_CATE_Three);
		return {
			id,

			// contentDesc: '',

			// 分类----------
			// cateIdOptions,
            // cateIdOptionsTwo,
            // cateIdOptionsThree,
			// 图片数据 
			imgList: [],

            formAdminName:'',  
			// 表单数据 
			formType: 0, //类型 
			// formOrder: 9999,
			formTitle: '',
			formDesc: '',
			// formUrl: '',
			formContent: [],/////////这是什么
            formCateId: '',
            formDaysSet:'',
            
            formTitleRemark:'',
            // formTitleTime:'',时间备注
            formMobile:'',
		}

	}

}


/** 表单校验  本地 */
AdminNewsBiz.CHECK_FORM = {
    // cateIdTwo:'formCateIdTwo|must|id|name=二级街道地址',
	// cateIdThree: 'formCateIdThree|must|id|name=三级单位地址',
	// cateId: 'formCateId|must|id|name=分类',
    desc: 'formDesc|must|string|max:25|name=简介',
    titleRemark:'formTitleRemark|string|max:20|name=备注',
    // titleTime:'formTitleTime|string|max:20|name=时间介绍',
    mobile:'formMobile|string|name=电话',
    adminName:'formAdminName|string|name=发布者账号',
    daysSet:'formDaysSet|must|array|name=开放日期',
};

/** 表单校验  外部 */
AdminNewsBiz.CHECK_FORM_OUT = {
    // cateIdTwo:'formCateIdTwo|must|id|name=二级街道地址',
	// cateIdThree: 'formCateIdThree|must|id|name=三级单位地址',
	// cateId: 'formCateId|must|id|name=分类',
    desc: 'formDesc|must|string|max:25|name=简介',
    titleRemark:'formTitleRemark|string|max:20|name=备注',
    // titleTime:'formTitleTime|string|max:20|name=时间介绍',
    mobile:'formMobile|string|name=电话',
    adminName:'formAdminName|string|name=发布者账号',
    daysSet:'formDaysSet|must|array|name=开放日期',
};

module.exports = AdminNewsBiz;