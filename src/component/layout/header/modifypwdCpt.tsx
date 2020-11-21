
import ajax from "@/api/axios";
import { Form, Input, message, Modal } from "antd";
import React from "react"
import { useHistory } from "react-router-dom";
interface Iporps {
    modelLoading?: boolean,
    submitCallback?: (value:  boolean) => void

}
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 }, };



const ModifyPwdCpt = (props: Iporps) => {
    let { modelLoading, submitCallback = () => { } } = props
   
    const [form] = Form.useForm();
    const history = useHistory();
    const onFinish = () => {

        form.validateFields().then(res => {
            ajax.POST("modifyUserpwd",res).then(result=>{
                message.success("修改成功,正在为你跳转重新登录")
                submitCallback(false)
                setTimeout(() => {
                    history.replace("/login")
                }, 1000);
            })
        })
    };

    return (
        <Modal
            getContainer={false}
            title={'修改密码'}
            centered
            visible={modelLoading}
            okText="提交"
            cancelText="取消"
            onOk={() => onFinish()}
            onCancel={() => submitCallback(false)}
            width={600}
        >
            <Form
                {...layout}
                form={form}
                name="basic"
                initialValues={{ password: '', checkPass: "" }}
            >
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="checkPass"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input />
                </Form.Item>


            </Form>
        </Modal>
    )

}

export default ModifyPwdCpt