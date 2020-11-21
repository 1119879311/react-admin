import ajax from "@/api/axios"
import { Button, message, Table, Tag, Modal,Image, Tooltip  } from "antd"
import { SyncOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from "react"
import { dataFormat } from "@/util";
import getStatusText from "@/component/StatusButton";
import AuthButton from "@/component/AuthButton";
import SearchCpt from "./searchCpt"
import { useHistory } from "react-router-dom";
interface returnSearchCpt {
    getSearchForm: Function
}
const PageCmsImage = () => {
    let history = useHistory()
    // const pageSize =30
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(30)

    const [totalData, setTotalData] = useState(0)
    const searchCptRef = useRef<returnSearchCpt>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    //获取
    const geTableData = (page = 1, pSize?: number) => {
        setLoading(true)
        setCurrentPage(page)
        pSize && setPageSize(pSize)
        let resSearchOpt = searchCptRef.current?.getSearchForm() || {}
        // let searchOpt = {page:page,offset:pSize||pageSize, ...resSearchOpt}
        ajax.GET("cmsImages", { page: page, offset: pSize || pageSize, ...resSearchOpt })
            .then(res => {
                let { data } = res.data
                console.log(data)
                setTableData(data.rows)
                setTotalData(data.total)
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                console.log(err)
            })

    }


    const deleteFn = async (type: number, record?: any) => {
        let postData = { ids: '' }
        if (type === 0) {
            postData.ids = record.id + '';
            //批量
        } else {
            if (!selectedRowKeys.length) {
                return message.warning("暂无可操作的数据")
            }
            // 找禁用的 !=1
            postData.ids = getSatusIdsFn(1)
            if (!postData.ids) {

                return message.warning("暂无可操作的数据")
            }
        }
        Modal.confirm({
            content: "确定删除吗",
            onOk: (colseModal) => {
                //单个
                ajax.POST("cmsImagesDel", postData)
                    .then(result => {
                        colseModal()
                        let { data } = result
                        message.success(data.message || "操作成功")
                        geTableData(currentPage)
                    })
                    .catch(_ => colseModal())
            }
        })
    }

    const getSatusIdsFn = (type: number) => {

        let resFilter = tableData.filter((itme: any) => itme.status !== type && selectedRowKeys.includes(itme.id))
        return resFilter.map((itme: any) => itme.id).join(',')
    }
    const switchStatuFn = (type: string | number, record?: any) => {
        let postData = { ids: "", status: 1 }
        if (type !== 0 && !selectedRowKeys.length) {
            return message.warning("暂无可操作的数据")
        }
        switch (type) {
            case 0:
                postData.ids = record.id + '';
                postData.status = record.status === 1 ? 2 : 1;
                break;
            case 1:
                postData.ids = getSatusIdsFn(1)
                postData.status = 1
                break;
            case 2:
                postData.ids = getSatusIdsFn(2)
                postData.status = 2
                break;

            default:
                break;
        }
        if (!postData.ids) {
            return message.warning("暂无可操作的数据")
        }
        ajax.POST("cmsImagesSwtich", postData).then(result => {
            let { data } = result
            message.success(data.message || "操作成功")
            geTableData(currentPage)
        })
        console.log(postData)
        console.log(selectedRowKeys)
    }
    const onSelectChange = (selectedRowKeys: any[]) => {
        setSelectedRowKeys(selectedRowKeys)
    }
    // eslint-disable-next-line
    useEffect(() => { geTableData() }, [])
    return <div className="view-article">
        <SearchCpt ref={searchCptRef} submitCallback={geTableData} />
        <Table
            loading={loading}
            size="small"
            rowKey={(record: any) => record.id}
            style={{ "margin": "12px auto" }}
            rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
            dataSource={tableData}
            pagination={{ current: currentPage, pageSize: pageSize, onChange: (page, pageSize) => geTableData(page, pageSize), total: totalData }}
            bordered
            title={() => (
                <div className="operation-main">
             
                    <AuthButton type="primary" onClick={() => history.push("/admin/cmsiamgesave")}>新增</AuthButton>
                    <AuthButton type="primary"  onClick={()=>deleteFn(2)}>批量删除</AuthButton>
                <AuthButton type="primary"  onClick={()=>switchStatuFn(1)}>批量开启</AuthButton>
                <AuthButton type="primary"  onClick={()=>switchStatuFn(2)}>批量禁用</AuthButton> 
                    <Button type="primary" icon={<SyncOutlined />} onClick={() => geTableData(currentPage)}>刷新列表</Button>
                </div>
            )}
            columns={[
                // {title: '序号',	dataIndex: 'id',	key: 'id',width:80},
                { title: '标题', dataIndex: 'title', key: 'title', width: 280, align: 'center' },
                { title: '图片集', dataIndex: 'urls', key: 'title', width: 280, align: 'center',
                render: (text: any, record: any) =>{
                    let res:any[] = record.urls.split(',')
                    return res.map((itme,index)=><Image style={{cursor:'pointer',marginLeft:4}} key={index} width={40} src={itme} fallback="error.png"/>)
                }
                },
                {
                    title: '分类', dataIndex: 'classify', key: 'classify', width: 320, align: 'center',
                    render: (text: any, record: any) =>
                <>  {record.classify ? record.classify.map((itme:any)=><span key={itme.id}><Tag  color={itme.status===1?'success':'error'} >{itme.name} &gt;</Tag></span>): ''} </>
                },
                { title: '描述', dataIndex: 'remark', key: 'remark',  align: 'center' ,width: 220},
                
                { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, align: 'center' },
                {
                    title: '状态 ', dataIndex: 'status', key: "status", width: 80, align: 'center', render: (text: any, record: any) => getStatusText(record.status, record.user_type)
                },
                {
                    title: '创建时间', dataIndex: 'createtime', key: 'createtime', width: 180, align: 'center',
                    render: (text: any, record: any) => (<span>{dataFormat(record.createtime)}</span>)
                },
                {
                    title: '更新时间', dataIndex: 'updatetime', key: 'updatetime', width: 180, align: 'center',
                    render: (text: any, record: any) => (<span>{dataFormat(record.updatetime)}</span>)
                },

                {
                    title: '操作', dataIndex: 'operation', key: "operation", width: 320, fixed: 'right',
                    render: (text: any, record: any) =>
                        <div className="operation-main">
                            <AuthButton type="primary" danger={record.status===1}  size="small" onClick={()=>switchStatuFn(0,record)}>{record.status===1?'禁用':'开启'}</AuthButton>
                    <AuthButton type="primary" size="small" onClick={()=>history.push("/admin/cmsiamgesave/"+record.id)}>编辑</AuthButton>
                    <AuthButton type="primary" danger size="small" disabled={record.status===1} onClick={()=>deleteFn(0,record)}>删除</AuthButton>
                        </div>
                }
            ]}
        />

    </div>
}
export default PageCmsImage

