import ajax from "@/api/axios";
import {  Form, Input, message, Modal, Radio, Switch,InputNumber  } from "antd";
import React, {  useEffect } from "react"


interface IeditAddForm {
    id?:number|string
    name?:string|number,
    desc?:string
    role_type?:string|number,
    status?:boolean
}

interface Iporps {
    editAddForm:IeditAddForm
    modelLoading?:boolean,
    submitCallback?:(value:IeditAddForm|boolean)=>void

}
const layout = {labelCol: { span: 6 },wrapperCol: { span: 16 },};
// const tailLayout = {wrapperCol: { offset: 8, span: 16 }, }


const EditAddCpt = (props:Iporps)=>{
    let {editAddForm,modelLoading,submitCallback=()=>{}} = props
    const [form] = Form.useForm();
    const onFinish = () => {
        form.validateFields().then(res=>{
            res.status = res.status?1:2;
            ajax.POST("rbacRoleSave",res).then(result=>{
                let {data} = result
                message.success(data.message||"操作成功")
                submitCallback(true)
            })
        })
        // let status = values.status?1:2
    };
    useEffect(()=>{
        if(modelLoading){
          
            form.setFieldsValue({...editAddForm})
        }
    },[modelLoading,editAddForm,form])

    return (
        <Modal
            getContainer={false}
            title={editAddForm.id?`编辑角色`:"新增角色"}
            centered
            visible={modelLoading}
            okText="提交"
            cancelText="取消"
            onOk={() => onFinish()}
            onCancel={() => submitCallback(false)}
            width={800}
    >
        <Form
            {...layout}
            form={form}
            name="basic"
            initialValues={{...editAddForm}}
            // onFinish={onFinish}
        >   
            {editAddForm.id?
                <Form.Item label="角色id"  name="id" 
                ><Input disabled /></Form.Item>:''
            }
            <Form.Item label="角色名"  name="name"
            rules={[{ required: true, message: '请输入角色名!' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item label="角色描述"  name="desc"
            rules={[{ required: true, message: '请输入角色描述!' }]}
            >
            <Input.TextArea />
            </Form.Item>
            <Form.Item name="role_type" label="角色类型"
             rules={[{ required: true, message: '请选择角色类型!' }]}>
                <Radio.Group>
                    <Radio value={1}>系统预设</Radio>
                    <Radio value={2}>普通角色</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="sort" label="排序" >
               <InputNumber />
            </Form.Item>
            <Form.Item name="status" label="状态" valuePropName="checked" >
                <Switch checkedChildren="开" unCheckedChildren="关"/>
            </Form.Item>

            {/* <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit"> 提交 </Button>
            </Form.Item> */}
        </Form>
    </Modal>
    ) 

}

export default EditAddCpt