import { Button, DatePicker, Form, Input, Select } from "antd"
import React,{forwardRef, useImperativeHandle, useRef} from "react"
import { SearchOutlined } from '@ant-design/icons';
import { FormInstance } from "antd/lib/form";
const { RangePicker } = DatePicker
// const searchLayout = { labelCol: { span:8 } }
const { Option } = Select;
interface ISearchPorps {
    submitCallback?:()=>void
}
const SearchCpt = (props:ISearchPorps,ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined) => {
    let {submitCallback=function(){}} = props
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null)
   
    useImperativeHandle(ref,()=>{
        console.log(ref)
        return { 
            getSearchData:()=>{
                let resData = form.getFieldsValue()
                // 处理时间
                let resTime =resData.time?.map((itme:any)=>itme?.format('YYYY-MM-DD'))||[]
                delete resData.time
                return {...resData,startTime:resTime[0],endTime:resTime[1]}
            }
        };//使用方法获取最新的表单数据
    })

    return <>
        <Form
            className="search-cpt"
            // {...searchLayout}
            layout="inline"
            form={form}
            ref={formRef} 
            // onFinish={onFinish}
            initialValues={{ name:"",status:"" }}
          
        >
            <Form.Item label="用户名" name="name">
                <Input placeholder="请输入用户名" />
            </Form.Item>
           
            <Form.Item label="状态" name="status">
                <Select allowClear style={{width:"200px"}}>
                    <Option value={1}>开启</Option>
                    <Option value={2}>禁用</Option>
                    </Select>
            </Form.Item>
            <Form.Item label="创建时间" name="time">
                 <RangePicker allowEmpty={[true,true]} />
            </Form.Item>
            <Form.Item >
                {/* <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>搜索</Button> */}
                <Button type="primary"  onClick={()=>submitCallback()}  icon={<SearchOutlined />}>搜索</Button>

            </Form.Item>
            <Form.Item >
                <Button type="primary" onClick={()=>form.resetFields()}>重置</Button>
            </Form.Item>
        </Form>
    </>
}
export default forwardRef(SearchCpt)