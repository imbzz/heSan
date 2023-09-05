/**
 * Notes: 资讯实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY 1756612361@qq.com
 * Date: 2020-10-28 19:20:00 
 */


const BaseModel = require('./base_model.js');

class NewsModel extends BaseModel {

}

// 集合名
NewsModel.CL = "ax_news";

NewsModel.DB_STRUCTURE = {
	_pid: 'string|true',
	NEWS_ID: 'string|true',
	NEWS_ADMIN_ID: 'string|true',

	// NEWS_TYPE: 'int|true|default=0|comment=类型 0=本地文章，1=外部链接',
	// NEWS_TITLE: 'string|false|comment=标题',
	NEWS_DESC: 'string|false|comment=描述',
	// NEWS_URL: 'string|false|comment=外部链接URL',
    NEWS_STATUS: 'int|true|default=1|comment=状态 0/1/2/3',//0休息/1畅通/2忙碌/3拥挤
    NEWS_ORDER:'int|true|default=9999',//置顶 0为最上面 默认9999

	// NEWS_CATE_ID: 'string|true|comment=分类编号',
    // NEWS_CATE_NAME: 'string|true|comment=分类冗余',
    // NEWS_CATE_ID_TWO: 'string|true|comment=分类编号',
    // NEWS_CATE_NAME_TWO: 'string|true|comment=分类冗余',
    // NEWS_CATE_ID_THREE: 'string|true|comment=分类编号',
	// NEWS_CATE_NAME_THREE: 'string|true|comment=分类冗余',

	// NEWS_CONTENT: 'array|true|default=[]|comment=内容',

	// NEWS_VIEW_CNT: 'int|true|default=0|comment=访问次数',
	// NEWS_FAV_CNT: 'int|true|default=0|comment=收藏人数',
	// NEWS_COMMENT_CNT: 'int|true|default=0|comment=评论数',
	// NEWS_LIKE_CNT: 'int|true|default=0|comment=点赞数',
       NEWS_TITLE_REMARK:'string|true|comment=备注',
    //    NEWS_DAYS_SET: 'array|true|default=[]|comment=最近一次修改保存的可用日期',
    //    NEWS_TITLE_TIME:'string|true|comment=备注时间',
       NEWS_MOBILE:'int|true|comment=电话',
       NEWS_ADMIN_NAME:'string|true|name=发布者账号',
       NEWS_DAYS_SET:'array|true|name=日期选择',

       NEWS_STATUS_CROWDING:'int|true|comment=拥挤反馈数',
       NEWS_STATUS_REST:'int|true|comment=休息反馈数',
       NEWS_STATUS_NOMAL:'int|true|comment=畅通反馈数',
       NEWS_STATUS_BUSY:'int|true|comment=繁忙反馈数',
       NEWS_STATUS_ADMIN_REST:'int|true|comment=管理者关闭',
       NEWS_STATUS_LEVEL:'int|true|comment=场地状态梯度',
       
	// NEWS_PIC: 'array|false|default=[]|comment=附加图片  [cloudId1,cloudId2,cloudId3...]',

	NEWS_ADD_TIME: 'int|true',
	NEWS_EDIT_TIME: 'int|true',
	NEWS_ADD_IP: 'string|false',
	NEWS_EDIT_IP: 'string|false',
};

// 字段前缀
NewsModel.FIELD_PREFIX = "NEWS_";


module.exports = NewsModel;