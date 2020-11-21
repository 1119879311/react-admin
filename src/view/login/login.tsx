import React, { Component } from "react"
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from "@/api/axios"
import "./index.css"
import {UserStoreClass} from "@/store/userStore"
import { inject } from "mobx-react";

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 12 } };
const tailLayout = { wrapperCol: { offset: 8, span: 12 }, };

interface IProps extends RouteComponentProps {
    UserStore: UserStoreClass
};
//@ts-ignore
@withRouter
@inject("UserStore")
class LoginPage extends Component<IProps>{
    state = {
        codetoken: "",
        codeImg: "",
    }
    componentDidMount() {
        this.createCode()
        console.log(this.props)
    }
    onFinish = async  (values: any) => {
        console.log('Success:', values);
        let postData = { ...values, codetoken: this.state.codetoken }
        message.success({ content: '正在登陆中...', key: "loadingKey" })
        try {
            let result = await axios.POST("adminLogin", postData)
            let { data } = result.data;
            let { UserStore, history } = this.props
            let userInfo: UserStoreClass['userData'] = { user_name: data.name, user_id: data.id, user_type: data.user_type, token: data.token };
            UserStore.setData(userInfo)
            message.success("登录成功,正在跳转中...")
            setTimeout(() => {
                history.replace("/admin")
            }, 1000);
        } catch (error) {
            this.createCode();
            message.destroy('loadingKey')
        } 
    }
    onFinishFailed = (errorInfo: any) => { console.log('Failed:', errorInfo); };
    createCode() {
        axios.GET("adminCode").then(res => {
            console.log(res.headers)
            let { codetoken } = res.headers;
            let codeImg = res.data;

            this.setState({ codetoken, codeImg })
        })
    }
    render() {
        let { codeImg } = this.state
        return <div className="login-warp">
            <div className="login-main">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="账号"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="请输入账号" />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item label="验证码"  >
                        <div style={{ display: "flex" }}>


                            <Form.Item
                                name="code"
                                noStyle
                                rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                            >
                                <Input placeholder="请输入验证码" />
                            </Form.Item>
                            <span className="imgcode" onClick={() => this.createCode()} dangerouslySetInnerHTML={{ __html: codeImg }}></span>
                        </div>
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    }
}


export default LoginPage
