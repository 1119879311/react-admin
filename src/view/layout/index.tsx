import React, { Component } from "react"
import LayoutMainCpt from "@/component/layout/index"
import { Spin, Alert, Button } from 'antd';
import ajax from "@/api/axios";
import { inject } from "mobx-react";
import {UserStoreClass} from "@/store/userStore"
import { withRouter,RouteComponentProps } from "react-router-dom";

interface IPorps extends  RouteComponentProps {
    UserStore:UserStoreClass
}
//@ts-ignore
@withRouter
@inject("UserStore")
export default class TayouMain extends Component<IPorps>{
    state ={
        toggle:false,
        error:"",
        index:5,
    }
    componentDidMount(){
        // setTimeout(()=>{
        //     this.setState({toggle:true})
        //     console.log("loding finshing。。。")
        // },8000)
        this.getUserInfo()
    }
    getUserInfo(){
        ajax.POST('getManagerRole')
        .then(res=>{
            let {data} = res.data
            let {UserStore} = this.props
            UserStore.setData({user_name:data.name,user_id:data.id,user_type:data.user_type,menus:data.menu,auths:data.auth,roles:data.roles})
            this.setState({toggle:true,error:""})
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
            this.setState({error:`获取用户验证错误:[${err.message}],你可能需要重新登录`||'error:[加载失败,请尝试重新操作]'})
            // let timer = setInterval(()=>{
            //      this.setState((prev:any)=>{
                   
            //         if(prev.index===0){
            //             clearTimeout(timer)
            //             this.props.history.replace("/login")
            //             return null
            //         }
            //         return {index:prev.index-1}
                   
            //      })
                 
            // },1000)
        })
    }
    render(){
        let {toggle,error,index} = this.state
        let {children} = this.props
        return ( toggle? <LayoutMainCpt>{children}</LayoutMainCpt>:
                <Spin tip="loading..." spinning={error===''}>
                    <Alert  message="" description={
                        <><p style={{color:"red",textAlign:"center"}}>{error}</p><br/>
                        <p style={{textAlign:"center"}}>{index}秒后为你自动跳转登录页</p><br/>
                        <div className="m-flex m-center operation-main">
                            <Button type="primary" onClick={()=>this.props.history.replace("/login")}>重新登录</Button>
                            {/* <Button type="primary" onClick={()=>this.getUserInfo()}>重新加载</Button> */}
                        </div> </>
                    } type="info" style={{height:"200px"}} />
                </Spin>
               
         )
    }
}

