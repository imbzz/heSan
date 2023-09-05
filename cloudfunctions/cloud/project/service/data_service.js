/**
 * Notes: 各种数据操作业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2021-03-01 07:48:00 
 */

const BaseService = require('./base_service.js');
const cloudBase = require('../../framework/cloud/cloud_base.js');
const cloudUtil = require('../../framework/cloud/cloud_util.js');
const ExportModel = require('../model/export_model.js');
const uploadModel = require('../model/uploadFile_model.js');
const timeUtil = require('../../framework/utils/time_util');
const md5Lib = require('../../framework/lib/md5_lib.js');
const config = require('../../config/config.js');
const adminModel = require('../model/admin_students_model.js');
const dataUtil = require('../../framework/utils/data_util.js');



const cloud = cloudBase.getCloud();
const db = cloud.database();

class DataService extends BaseService {

/**
 *  //检测文件是否合法(待优化)
    // if (isCheck) {
    //     wx.showLoading({
    //         title: '文件检测中',
    //         mask: true
    //     });
    //     let check = await contentCheckHelper.imgCheck(img);
    //     if (!check) {
    //         wx.hideLoading();
    //         return pageHelper.showModal('不合适的图片, 请重新上传', '温馨提示');
    //     }
    //     wx.hideLoading();
    // }
  * 单个文件上传到云空间
  * @param {*} file 本地路径
  * @param {*} dir 路径前缀
  * @param {*} key  唯一标识(此处用账号+学院字符(待定))
  * @return 返回cloudId
  * 
  */
 async transTempFileOne(file, dir, key) {
////
    let filePath = file;
    let ext = filePath.match(/\.[^.]+?$/)[0];//match函数干嘛

    // 是否为临时文件
    if (filePath.includes('tmp') || filePath.includes('temp') || filePath.includes('wxfile')) {
        let rd = dataUtil.genRandomNum(100000, 999999);
        const cloud = cloudBase.getCloud();
       let upload =  await cloud.uploadFile({
            cloudPath: key ? dir + key + '/' + rd + ext : dir + rd + ext,//云存储路径
            filePath: filePath, // 文件本地路径
        });
        if (!upload || !upload.fileID) return;
        let dataUpload = {
            UPLOAD_KEY:key,
            UPLOAD_CLOUD_ID:upload.fileID,
        }
        return {
            dataUpload,
            cloudUrl:upload.fileID,
        }
    }else{
        this.AppError('文件路径错误');
    }
////
}
 
// 导出数据  
async exportDataExcel(key, title, total, data, options = {}) {
    // 删除导出表
    let whereExport = {
        EXPORT_KEY: key
    }
    await ExportModel.del(whereExport);

    let fileName = key + '_' + md5Lib.md5(key + config.CLOUD_ID + this.getProjectId());
    let xlsPath = config.DATA_EXPORT_PATH + fileName + '.xlsx';

    // 操作excel用的类库
    const xlsx = require('node-xlsx');
try{
    // 把数据保存到excel里
    var buffer = await xlsx.build([{
        name: title + timeUtil.timestamp2Time(this._timestamp, 'Y-M-D'),
        data,
    }]);
}catch(e){
    console.log(e);
}

    // 把excel文件保存到云存储里
    console.log('[ExportData]  Save to ' + xlsPath);
    const cloud = cloudBase.getCloud();
    let upload;
    try{
        upload = await cloud.uploadFile({
            cloudPath: xlsPath,
            fileContent: buffer, //excel二进制文件
        });
    
    if (!upload || !upload.fileID) return;
}catch(e){
    console.log(e);
}

    // 入导出表 
    let dataExport = {
        EXPORT_KEY: key,
        EXPORT_CLOUD_ID: upload.fileID
    }
    await ExportModel.insert(dataExport);

    console.log('[ExportData]  OVER.')

    return {
        total,
        dataExport
    }
}
    //递归循环插入数据
    async addAllStudents2Database(i,files,collectionName,adminId,college,time){
        
        //STUDENTS_KEY:'string|true',
    // STUDENTS_COLLEGE:'string|true|comment=学院',
    // STUDENTS_ORDER:'string|true|comment=序号',
    // STUDENTS_GRADE:'string|true|comment=年级',-----
    // STUDENTS_NAME:'string|true|comment=名字',-----
    // STUDENTS_CLASS:'string|true|comment=班级',-----
    // STUDENTS_NUMBER:'string|true|comment=学号',-----
    // STUDENTS_STATUS:'string|true|comment=是否完成核酸',
    //STUDNETS_KIND:'string|true|comment=人员分类',
    //STUDENTS_ETHNIC_MINORITY:'string|true|comment=少数民族生',----
    //STUDENTS_HONGKONG:'string|true|comment=港澳台生',-----
    let dataList =[];
    let length=files[0].data.length;
    for(let j=i;j<files[0].data.length;j++){
        let ETHNIC_MINORITY='';
        let HONGKONG='';
        if(files[0].data[j][7]=='是'){
            ETHNIC_MINORITY=files[0].data[1][7];
        }
        if(files[0].data[j][8]=='是'){
            HONGKONG=files[0].data[1][8];
        }
        let object ={//搜索关键字
            STUDENTS_TITLE:files[0].data[j][2]+files[0].data[j][4]+files[0].data[j][3]+files[0].data[j][5]+ETHNIC_MINORITY+HONGKONG,
            STUDENTS_ORDER:files[0].data[j][0],
            STUDENTS_COLLEGE:files[0].data[j][1],
            STUDENTS_GRADE:files[0].data[j][2],
            STUDENTS_NAME:files[0].data[j][3],
            STUDENTS_CLASS:files[0].data[j][4],
            STUDENTS_NUMBER:(files[0].data[j][5]).toString(),
            STUDENTS_KIND:files[0].data[j][6],
            STUDENTS_ETHNIC_MINORITY:files[0].data[j][7],
            STUDENTS_HONGKONG:files[0].data[j][8],
            STUDENTS_IFOPEN:'1',
            _pid:'A00',
            STUDENTS_STATUS:'0',
            STUDENTS_KEY:adminId+college,
            STUDENTS_ADD_TIME:time,
            STUDENTS_EDIT_TIME:time,
        }
        dataList.push(object);
    }
    try{
        
        let success=await db.collection(collectionName).add({
            data:dataList,
        })
        if(success){
            let sumNumber =length;
            return sumNumber;
        }
    }catch(e){
        console.log(e);
    }
   





    // let k=0;
    // let j=0;
    // for(let g=0;g<2;g++){
    //     for(j=i;j<files[0].data.length;j++){
    //         if(!db.cloudBase(collectionName).where({STUDENTS_NAME:files[0].data[j][3]}).get()){
    //              db.collection(collectionName).add({
    //                 data:{
    //                 STUDENTS_ORDER:files[0].data[j][0],
    //                 STUDENTS_COLLEGE:files[0].data[j][1],
    //                 STUDENTS_GRADE:files[0].data[j][2],
    //                 STUDENTS_NAME:files[0].data[j][3],
    //                 STUDENTS_CLASS:files[0].data[j][4],
    //                 STUDENTS_NUMBER:files[0].data[j][5],
    //                 STUDNETS_KIND:files[0].data[j][6],
    //                 STUDENTS_ETHNIC_MINORITY:files[0].data[j][7],
    //                 STUDENTS_HONGKONG:files[0].data[j][8],
    //                 STUDENTS_KEY:adminId+college,
    //                 STUDENTS_EDIT_TIME:time,
    //                 }
    //             })
    //             k++;
    //         }
    //     }
    //     if(k==files[0].data.length){
    //         let studentSum =files[0].data.length;
    //         return studentSum;
    //     }else{
    //         let studentSum=k;
    //         return studentSum;
    //     }
    // }    










        // db.collection(collectionName).add({
        //     data:{
        //     STUDENTS_ORDER:files[0].data[i][0],
        //     STUDENTS_COLLEGE:files[0].data[i][1],
        //     STUDENTS_GRADE:files[0].data[i][2],
        //     STUDENTS_NAME:files[0].data[i][3],
        //     STUDENTS_CLASS:files[0].data[i][4],
        //     STUDENTS_NUMBER:files[0].data[i][5],
        //     STUDENTS_STATUS:0,
        //     STUDENTS_KEY:adminId+college,
        //     STUDENTS_EDIT_TIME:time,
        //     }
        //     }).then(res=>{
        //         i++
        //         if(i==files[0].data.length){
        //         //循环结束删除上传的文件不占用云存储
        //             let studentSum =files[0].data.length;
        //             return studentSum;
        //         }else{
        //             addAllStudents2Database(i,files,collectionName,adminId,college);
        //         }
        //     })
    }




