import ajax from "@/api/axios";
import { Form, Input, message, Modal, Switch, InputNumber } from "antd";
import React, { useEffect } from "react"


interface IeditAddForm {
    id?: number | string
    name:string,
    sort?: number,
    status?: boolean
}

interface Iporps {
    editAddForm: IeditAddForm
    modelLoading?: boolean,
    submitCallback?: (value: IeditAddForm | boolean) => void

}
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 }, };



const EditAddCpt = (props: Iporps) => {
    let { editAddForm, modelLoading, submitCallback = () => { } } = props
  
    const [form] = Form.useForm();
    const onFinish =  () => {
        
        form.validateFields().then(res=>{
            console.log(res)
            res.status = res.status?1:2;
            ajax.POST("cmsTagSave",res).then(result=>{
                let {data} = result
                message.success(data.message||"操作成功")
                submitCallback(true)
            })
        })
    };

   

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
            onOk={() => onFinish()}
            onCancel={() => submitCallback(false)}
            width={600}
        >
            <Form
                {...layout}
                form={form}
                name="basic"
                initialValues={{ ...editAddForm }}
                // onFinish={onFinish}
            >
                {editAddForm.id ?
                    <Form.Item label="序号id" name="id"
                    ><Input disabled /></Form.Item> : ''
                }
                <Form.Item label='名称' name="name"
                    rules={[{ required: true, message: '请输入名称!' }]}
                >
                    <Input />
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