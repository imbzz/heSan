// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'hesan-4gq8nza23c87c325',
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();//另外还有unionId
  return wxContext.OPENID;
}