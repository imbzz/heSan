const application = require('./framework/core/application.js');
const  MeetModel=require('./project/model/meet_model.js')
// 云函数入口函数
exports.main = async (event, context) => {
    let result=await application.app(event, context);
	return result;
}