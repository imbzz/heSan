// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-5gde1hoac3a7d47f',
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();//另外还有unionId
  return wxContext.OPENID;
}