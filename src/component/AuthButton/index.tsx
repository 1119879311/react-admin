import { Button } from "antd"
import React from "react"
import UserStore from "@/store/userStore"
import { observer } from "mobx-react"
import { ButtonProps } from "antd/lib/button"

interface Iprops extends ButtonProps{
    authname?:string,
    mydisabled?:boolean
}
const AuthButton = (props:Iprops)=>{
    let {authname} = props
    if(!authname) return <Button {...props}>{props.children}</Button>
    let {user_type,auths={}} =  UserStore.userData
    let isAuth = user_type===1||(auths as any)[authname];
    return  isAuth?<Button {...props}>{props.children}</Button>
    :<Button {...props} disabled={true}>{props.children}</Button>
}

export default observer(AuthButton)