import ajax from "@/api/axios";
import {  Form, Input, message, Modal, Switch, InputNumber, TreeSelect } from "antd";
import React, { useEffect } from "react"
const { TreeNode } = TreeSelect;

interface IeditAddForm {
    id?: number | string
    name?: string | number,
    pid?: number | string,
    sort?: number,
    status?: boolean
}

interface Iporps {
    editAddForm: IeditAddForm
    parendSelect: any[]
    modelLoading?: boolean,
    submitCallback?: (value:  boolean) => void

}
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 }, };



const EditAddCpt = (props: Iporps) => {
    let { parendSelect, editAddForm, modelLoading, submitCallback = () => { } } = props
    // let authTypeText = editAddForm.auth_type === 1 ? '菜单' : '权限'
    const [form] = Form.useForm();
    const onFinish = () => {
        form.validateFields().then(res=>{
            console.log(res)
            res.status = res.status?1:2;
                ajax.POST("cmsClassifySave",res).then(result=>{
                let {data} = result
                message.success(data.message||"操作成功")
                submitCallback(true)
            })
        })


        // console.log('Success:', values);
        // console.log(editAddForm.auth_type)
        // let status = values.status ? 1 : 2
        // ajax.POST("rbacAuthSave",{...values,status,auth_type:editAddForm.auth_type}).then(result=>{
        //     let {data} = result
        //     message.success(data.message||"操作成功")
        //     submitCallback(true)
        // })
    };

    const loopTreeItme = (data: any[]) => {
        return data.map(itme => {
            let bool = itme.children?.length;
            return <TreeNode key={itme.id} value={itme.id} title={itme.name}>
                {bool ? loopTreeItme(itme.children) : ''}
            </TreeNode> 
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
            title={editAddForm.id ? `编辑` : `新增`}
            centered
            visible={modelLoading}
            okText="提交"
            cancelText="取消"
            onOk={() =>onFinish()}
            onCancel={() => submitCallback(false)}
            width={800}
        >
            <Form
                {...layout}
                form={form}
                name="basic"
                initialValues={{ ...editAddForm }}
                onFinish={onFinish}
            >
                {editAddForm.id ?
                    <Form.Item label="序号id" name="id"
                    ><Input disabled /></Form.Item> : ''
                }
                <Form.Item label="名称" name="name"
                    rules={[{ required: true, message: '请输入名称!' }]}
                >
                    <Input />
                </Form.Item>
               

                <Form.Item name="pid" label="所属上级" 
                    rules={[{ required: true, message: '请选择所属上级!' }]}
                >
                    <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        // value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Please select"
                        allowClear
                        treeDefaultExpandAll
                        treeNodeFilterProp="title"
                    // onChange={this.onChange}
                    >
                        <TreeNode value={0} title="无"></TreeNode>
                        {loopTreeItme(parendSelect)}
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