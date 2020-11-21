import { Button, Cascader, Form, Input, InputNumber, message, Select, Spin, Switch, Tooltip, TreeSelect, Upload } from "antd"
import { PlusOutlined, SyncOutlined, UploadOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import ajax from "@/api/axios";
import { oneToTree, signRonder } from "@/util";
import { loopTreeItme } from "@/component/ClassifyTree";
const { TreeNode } = TreeSelect;
const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 }, };
function initEditAddForm() {
    return { id: '', title: "", remark: "", urls: [], cid: [], sort: 10, status: true, netimg: '' }
}

//获取具体信息
function useDetailData() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    let params = useParams() as { id: any }
    const getDataDetail = (id: any) => {
        console.log(id)
        //修改
        if (id) {
            setLoading(true)
            ajax.GET("cmsImages", { id: params.id })
                .then(res => {
                    let { data } = res.data
                    console.log(data)
                    form.setFieldsValue({
                        id: data.id,
                        title: data.title,
                        remark: data.remark,
                        cid: data.classify ? data.classify.map((itme:any)=>itme.id) : [],
                        sort: data.sort,
                        status: data.status === 1 ? true : false,
                        urls: data.urls ? data.urls.split(',').map((itme: any) => { return { url: itme, uid: signRonder(6) } }) : []
                    })
                    setLoading(false)
                }).catch(err => {
                    setLoading(false)
                    console.log(err)
                })

        } else {
            form.setFieldsValue(initEditAddForm())
        }
    }

    useEffect(() => {
        getDataDetail(params.id);
    }, [params.id])

    return { form, loading }
}
//获取分类信息
function useGetClassify() {
    const [classifyList, setClassifyList] = useState([])
    const getClassifyList = () => {
        ajax.GET('cmsClassify', { isPage: true })
            .then(res => {
                let { data } = res.data
                setClassifyList(oneToTree(data.rows, 'id', 'pid', 0, 1, (itme: any) => { itme['disabled'] = itme.status === 1 ? false : true }))
            }).catch(err => {
            })
    }
    useEffect(() => { getClassifyList() }, [])
    return classifyList
}


const EditAddCpt = () => {
    const History = useHistory();
    const { form, loading } = useDetailData();
    const classifyList = useGetClassify();
    const onFinish = () => {
        // console.log("value", value)
        form.validateFields().then(value => {
            console.log("value:", value)
            let postData = {
                id: value.id,
                title: value.title,
                remark: value.remark,
                cid: value.cid?.join(','),
                sort: value.sort,
                status: value.status === true ? 1 : 2,
                urls: value.urls ? value.urls.map((itme: any) => itme.url).join(',') : ''
            }
            console.log(postData)
            ajax.POST("cmsImagesSave", postData).then(result => {
                let { data } = result
                message.success(data.message || "操作成功")
            })
        })
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    //筛选以上传的和没有上转的
    const filterImgList = () => {
        let data = form.getFieldValue("urls") as any[] || [];
        let oldData = [];
        let waitup = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].url) {
                oldData.push(data[i])
            } else {
                waitup.push(data[i].originFileObj)
            }
        }
        return { oldData, waitup }
    }
    // 定义图片上转
    const uploadHandler = (params: any) => {
        let { data = {}, file } = params
        let postData = new FormData()
        postData.append("type", data.type)
        postData.append("files", file)
        ajax.POST("uploadAll", postData, {
            'Content-Type': 'multipart/form-data'
        }).then(respose => {
            let { data } = respose.data || [];

            let { oldData } = filterImgList()
            console.log(data)
            let resArr = data.map((itme: any) => {
                return { url: itme, uid: signRonder(10) }
            })
            form.setFieldsValue({ urls: [...oldData, ...resArr] })
            console.log(data)
        })
    }

    //插入网络图片
    const insertNetImgFn = () => {
        let insertData = form.getFieldValue("netimg") as string;
        let resArr = insertData?.split(",").filter(itme => itme) || [];
        console.log(insertData, resArr)
        if (!resArr.length) {
            return message.error("请输入图片地址")
        }
        let res = resArr.map((itme: any) => {
            return { url: itme, uid: signRonder(10) }
        })
        let oldData: any[] = form.getFieldValue("urls")
        form.setFieldsValue({ urls: [...oldData, ...res], netimg: '' })
    }


    return <div className="page-images" style={{ maxWidth: 960, margin: 'auto' }}>
        <Spin spinning={loading}>
            <Form
                form={form}
                {...layout}
                name="basic"
                initialValues={{ ...initEditAddForm() }}
            // onFinish={onFinish}
            >
                <Form.Item label="序号" name="id">
                    <Input disabled />
                </Form.Item>

                <Form.Item label='标题' name="title" >
                    <Input />
                </Form.Item>
                <Form.Item label='简述' name="remark" >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="分类" name="cid">

                    <Cascader
                        fieldNames={{ label: 'name', value: 'id' }}
                        options={classifyList}
                        // onChange={onChange}
                        placeholder="Please select"
                    />
                    {/* <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Please select"
                    allowClear
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                >
                    <TreeNode value={0} title="无"></TreeNode>
                    {loopTreeItme(classifyList)}
                </TreeSelect> */}
                </Form.Item>

                <Form.Item label="图片集" >
                    <Form.Item
                        name="urls"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={
                            [{ type: 'array', required: true, message: '请至少上传一张图片!' }]
                        }
                    >
                        <Upload accept="image/*" customRequest={uploadHandler} data={{ type: "imgmodule" }} multiple listType="picture-card">
                            <PlusOutlined />
                        </Upload>
                    </Form.Item>
                    <Form.Item label={<Button onClick={insertNetImgFn}>插入网络图片</Button>} name="netimg" style={{ marginBottom: 0 }}>
                        <Input />
                    </Form.Item>
                    <Tooltip title="多张用英文逗号分隔开">
                        <span style={{ color: "#999" }}><ExclamationCircleTwoTone style={{ color: "#999" }} /> &nbsp;插入提示</span>
                    </Tooltip>
                </Form.Item>

                <Form.Item name="sort" label="排序" >
                    <InputNumber />
                </Form.Item>

                <Form.Item name="status" label="状态" valuePropName="checked" >
                    <Switch checkedChildren="开" unCheckedChildren="关" />
                </Form.Item>
                <div className=" by-fixed-footer">
                    <div className="m-flex m-center operation-main" style={{ maxWidth: 1150, paddingLeft: "8%" }}>
                        <Button type="primary" onClick={onFinish}> 提交 </Button>
                        <Button type="primary" onClick={() => History.push("/admin/cmsimage")}> 返回 </Button>
                    </div>
                </div>
                {/* <div className="m-flex m-center">
                <Button type="primary" htmlType="submit" block> 提交 </Button>
            </div> */}
            </Form>
        </Spin>
    </div>

}

export default EditAddCpt
