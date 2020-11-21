export const menuData = [   
  {"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0},
  {"path":"/admin/cms","name":"cms","title":"内容管理","id":5,"pid":0,"children":
      [
          {"path":"/admin/cmsArticle","name":"article","title":"帖子管理","id":6,"pid":5,"children":[]},
          {"path":"/admin/cmsCate","name":"cate","title":"分类管理","id":7,"pid":5,"children":[]},
          {"path":"/admin/cmsTab","name":"tab","title":"标签管理","id":8,"pid":5,"children":[]}
      ]
  },
  {"path":"/admin/rbac","name":"rbac","title":"系统管理","id":1,"pid":0,"children":
      [
          {"path":"/admin/rbacUser","name":"user","title":"管理员","id":2,"pid":1,"children":[]},
          {"path":"/admin/rbacRole","name":"role","title":"角色管理","id":3,"pid":1,"children":[]},
          {"path":"/admin/rbacAuth","name":"auth","title":"权限管理","id":4,"pid":1,"children":[]}
      ],   
  },
  {"path":"/admin/populariz","name":"populariz","title":"推广管理","id":9,"pid":0,"children":
      [
          {"path":"/admin/distribWxnumber","name":"wxnumber","title":"分配微信号","id":10,"pid":9,"children":[]},
      ],   
  },
  
];
// const meunIndex = [{"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0}]