import { Button, DatePicker, Form } from "antd"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { SearchOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/lib/form";
// import ajax from "@/api/axios";
// const searchLayout = { labelCol: { span:8 } }
const { RangePicker } = DatePicker
// const { Option } = Select;
interface ISearchPorps {
    submitCallback?: () => void
}
const SearchCpt = (props: ISearchPorps, ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined) => {
    let { submitCallback = function () { } } = props
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null)

    useImperativeHandle(ref, () => {
        return { getSearchForm: () => form.getFieldsValue() };//使用方法获取最新的表单数据
    })

    return <>
        <Form
            className="search-cpt"
            // {...searchLayout}
            layout="inline"
            form={form}
            ref={formRef}
            // onFinish={onFinish}
            // initialValues={{ }}

        >
         
        
             <Form.Item label="提交时间" name="time">
                 <RangePicker allowEmpty={[true,true]} />
            </Form.Item>
           
            <Form.Item >

                <Button type="primary" onClick={() => submitCallback()} icon={<SearchOutlined />}>搜索</Button>

            </Form.Item>
            <Form.Item >
                <Button type="primary" onClick={() => form.resetFields()}>重置</Button>
            </Form.Item>
        </Form>
    </>
}
export default forwardRef(SearchCpt)