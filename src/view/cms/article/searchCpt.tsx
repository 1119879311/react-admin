import { Button, DatePicker, Form, Input, Select, TreeSelect } from "antd"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { SearchOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/lib/form";
import ajax from "@/api/axios";
import  { loopTreeItme } from "@/component/ClassifyTree";
import { oneToTree } from "@/util";
// const searchLayout = { labelCol: { span:8 } }
const { RangePicker } = DatePicker
const { Option } = Select;
interface ISearchPorps {
    submitCallback?: () => void
}
const SearchCpt = (props: ISearchPorps, ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined) => {
    let { submitCallback = function () { } } = props
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null)
    const [classifyList, setClassifyList] = useState<any[]>([])

    useImperativeHandle(ref, () => {
        return { getSearchForm: () => form.getFieldsValue() };//使用方法获取最新的表单数据
    })


    const getClassifyListFn = () => {
        ajax.GET("cmsClassify",{isPage:true}).then(res => {
            console.log(res)
            let { data } = res.data
            setClassifyList(oneToTree(data.rows))
        })
    }
    useEffect(() => { getClassifyListFn() }, [])

    return <>
        <Form
            className="search-cpt"
            // {...searchLayout}
            layout="inline"
            form={form}
            ref={formRef}
            // onFinish={onFinish}
            initialValues={{ title: "", status: "" }}

        >
            <Form.Item label="关键词" name="title">
                <Input placeholder="请输入标题关键词" allowClear />
            </Form.Item>

            <Form.Item label="状态" name="status">
                <Select allowClear style={{ width: "200px" }}>
                    <Option value={1}>开启</Option>
                    <Option value={2}>禁用</Option>
                </Select>
            </Form.Item>
            <Form.Item label="分类" name="cid">
                <TreeSelect
                       showSearch
                       style={{ width: '200px' }}
                       dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                       placeholder="Please select"
                       allowClear
                       treeDefaultExpandAll
                       treeNodeFilterProp="title"
                    >
                        {loopTreeItme(classifyList)}
                    </TreeSelect>
                {/* <Select allowClear style={{ width: "200px" }}>
                    {classifyList?.map(itme => <Option key={itme.id} value={itme.id}>{itme.name}</Option>)}
                </Select> */}
            </Form.Item>

            {/* <Form.Item label="日期" style={{ marginBottom: 0 }}>
                <div className="m-flex m-center">
                    <DatePicker /><span> &nbsp; - &nbsp; </span><DatePicker/>
                </div>
            </Form.Item> */}
             <Form.Item label="创建时间" name="time">
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