import ajax from "@/api/axios";
import {  Form, Input, message, Modal, Switch, InputNumber, TreeSelect, Radio } from "antd";
import React, { useEffect } from "react"
const { TreeNode } = TreeSelect;

interface IeditAddForm {
    id?: number | string
    title?: string | number,
    signName?: string
    url?: string,
    pid?: number | string,
    auth_type?: string | number,
    sort?: number,
    status?: boolean
}

interface Iporps {
    editAddForm: IeditAddForm
    authList: any[]
    modelLoading?: boolean,
    submitCallback?: (value: IeditAddForm | boolean) => void,
    [key:string]:any

}
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 }, };
// const tailLayout = { wrapperCol: { offset: 8, span: 16 }, }
const optionsAuthTypeList= [
    { label: '路由', value: 3 },
    { label: '菜单', value: 1 },
    { label: '权限', value: 2,  },
  ];
  

const EditAddCpt = (props: Iporps) => {
    let { authList, editAddForm, modelLoading, submitCallback = () => { },authTypeText="资源"} = props
    // let authTypeText = editAddForm.auth_type === 1 ? '菜单' : '权限'
    const [form] = Form.useForm();
    const onFinish = () => {
        // console.log('Success:', values);
        console.log(editAddForm.auth_type)
        form.validateFields().then(res=>{
            res.status = res.status?1:2;
            ajax.POST("rbacAuthSave",res).then(result=>{
                let {data} = result
                message.success(data.message||"操作成功")
                submitCallback(true)
            })
        })
        // let status = values.status ? 1 : 2
       
    };

    const loopTreeItme = (data: any[]) => {
        return data.map(itme => {
            let bool = itme.children?.length;
            return itme.auth_type === 1 ? <TreeNode key={itme.id} value={itme.id} title={itme.title}>
                {bool ? loopTreeItme(itme.children) : ''}
            </TreeNode> : ''
        })
    }

    useEffect(() => {
        if (modelLoading) {
            form.setFieldsValue({ ...editAddForm })
        }
    }, [modelLoading, editAddForm, form])
    return (
        <Modal
            getContainer={false}
            title={editAddForm.id ? `编辑${authTypeText}` : `新增${authTypeText}`}
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
                initialValues={{ ...editAddForm }}
                // onFinish={onFinish}
            >
                {editAddForm.id ?
                    <Form.Item hidden label="序号id" name="id"
                    ><Input disabled /></Form.Item> : ''
                }

                <Form.Item label={`${authTypeText}类型`} name="auth_type"
                    rules={[{ required: true, message: '请选择类型!' }]}
                >
                    <Radio.Group
                        options={optionsAuthTypeList}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
                

                <Form.Item label={`${authTypeText}名称`} name="title"
                    rules={[{ required: true, message: '请输入名称!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={`${authTypeText}标识`} name="signName"
                    rules={[{ required: true, message: '请输入唯一标识!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="链接" name="url"
                    rules={[{ required: true, message: '请输入链接!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="pid" label="所属上级" 
                    rules={[{ required: editAddForm.auth_type !== 1, message: '请选择所属上级!' }]}
                >
                    <TreeSelect
                        // showSearch
                        style={{ width: '100%' }}
                        // value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Please select"
                        allowClear
                        treeDefaultExpandAll
                    // onChange={this.onChange}
                    >
                        {editAddForm.auth_type === 1?<TreeNode value={0} title="无"></TreeNode>:''}
                        {loopTreeItme(authList)}
                    </TreeSelect>
                </Form.Item>


                <Form.Item name="sort" label="排序" >
                    <InputNumber />
                </Form.Item>

                <Form.Item name="status" label="状态" valuePropName="checked" >
                    <Switch checkedChildren="开" unCheckedChildren="关" />
                </Form.Item>

                {/* <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit"> 提交 </Button>
                </Form.Item> */}
            </Form>
        </Modal>
    )

}

export default EditAddCpt