// 云函数入口文件
const cloud = require('wx-server-sdk')
const Util =require('./utils/time_util.js')

cloud.init({
    env:'cloud1-5gde1hoac3a7d47f',
})

// 云函数入口函数
exports.main = async (event, context) => {
        let db=cloud.database();
        let where={};
        let Data =await db.collection('ax_news').limit(100).where(where).get();
        console.log(Data);//对象数组
        let query=Data.data;
        //赋值计算最大值的下标
        try{
            for(let key in query){
                await db.collection('log_status').add({
                    data:{
                        LOG_NAME:query[key].NEWS_DESC,
                        LOG_STATUS_NOMAL:query[key].NEWS_STATUS_NOMAL,
                        LOG_STATUS_BUSY:query[key].NEWS_STATUS_BUSY,
                        LOG_STATUS_CROWDING:query[key].NEWS_STATUS_CROWDING,
                        LOG_TIME:Util.time('Y-M-D h:m:s'),
                    }
                })
                if(query[key].NEWS_STATUS_ADMIN_REST==0&&((query[key].NEWS_STATUS_NOMAL>7)||(NEWS_STATUS_BUSY>7)||(NEWS_STATUS_CROWDING>7))){
                    if(query[key].NEWS_STATUS==0){
                        query[key].NEWS_STATUS_BUSY=1;
                        query[key].NEWS_STATUS_NOMAL=1;
                        // query[key].NEWS_STATUS_REST=1;
                        query[key].NEWS_STATUS_CROWDING=1;
                    }else{
                        var arr =new Array(4);
                        let IndexMax;
                        arr[1]=query[key].NEWS_STATUS_NOMAL;
                        arr[2]= query[key].NEWS_STATUS_BUSY;
                        arr[3]=query[key].NEWS_STATUS_CROWDING;
                        if(arr[1]==arr[2]&&arr[1]==arr[3]&&arr[2]==arr[3]){
                            break;
                        }else{
                            //最大
                            if(arr[1]>=arr[2]){
                                IndexMax=1;
                            }else{
                                IndexMax=2;
                            }
                            if(arr[IndexMax]>=arr[3]){
                            IndexMax=IndexMax;
                            }else{
                                IndexMax=3;
                            }
                            //最大相等
                            if(IndexMax==1&&IndexMax==3){
                                if(arr[1]==arr[3]){
                                    IndexMax=1;
                                }
                            }
                        }
                        query[key].NEWS_STATUS=IndexMax;
                        query[key].NEWS_STATUS_BUSY=1;
                        query[key].NEWS_STATUS_NOMAL=1;
                        // query[key].NEWS_STATUS_REST=1;
                        query[key].NEWS_STATUS_CROWDING=1;
                    }
                }
                
                query[key].NEWS_ADD_TIME=Util.time();
            }
                    console.log(query);
                    // await db.collection('ax_news').where({_pid:'A00'}).remove();
                    for (let k in query) {
                        let where={_id:query[k]._id}
                        let data={}
                        data['NEWS_STATUS']=query[k].NEWS_STATUS;
                        data['NEWS_STATUS_BUSY']=query[k].NEWS_STATUS_BUSY;
                        data['NEWS_STATUS_NOMAL']=query[k].NEWS_STATUS_NOMAL;
                        data['NEWS_STATUS_CROWDING']=query[k].NEWS_STATUS_CROWDING;
                        data['NEWS_ADD_TIME']=query[k].NEWS_ADD_TIME;
                        await db.collection('ax_news').where(where).update({
                            data
                        });
                    }
        
        }catch(e){
            console.log(e);
        }


    //对比status
    //删除所有数据
    //重新赋值
    
    return {
        event,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
    }
}