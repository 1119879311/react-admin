import React from "react"
import { Redirect, Route, RouteProps } from "react-router-dom";
import UserStore from "@/store/userStore"
import { observer } from "mobx-react";
// import CacheRoute from 'react-router-cache-route'
import  NoFoundCpt from "@/view/404"
interface Iprops extends RouteProps {
    [key:string]:any
}
//路由权限拦截
const PrivateRoute=(props:Iprops)=>{
    let {children} = props
    let {token,user_type,auths={}} = UserStore.userData
    let authname=props['name']
    let isAuth = user_type===1||(auths as any)[authname];
    if(!token){
        return <Redirect to="/login"/>
    }
    return isAuth?<Route {...props} >{children}</Route>:<Route render={()=><NoFoundCpt/>}/>
}

export default observer(PrivateRoute)
