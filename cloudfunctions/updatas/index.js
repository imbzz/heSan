// 云函数入口文件
const cloud = require('wx-server-sdk')
const Util = require('./utils/time_util.js')
//hesuanofficial-8gp0jtoi3d51cbd9//cloud1-5gde1hoac3a7d47f
cloud.init({
    env: 'hesan-4gq8nza23c87c325',
})

// 云函数入口函数
exports.main = async (event, context) => {
    let db = cloud.database();
    let where = {};
    let Data = await db.collection('ax_news').where(where).get();
    console.log(Data); //对象数组
    let query = Data.data;
    //赋值计算最大值的下标
    try {
        for (let key in query) {
            //有人反馈的情况下
            if (query[key].NEWS_STATUS_ADMIN_REST == 0 && ((query[key].NEWS_STATUS_NOMAL > 1) || (query[key].NEWS_STATUS_BUSY > 1) || (query[key].NEWS_STATUS_CROWDING > 1))) { //没有关闭,在时间之内
                await db.collection('log_status').add({
                    data: {
                        LOG_NAME: query[key].NEWS_DESC,
                        LOG_STATUS_NOMAL: query[key].NEWS_STATUS_NOMAL,
                        LOG_STATUS_BUSY: query[key].NEWS_STATUS_BUSY,
                        LOG_STATUS_CROWDING: query[key].NEWS_STATUS_CROWDING,
                        LOG_TIME: Util.time('Y-M-D h:m:s'),
                    }
                })
                if (query[key].NEWS_STATUS_REST == 1) { //过了时间段归1
                    query[key].NEWS_STATUS_BUSY = 1;
                    query[key].NEWS_STATUS_NOMAL = 1;
                    // query[key].NEWS_STATUS_REST=1;
                    query[key].NEWS_STATUS_CROWDING = 1;
                    query[key].NEWS_ADD_TIME = Util.time();
                    let where = {
                        _id: query[key]._id
                    }
                    let data = {}
                    data['NEWS_STATUS_BUSY'] = query[key].NEWS_STATUS_BUSY;
                    data['NEWS_STATUS_NOMAL'] = query[key].NEWS_STATUS_NOMAL;
                    data['NEWS_STATUS_CROWDING'] = query[key].NEWS_STATUS_CROWDING;
                    data['NEWS_ADD_TIME'] = query[key].NEWS_ADD_TIME;
                    await db.collection('ax_news').where(where).update({
                        data
                    });
                } else { //在时间段内
                    var arr = new Array(4);
                    let IndexMax;
                    arr[1] = query[key].NEWS_STATUS_NOMAL;
                    arr[2] = query[key].NEWS_STATUS_BUSY;
                    arr[3] = query[key].NEWS_STATUS_CROWDING;
                    if (arr[1] == arr[2] && arr[1] == arr[3] && arr[2] == arr[3]) {
                        query[key].NEWS_STATUS_BUSY = 1;
                        query[key].NEWS_STATUS_NOMAL = 1;
                        // query[key].NEWS_STATUS_REST=1;
                        query[key].NEWS_STATUS_CROWDING = 1;
                        query[key].NEWS_STATUS = 2;
                        query[key].NEWS_ADD_TIME = Util.time();
                        let where = {
                            _id: query[key]._id
                        }
                        let data = {}
                        data['NEWS_STATUS_LEVEL']=1;
                        data['NEWS_STATUS'] = query[key].NEWS_STATUS;
                        data['NEWS_STATUS_BUSY'] = query[key].NEWS_STATUS_BUSY;
                        data['NEWS_STATUS_NOMAL'] = query[key].NEWS_STATUS_NOMAL;
                        data['NEWS_STATUS_CROWDING'] = query[key].NEWS_STATUS_CROWDING;
                        data['NEWS_ADD_TIME'] = query[key].NEWS_ADD_TIME;
                        await db.collection('ax_news').where(where).update({
                            data
                        });
                    } else {
                        //最大
                        if (arr[1] > arr[2]) {
                            IndexMax = 1;
                        } else {
                            IndexMax = 2;//2大于或等于1
                        }
                        if (arr[IndexMax] > arr[3]) {//
                            IndexMax = IndexMax;
                        } else{
                            IndexMax=3;
                        }
                        //最大相等 //不会出现了
                        // if (IndexMax == 1 || IndexMax == 3) {
                        //     if (arr[1] == arr[3]) {
                        //         IndexMax = 3;
                        //     }
                        // }
                        query[key].NEWS_STATUS = IndexMax;
                        query[key].NEWS_STATUS_BUSY = 1;
                        query[key].NEWS_STATUS_NOMAL = 1;
                        // query[key].NEWS_STATUS_REST=1;
                        query[key].NEWS_STATUS_CROWDING = 1;
                        query[key].NEWS_ADD_TIME = Util.time();
                        let where = {
                            _id: query[key]._id
                        }
                        let data = {}
                        data['NEWS_STATUS_LEVEL']=1;
                        data['NEWS_STATUS'] = query[key].NEWS_STATUS;
                        data['NEWS_STATUS_BUSY'] = query[key].NEWS_STATUS_BUSY;
                        data['NEWS_STATUS_NOMAL'] = query[key].NEWS_STATUS_NOMAL;
                        data['NEWS_STATUS_CROWDING'] = query[key].NEWS_STATUS_CROWDING;
                        data['NEWS_ADD_TIME'] = query[key].NEWS_ADD_TIME;
                        await db.collection('ax_news').where(where).update({
                            data
                        });
                    }
                } //时间段内,无人反馈的情况下
            } else if (query[key].NEWS_STATUS_ADMIN_REST == 0 && query[key].NEWS_STATUS_REST == 0 && ((query[key].NEWS_STATUS_NOMAL == 1) || (query[key].NEWS_STATUS_BUSY == 1) || (query[key].NEWS_STATUS_CROWDING == 1))) {
                //3 1畅通 2忙碌 3拥挤
                // query[key].NEWS_STATUS = 1;
                //没有定义则初始化
                if(!query[key].NEWS_STATUS_LEVEL){
                    query[key].NEWS_STATUS_LEVEL=1;
                }
                if(query[key].NEWS_STATUS==3){
                    switch(query[key].NEWS_STATUS_LEVEL){
                        case 1:query[key].NEWS_STATUS_LEVEL=4;break;//再保持一次拥挤
                        case 4:query[key].NEWS_STATUS_LEVEL=3;//降级一次
                               query[key].NEWS_STATUS=2;//修改为忙碌
                               break;
                    }
                }else if(query[key].NEWS_STATUS==2){
                    switch(query[key].NEWS_STATUS_LEVEL){
                        case 3: query[key].NEWS_STATUS_LEVEL=2;break;
                        case 2: query[key].NEWS_STATUS_LEVEL=1;
                                query[key].NEWS_STATUS=1;
                                break;
                        case 1: query[key].NEWS_STATUS_LEVEL=3;break;  
                    }
                }else if(query[key].NEWS_STATUS==1){
                    query[key].NEWS_STATUS_LEVEL=1;
                }
                //


                query[key].NEWS_ADD_TIME = Util.time();
                let where = {
                    _id: query[key]._id
                }
                let data = {}
                data['NEWS_STATUS_LEVEL']=query[key].NEWS_STATUS_LEVEL;
                data['NEWS_STATUS'] = query[key].NEWS_STATUS;
                data['NEWS_ADD_TIME'] = query[key].NEWS_ADD_TIME;
                await db.collection('ax_news').where(where).update({
                    data
                });
            }


        }
        // console.log(query);
        // await db.collection('ax_news').where({_pid:'A00'}).remove();
        // for (let k in query) {
        //     let where={_id:query[k]._id}
        //     let data={}
        //     data['NEWS_STATUS']=query[k].NEWS_STATUS;
        //     data['NEWS_STATUS_BUSY']=query[k].NEWS_STATUS_BUSY;
        //     data['NEWS_STATUS_NOMAL']=query[k].NEWS_STATUS_NOMAL;
        //     data['NEWS_STATUS_CROWDING']=query[k].NEWS_STATUS_CROWDING;
        //     data['NEWS_ADD_TIME']=query[k].NEWS_ADD_TIME;
        //     await db.collection('ax_news').where(where).update({
        //         data
        //     });
        // }

    } catch (e) {
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