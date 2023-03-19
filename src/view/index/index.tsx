import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import {UserStoreClass} from "@/store/userStore"
import "./index.less"
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
           <div className="container-pageList">
               

           </div>
        </div>
    )
    }
}

export default IndexPage