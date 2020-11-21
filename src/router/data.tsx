import React from "react";
import { Redirect } from "react-router-dom";
export interface IRouterData {
    name:string
    title:string
    component:any
    path?:string
    exact?:boolean,
    redirect?:boolean
    children?:IRouterData[],
    authName?:string,
    [key:string]:any
}

let NofountRoute:IRouterData = {
    name:"page-error",
    title:"404页面",
    redirect:true,
    isAuth:true,
    component: React.lazy(() => import("@/view/404")), 
}
export const routerData =  [

    {
        name:"login",
        title:"登录",
        path:"/login",
        exact: true,
        component: React.lazy(() => import("@/view/login/login")),
        isNoAuth:true
    },
    {
        name:"admin",
        title:"",
        path:"/admin",
        component: React.lazy(() => import("@/view/layout")),
        children:[
            {
                name:"page-index",
                title:"首页",
                path:"/admin",
                exact: true,
                component: React.lazy(() => import("../view/index/index")),
            },
            {
                name:"page-cmsarticle",
                title:"文章",
                path:"/admin/cmsarticle",
                exact: true,
                component: React.lazy(() => import("../view/cms/article")),
            },
            {
                name:"page-cmsarticlesave",
                title:"保存文章",
                path:"/admin/cmsarticlesave/:id?",
                exact: true,
                component: React.lazy(() => import("../view/cms/article/editAddCpts")),
            },
            {
                name:"page-cmsclassify",
                title:"分类",
                path:"/admin/cmsclassify",
                exact: true,
                component: React.lazy(() => import("../view/cms/classify")),
            },
            {
                name:"page-cmstag",
                title:"标签",
                path:"/admin/cmstag",
                exact: true,
                component: React.lazy(() => import("../view/cms/tag")),
            },
            {
                name:"page-cmsimage",
                title:"图片管理",
                path:"/admin/cmsimage",
                exact: true,
                component: React.lazy(() => import("@/view/cms/images")),
            },
            {
                name:"page-cmsiamgesave",
                title:"上传图片",
                path:"/admin/cmsiamgesave/:id?",
                exact: true,
                component: React.lazy(() => import("@/view/cms/images/editAddCpt")),
            },
            {
                name:"page-rbacuser",
                title:"管理员",
                path:"/admin/rbacUser",
                exact: true,
                component: React.lazy(() => import("@/view/rbac/rbacUser")), 
            },
            {
                name:"page-rbacrole",
                title:"角色管理",
                path:"/admin/rbacrole",
                exact: true,
                component: React.lazy(() => import("@/view/rbac/rbacRole")), 
            },
            {
                name:"page-rbacauth",
                title:"权限管理",
                path:"/admin/rbacauth",
                exact: true,
                component: React.lazy(() => import("@/view/rbac/rbacAuth")), 
            },
            {
                name:"page-message",
                title:"留言管理",
                path:"/admin/message",
                exact: true,
                component: React.lazy(() => import("@/view/message")), 
            },
            {
                name:"page-logistics",
                title:"物流管理",
                path:"/admin/logistics",
                exact: true,
                component: React.lazy(() => import("@/view/logistics")), 
            },
            NofountRoute
            
        ]
    },
    {
        name:"page-az",
        title:"",
        redirect:true,
        path:'/',
        exact: true,
        component:  <Redirect to="/admin"/>, 
    },
    NofountRoute
]