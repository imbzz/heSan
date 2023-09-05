// 云函数入口文件
const cloud = require('wx-server-sdk');
const dbHelper = require('./db_util.js');

// CLOUD_ID_LIST:['hesuanofficial-8gp0jtoi3d51cbd9','cloud1-5gde1hoac3a7d47f'],
cloud.init({///这个函数还有一个文件要改云环境
    env:'hesan-4gq8nza23c87c325',
})

// 云函数入口函数
exports.main = async (event, context) => {
    let db=cloud.database();
        let where={
            STUDENTS_STATUS:'1',
        };
        let Data =await dbHelper.getAllBig('ax_admin_students',where);
        console.log(Data);//对象数组
        let removeNumber = await db.collection('ax_admin_students').where(where).remove();
       console.log(removeNumber);
        let query=Data;
        try{
            for(let k in query){
                if(query[k].STUDENTS_STATUS=='1'){
                    query[k].STUDENTS_STATUS='0';
                }
            }
            let reNew = await db.collection('ax_admin_students').add({
                data:query,
            })
            return {
                event,
                reNew,
            }
        }catch(e){
            console.log(e);
        }
   
}