    //把excel学生信息加入数据集
    async addStudentInfo2Database(adminId,college,FileID){
    var xlsx = require('node-xlsx');
    const cloud = cloudBase.getCloud();
        //1,通过fileID下载云存储里的excel文件
    const res = await cloud.downloadFile({
        fileID: FileID,
    })
    console.log('下载的文件',res);
    const file_xlsx = res.fileContent
    //2,解析excel文件里的数据
    var files = xlsx.parse(file_xlsx); //获取到已经解析的对象数组（下面我会出返回的代码结构，以及我的excel文件内容）
   console.log('获得内容表格数组',files[0].data); //files[0].data学院名数组（以上直接复制即可）

   try{
       let Model;
       switch(adminId){
           case 'admin':Model =adminModel;break;
       }
       let time = timeUtil.time();
       let result= await this.addAllStudents2Database(2,files,Model.CL,adminId,college,time);
       console.log(result);
       if(result){
           //插入数据:
           let data ={
            UPLOAD_SUM_NUMBER:result,
           }
           // 取出数据
		let whereExport = {
			UPLOAD_KEY: adminId+college
        }
        await uploadModel.edit(whereExport,data);

		let oldUrl = '';
		let time = '';
		let uploadData = await uploadModel.getOne(whereExport, 'UPLOAD_CLOUD_ID,UPLOAD_EDIT_TIME');
		if (!uploadData)
            oldUrl = '';
		else {
			oldUrl = uploadData.UPLOAD_CLOUD_ID;
			oldUrl = await cloudUtil.getTempFileURLOne(oldUrl) + '?rd=' + this._timestamp;
			time = timeUtil.timestamp2Time(uploadData.UPLOAD_EDIT_TIME);//毫秒转时间格式
		}
        let sumNumber =result;
		return {
			oldUrl,
            time,
            sumNumber
		}
       }
   }catch(e){
       console.log(e);
   }
}

