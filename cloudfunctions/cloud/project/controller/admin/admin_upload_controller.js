/**
 * Notes: 上传模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2022-01-15 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');
const AdminUploadService = require('../../service/admin/admin_upload_service.js');
const config = require('../../../config/config.js');

class AdminUploadController extends BaseAdminController {
/////////////////////////图片文件等数据上传


/**
 * 学生上报
 */
async studentFinishSubmit(){
    //不用验证管理者
    let rules ={
        studentNumber:'string|must',
        adminId:'string|must',
        openid:'string|must',
    }
    let input =this.validateData(rules);
    let service = new AdminUploadService();
    return await service.studentFinishSubmit(input);
}


/**
 * 拉取文件,将学生数据插入数据集
 */
   async addStudentInfo2Database(){
       await this.isAdmin();

       //数据校验
       let rules = {
           cloudUrl:'string|must',
           adminId:'string|must',
           college:'string|must',
       }
       //获取对应的数据模型
       let input =this.validateData(rules);
       let service = new AdminUploadService();
       return await service.addStudentInfo2Database(input.adminId,input.college,input.cloudUrl);
       //插入数据
   }



/** 有文件上传成功后 返回网络路径 云存储路径*/
async FileDataGet() {
    await this.isAdmin();

    // 数据校验
    let rules = {
        // isDel: 'int|must', //是否删除已有记录
        adminId:'string|must',
        college:'string|must',
    };

    // 取得数据
    let input = this.validateData(rules);
    //此处查表获取college的对应的字符值
    let service = new AdminUploadService();
    return await service.getStudentDataURL(input.adminId+input.college);//返回 url,cloudUrl,time,
}

/**
 * 文件上传
 */
   async uploadStudentFile(){
    await this.isAdmin();
   // 数据校验
		let rules = { //是否删除已有记录
            adminId:'string|must',
            college:'string|must',
            cloudUrl:'string|must',
            // oldUrl:'string',
		};

		// 取得数据
		let input = this.validateData(rules);
		let service = new AdminUploadService();

		// if (input.oldUrl)
        //     await service.deleteStudentFile(input);
            //load存储已删
            //先删除数据库的学生数据条(adminId+college),文件,
            //删除文件数据条
        return await service.uploadStudentFile(input);//上传文件到云存储,更新文件数据条到load,不处理数据库人员情况
        //返回 uploadE
   }
    /**
     * 删除此账号+学院对应的文件,学生数据,文件信息记录条
     */
    async DeleteStudentFile(){
        await this.isAdmin();
        let rules={
            adminId:'string|must',
            college:'string|must',
        }
        let input = this.validateData(rules);
        let service = new AdminUploadService();
        return await service.deleteStudentFile(input); //先删除
    }
     
}

module.exports = AdminUploadController;