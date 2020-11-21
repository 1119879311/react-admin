import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import { Link} from "react-router-dom"
import {UserStoreClass} from "@/store/userStore"
// import AuthButton from "@/component/AuthButton"
// import  ParentToChild from "@/axample/parentToChild"
// import ReactContext from "@/axample/reactContext"

// import AppReducer from "@/axample/useReducer"
import  { getCachingKeys,clearCache } from 'react-router-cache-route'
interface IPorps{
    UserStore:UserStoreClass
}

@inject("UserStore")
@observer
class IndexPage extends Component<IPorps>{
    
    // 获取缓存key
    getCatchPage = ()=>{
        console.log(getCachingKeys())
    }
    clearCache=()=>{
        clearCache();
    }
    render(){
        let {userData} = this.props.UserStore
    return (
        <div>
            {/* <AuthButton authname="edituser" type="primary" onClick={this.getCatchPage}>获取页面缓存key</AuthButton>
            <AuthButton authname="edituser" type="primary" onClick={this.clearCache}>清除页面缓存</AuthButton> */}
            <Link to="/login">当前用户：{userData.user_name}</Link>
            
            {/* <ParentToChild/>
            <ReactContext/>
            <AppReducer></AppReducer> */}
        </div>
    )
    }
}

export default IndexPage