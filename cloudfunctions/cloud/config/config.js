module.exports = {
    
    CLOUD_ID_LIST:['hesuanofficial-8gp0jtoi3d51cbd9','hesan-4gq8nza23c87c325'],
	//### 环境相关 
	CLOUD_ID: 'hesan-4gq8nza23c87c325', //你的云环境id 

	ADMIN_NAME: 'admin', // 管理员账号（5-30位)
    ADMIN_PWD: '123456', // 管理员密码（5-30位) 
    // '全部学院', '经济与统计学院', '法学院', '教育学院', '体育学院', '人文学院', '外国语学院', '新闻与传播学院', '中法旅游学院', '公共管理学院', '音乐舞蹈学院', '美术与设计学院', '数学与信息科学学院', '物理与材料科学学院', '化学化工学院', '地理科学与遥感学院', '生命科学学院', '机械与电气工程学院','马克思主义学院','电子与通信工程学院', '计算机科学与网络工程学院', '建筑与城市规划学院', '土木工程学院', '环境科学与工程学院', '网络空间安全学院', '国际教育学院', '教师培训学院'对应的登录密码为@前的字符串  
    //所有的管理者账号都为 admin
    // @号前为密码 
    // 下列字符串夹着的 1和 2分别代码
    // SUPER_ADMIN_LIST:[{ADMIN_NAME:'admin',ADMIN_PWD:['#929ZHZ@1','123333@1','ZXH000@1','10241024@1','JSJ1024@1','academy_jt@2@经济与统计学院','academy_f@2@法学院','academy_jy@2@教育学院','academy_ty@2体育学院','academy_rw@2@人文学院','academy_wgy@2@外国语学院','academy_xc@2@新闻与传播学院','academy_gl@2@管理学院(中法旅游学院)','academy_gg@2@公共管理学院','academy_yw@2@音乐舞蹈学院','academy_ms@2@美术与设计学院','academy_sx@2@数学与信息科学学院','academy_wl@2@物理与材料科学学院','academy_hg@2@化学化工学院','academy_dl@2@地理科学与遥感学院','academy_sk@2@生命科学学院','academy_mks@2@马克思主义学院','academy_jd@2@机械与电气工程学院','academy_dx@2@电子与通信工程学院','academy_jw@2@计算机科学与网络工程学院','academy_jz@2@建筑与城市规划学院','academy_tm@2@土木工程学院','academy_hj@2@环境科学与工程学院','academy_wa@2@网络空间安全学院','academy_gj@2@国际教育学院','academy_js@2@教师培训学院','academy_all@2@全部']},{ADMIN_NAEM:'admin1',ADMIN_PWD:['123456','123458','123359']}],
    SUPER_ADMIN_LIST:[{ADMIN_NAME:'admin',ADMIN_PWD:['#929ZHZ@1','123333@1','ZXH000@1','10241024@1','JSJ1024@1','academy_jt@2@经济与统计学院','academy_f@2@法学院','academy_jy@2@教育学院','academy_ty@2体育学院','academy_rw@2@人文学院','academy_wgy@2@外国语学院','academy_xc@2@新闻与传播学院','academy_gl@2@管理学院(中法旅游学院)','academy_gg@2@公共管理学院','academy_yw@2@音乐舞蹈学院','academy_ms@2@美术与设计学院','academy_sx@2@数学与信息科学学院','academy_wl@2@物理与材料科学学院','academy_hg@2@化学化工学院','academy_dl@2@地理科学与遥感学院','academy_sk@2@生命科学学院','academy_mks@2@马克思主义学院','academy_jd@2@机械与电气工程学院','academy_dx@2@电子与通信工程学院','academy_jw@2@计算机科学与网络工程学院','academy_jz@2@建筑与城市规划学院','academy_tm@2@土木工程学院','academy_hj@2@环境科学与工程学院','academy_wa@2@网络空间安全学院','academy_gj@2@国际教育学院','academy_js@2@教师培训学院','academy_all@2@全部']},{ADMIN_NAEM:'admin1',ADMIN_PWD:['123456','123458','123359']}],
	// ##################################################################  
	PID: 'A00',  
	IS_DEMO: false,  

	NEWS_CATE: '1=场馆动态,2=运动常识',
	MEET_TYPE: '1=羽毛球场预约,2=足球场预约,3=篮球场预约,4=乒乓球预约,5=网球场预约,6=游泳馆预约,7=健身房预约',
	// ##################################################################
	// #### 调试相关 
	TEST_MODE: false,  
	TEST_TOKEN_ID: '',

	COLLECTION_NAME: 'ax_admin|ax_cache|ax_day|ax_export|ax_join|ax_log|ax_meet|ax_news|ax_setup|ax_temp|ax_user',

	DATA_EXPORT_PATH: 'export/', //数据导出路径
	MEET_TIMEMARK_QR_PATH: 'meet/usercheckin/', //用户签到码路径 
	SETUP_PATH: 'setup/',

	// ## 缓存相关 
	IS_CACHE: true, //是否开启缓存
	CACHE_CALENDAR_TIME: 60 * 30, //日历缓存   

	// #### 内容安全
	CLIENT_CHECK_CONTENT: false, //前台图片文字是否校验
	ADMIN_CHECK_CONTENT: false, //后台图片文字是否校验    

	// #### 预约相关
	MEET_LOG_LEVEL: 'debug',

	// ### 后台业务相关
    ADMIN_LOGIN_EXPIRE: 86400*100, //管理员token过期时间 (秒) 
   
    //### 学生文件存储路径
    FILE_ADMIN_STUDENT:'admin/studentFile/',

    //### 学院名字字符表
    collegeList:{
        admin:{
            经济与统计学院:'academy_jt',
            法学院:'academy_f',
            教育学院:'academy_jy',
            体育学院:'academy_ty',
            人文学院:'academy_rw',
            外国语学院:'academy_wgy',
            新闻与传播学院:'academy_xc',
            管理学院:'academy_gl',
            公共管理学院:'academy_gg',
            音乐舞蹈学院:'academy_yw',
            美术与设计学院:'academy_ms',
            数学与信息科学学院:'academy_sx',
            物理与材料学院:'academy_wl',
            化学化工学院:'academy_hg',
            地理科学与遥感学院:'academy_dl',
            生命科学学院:'academy_sk',
            机械与电气学院:'academy_jd',
            电子与通信学院:'academy_dx',
            计算机科学与网络工程学院:'academy_jw',
            建筑与城市规划学院:'academy_jz',
            土木工程学院:'academy_tm',
            环境科学与工程学院:'academy_hj',
            网络空间安全学院:'academy_wa',
            国际教育学院:'academy_gj',
            教师培训学院学院:'academy_js',
        }

        
    }
}