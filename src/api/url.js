const serverApi = process.env.NODE_ENV ==="production"?"":"";
export let uploadServerHost = serverApi
export let baseUrl = serverApi+"/api";

//1.0登录 
export let adminLogin = `/login`;
export let adminCode = "/code"
// 管理员个人中心
// 1.1 修改密码
export let modifyUserpwd = `/managerCenter/modifypwd`;
export let getManagerRole = `/managerCenter/getManagerRole`;

// 推广管理
export let saveHostPath = `/extension/saveHostPath`;
export let getHostPath = `/extension/getHostPath`;
export let saveWxno = `/extension/saveWxno`;
export let getRadomWxno = `/extension/getRadomWxno`;
export let delWxno = `/extension/delWxno`;

//---------cms
//----cms:article
export let cmsArticle = `/article`; 
export let cmsArticleSave = `/article/save`;
export let cmsArticleSwtich= `/article/modifyStatus`;
export let cmsArticleDel= `/article/delete`;;


//----cms:tab
export let cmsTag = `/tag`;
export let cmsTagSave = `/tag/save`;
// export let cmsTabUpdate = `/tab/update`;
export let cmsTagSwtich = `/tag/modifyStatus`;
export let cmsTagDel = `/tag/delete`;
//----cms:cate
export let cmsClassify = `/classify`;
export let cmsClassifySave = `/classify/save`;
// export let cmsCateUpdate = `/cate/update`;
export let cmsClassifySwtich = `/classify/modifyStatus`;
export let cmsClassifyDel = `/classify/delete`;


//文件上传 
export let uploadAll = `/upload`
// export let uploadArticleUe= `/post/uploadueimg`; 
// export let uploadArticleThum= `/post/uploadThum`; 

// rbac :user
export let rbacUser = `/manager`; //查找用户
export let rbacUserSave=`/manager/save`;//保存用户信息(新增或者编辑)
// export let rbacUserAdd = `/manager/add`; //添加用户
// export let rbacUserUpdate = `/manager/update`; //编辑用户
export let rbacUserSwtich = `/manager/modifyStatus`; //开启/禁用用户状态
export let rbacUserDel = `/manager/delete`; //删除用户
export let rbacUserAssginRole= `/manager/assginRole`; //分配角色
export let rbacUserShowpass= `/manager/showpass`;//查看密码




// rbac:role 
export let rbacRole = `/role`;
export let rbacRoleSave =`/role/save`
// export let rbacRoleAdd = `/role/add`;
// export let rbacRoleUpdate = `/role/update`;
export let rbacRoleSwtich = `/role/modifyStatus`;
export let rbacTasksAuthority = `/role/tasksAuthority`;
export let rbacrRoleAssginMenu = `/role/assginMenu`;
export let rbacRoleDelete = `/role/delete`;


// rbac:auth
export let rbacAuth = `/authority`;
export let rbacAuthSave = `/authority/save`
// export let rbacAuthAdd = `/authority/add`;
// export let rbacAuthUpdate = `/authority/update`;
export let rbacAuthSwtich = `/authority/modifyStatus`;
export let rbacAuthDel = `/authority/delete`;

// rbac:menu
export let rbacMenu = `/menu`;
export let rbacMenuAdd = `/menu/add`;
export let rbacMenuUpdate = `/menu/update`;
export let rbacMenuDel = `/menu/delete`;

// 管理日志
//  1.登录日志
export let logsLogin = `/logslogin`;


// 资源管理模块

// 句子管理
export let resourcejuzi = `/juzi`;
export let juziAdd = `/juzi/add`;
export let juziUpdate = `/juzi/update`;
export let juziSwtich = `/juzi/swtich`;
export let juziDel = `/juzi/delete`;

// 云盘资源
export let cloudresources = `/cloudresources`;
export let cloudresAdd = `/cloudresources/add`;
export let cloudresUpdate = `/cloudresources/update`;
export let cloudresSwtich = `/cloudresources/swtich`;
export let cloudresDel = `/cloudresources/delete`;


// 微信管理模块

// 公众号关键词回复
export let keywordsReply = `/keywordsReply`;
export let keywordsReplyAdd = `/keywordsReply/add`;
export let keywordsReplyUpdate = `/keywordsReply/update`;
export let keywordsReplySwtich = `/keywordsReply/swtich`;
export let keywordsReplyDel = `/keywordsReply/delete`;


// 留言模块

export let message = `/message`;
export let messageExportExce=`message/exportExce`

//图片管理模块

export let cmsImages = `/images`;
export let cmsImagesSave = `/images/save`;
export let cmsImagesSwtich= `/images/modifyStatus`;
export let cmsImagesDel= `/images/delete`;