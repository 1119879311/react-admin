import React, { useState } from "react"
import { Avatar, Button, Dropdown, Menu, Modal } from 'antd';
import {  observer } from "mobx-react";
import UserStore from "@/store/userStore";
import { SyncOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import ModifyPwdCpt from "./modifypwdCpt";
import "./index.css"
const {confirm} = Modal 
function getUsertypeText(type?: number) {
    if (type === 1) {
        return "超级用户"
    } else if (type === 2) {
        return "系统用户"
    } else {
        return "普通用户"
    }
}

const HeaderCpt = () => {
    let [modelHide, setModelHide] = useState(false)
    const history = useHistory();
    let { userData } =UserStore
    const loginOut = () => {
        confirm({
            title: '你确定退出登录吗?',
            okText: '确定',
            cancelText: '取消',
            onOk:()=> {
              history.replace("/login")  
              },
            onCancel() {
              console.log('Cancel');
            },
          });
       
    }
    return <div className="layout-header-content">
        <div style={{fontSize:20}}>后台管理系统</div>
        <div className="header-right">
            <Button type="primary" onClick={() => window.location.reload()} icon={<SyncOutlined />}>刷新页面</Button>
            <div>用户类型：  {getUsertypeText(userData.user_type)}  </div>
            <div>用户名： {userData.user_name} </div>
            <div>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item onClick={() => loginOut()}>退出登陆</Menu.Item>
                        <Menu.Item onClick={() => setModelHide(true)}>修改密码</Menu.Item>
                    </Menu>
                }>
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </Dropdown>
            </div>
        </div>
        <ModifyPwdCpt modelLoading={modelHide} submitCallback={() => setModelHide(false)} />
    </div>

}

export default observer(HeaderCpt) 
