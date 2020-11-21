import ajax from "@/api/axios";
import {  Form, Input, message, Modal, Radio, Select, Switch } from "antd";
import React, {  useEffect, useState } from "react"
import UserStore from "@/store/userStore"
const { Option } = Select;

interface IeditAddForm {
    id?:number|string
    name?:string|number,
    email?:string
    contact?:string|number,
    user_type?:string|number,
    roleIds?:number[],
    status?:boolean
    password?:string|number
}

interface Iporps {
    editAddForm:IeditAddForm
    modelLoading?:boolean,
    submitCallback?:(value:IeditAddForm|boolean)=>void
    rolesList?:{[key:string]:any}[]
    
}
const layout = {labelCol: { span: 6 },wrapperCol: { span: 16 },};
// const tailLayout = {wrapperCol: { offset: 8, span: 16 }, }


const EditAddCpt = (props:Iporps)=>{
    let {editAddForm,modelLoading,submitCallback=()=>{}} = props
    const [form] = Form.useForm();

    const [rolesList,setRolesList] = useState<any[]>([])
    const onFinish = () => {
        form.validateFields().then(res=>{
            res.status = res.status?1:2;
            res.roleIds = res.roleIds?.join(',')
            ajax.POST("rbacUserSave",res).then(result=>{
                let {data} = result
                message.success(data.message||"操作成功")
                submitCallback(true)
            })
        })
        
    };

     // 获取角色列表
    const getRolesList=()=>{
        ajax.GET('rbacRole')
        .then(res=>{
            let {data} = res.data
            setRolesList(data.rows||[])
        })
    }
    useEffect(()=>{
        getRolesList();
    },[])
    useEffect(()=>{
        if(modelLoading){
            form.setFieldsValue({...editAddForm})
        }
    },[modelLoading,editAddForm,form])

    return (
        <Modal
            getContainer={false}
            title={editAddForm.id?`编辑用户`:"新增用户"}
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
                <Form.Item label="用户id"  name="id" 
                ><Input disabled /></Form.Item>:''
            }
            <Form.Item label="用户名"  name="name"
            rules={[{ required: true, message: '请输入用户名!' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item name="user_type" label="用户类型"
             rules={[{ required: true, message: '请选择用户类型!' }]}>
                <Radio.Group disabled={editAddForm.id?true:false }>
                    {editAddForm.user_type!==1?'':<Radio value={1} >超级用户</Radio>}
                    {UserStore.isSystem?<Radio value={2}>系统用户</Radio>:''} 
                    <Radio value={3}>普通用户</Radio>
                </Radio.Group>
            </Form.Item>
            {editAddForm.id?'':
                <Form.Item label="密码"  name="password"
                    rules={[{ required: true, message: '请输入用户密码!' }]}
                ><Input.Password /></Form.Item>
            }
            <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
                <Input />
            </Form.Item>
             <Form.Item name='contact' label="联系方式" rules={[{ pattern: /^1[\d]{10}$/, message: '请选择正确的号码!'  }]}>
                <Input />
            </Form.Item>
            
            

            <Form.Item
                name="roleIds"
                label="角色"
                rules={[{max:3,  message: '角色可选且不能超过三个角色', type: 'array' }]}
            >
                <Select mode="multiple" placeholder="Please select role">
                {rolesList.map((itme:any)=> <Option key={itme.id} disabled={itme.status!==1} value={itme.id}>{itme.name} {itme.role_type===1?'[系统预设]':''}</Option> )}
                </Select>
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