    /**
     * 删除原学生云储存文件(上传的文件)
     * @param {*} key 
     */
    async deleteUploadFILE(key){
        let whereUpload={
            UPLOAD_KEY:key,
        }
        //获取云存储路径
        let result = await uploadModel.getOne(whereUpload,'UPLOAD_CLOUD_ID');
        if(!result)return;
        let filePath = result.UPLOAD_CLOUD_ID;
        console.log('[deleteFile]  path = ' + filePath);

        const cloud = cloudBase.getCloud();
        //用云路径删除存储
		await cloud.deleteFile({
			fileList: [filePath],
		}).then(async res => {
			console.log(res.fileList);
			if (res.fileList && res.fileList[0] && res.fileList[0].status == -503003) {
				console.log('[deleteUserExcel]  ERROR = ', res.fileList[0].status + ' >> ' + res.fileList[0].errMsg);
				this.AppError('文件不存在或者已经删除');
			}

			// 删除数据集的文件路径
			await uploadModel.del(whereUpload);

			console.log('[deleteExcel]  OVER.');

		}).catch(error => {
			if (error.name != 'AppError') {
				console.log('[deleteExcel]  ERROR = ', error);
				this.AppError('操作失败，请重新删除');
			} else
				throw error;
		});
    }
     /**
      * 
      * @param {*} key 文件名在数据库的查找条件(文件的各种路径会存到数据库表里面)
      */
    async getUploadDataURL(key){
        let whereUpload = {
            UPLOAD_KEY:key,
        }
        let oldUrl = '';
        let cloudUrl='';
        let time = '';
        let sumNumber=0;
        let uplData = await uploadModel.getOne(whereUpload,'UPLOAD_CLOUD_ID,UPLOAD_EDIT_TIME,UPLOAD_SUM_NUMBER');
        if(uplData){
            cloudUrl=uplData.UPLOAD_CLOUD_ID;
            oldUrl =uplData.UPLOAD_CLOUD_ID;
            oldUrl=await cloudUtil.getTempFileURLOne(oldUrl)+'?rd='+this._timestamp;
            time = timeUtil.timestamp2Time(uplData.UPLOAD_EDIT_TIME);//毫秒转时间格式
            sumNumber =uplData.UPLOAD_SUM_NUMBER;
        }
        return{
            oldUrl,
            cloudUrl,
            time,
            sumNumber,
        }
    }
	// 获得当前导出链接
	async getExportDataURL(key) {
		// 取出数据
		let whereExport = {
			EXPORT_KEY: key
		}

		let url = '';
		let time = '';
		let expData = await ExportModel.getOne(whereExport, 'EXPORT_CLOUD_ID,EXPORT_EDIT_TIME');
		if (!expData)
			url = '';
		else {
			url = expData.EXPORT_CLOUD_ID;
			url = await cloudUtil.getTempFileURLOne(url) + '?rd=' + this._timestamp;
			time = timeUtil.timestamp2Time(expData.EXPORT_EDIT_TIME);//毫秒转时间格式
		}

		return {
			url,
			time
		}
	}

	// 删除数据文件 数据库拿云路径字符
	async deleteDataExcel({
        adminId,
        college,
        openid,
    }) {
		console.log('[deleteExcel]  BEGIN... , key=' +adminId+college+openid)

		// 取出数据
		let whereExport = {
			EXPORT_KEY: adminId+college+openid
		}
		let expData = await ExportModel.getOne(whereExport);
		if (!expData) return;

		// 文件路径
		let xlsPath = expData.EXPORT_CLOUD_ID;

		console.log('[deleteExcel]  path = ' + xlsPath);

        const cloud = cloudBase.getCloud();
        //用云路径删除存储
		await cloud.deleteFile({
			fileList: [xlsPath],
		}).then(async res => {
			console.log(res.fileList);
			if (res.fileList && res.fileList[0] && res.fileList[0].status == -503003) {
				console.log('[deleteUserExcel]  ERROR = ', res.fileList[0].status + ' >> ' + res.fileList[0].errMsg);
				this.AppError('文件不存在或者已经删除');
			}

			// 删除数据集的文件路径
			await ExportModel.del(whereExport);

			console.log('[deleteExcel]  OVER.');

		}).catch(error => {
			if (error.name != 'AppError') {
				console.log('[deleteExcel]  ERROR = ', error);
				this.AppError('操作失败，请重新删除');
			} else
				throw error;
		});


	}

	
}

module.exports = DataService;