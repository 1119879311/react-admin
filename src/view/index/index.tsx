import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import {UserStoreClass} from "@/store/userStore"
interface IPorps{
    UserStore:UserStoreClass
}
@inject("UserStore")
@observer
class IndexPage extends Component<IPorps>{
    render(){
        let {userData} = this.props.UserStore
    return (
        <div  className="m-flex m-center m-column">
            <h2>欢迎使用后台管理系统</h2>
            <h3>当前用户：{userData.user_name}</h3>
        </div>
    )
    }
}

export default IndexPage