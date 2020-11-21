import ajax from "@/api/axios"
import { Button, message, Table } from "antd"
import { SyncOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from "react"
import { BlobToText, dataFormat, downloadFile, signRonder } from "@/util";
import AuthButton from "@/component/AuthButton";
import SearchCpt from "./searchCpt"
interface returnSearchCpt {
    getSearchForm:Function
}
const PageMessage = ()=>{
  
    const [tableData,setTableData] = useState([])
    const [loading,setLoading] = useState(false)
    const [currentPage,setCurrentPage] = useState(1)
    const [pageSize,setPageSize] = useState(30)

    const [totalData,setTotalData] = useState(0)
    const searchCptRef = useRef<returnSearchCpt>()
    const [selectedRowKeys,setSelectedRowKeys] = useState<number[]>([])

    //获取
    const geTableData = (page=1,pSize?:number)=>{
        setLoading(true)
        setCurrentPage(page)
        pSize&&setPageSize(pSize)
        let resSearchOpt =searchCptRef.current?.getSearchForm()||{} 
        let resTime =resSearchOpt.time?.map((itme:any)=>itme?.format('YYYY-MM-DD'))||[]
        delete resSearchOpt.time
        let searchOpt = {page:page,offset:pSize||pageSize,startTime:resTime[0],endTime:resTime[1], ...resSearchOpt}
        ajax.GET("message",searchOpt)
        .then(res=>{
            let {data} = res.data
            console.log(data)
            setTableData(data.rows)
            setTotalData(data.total)
            setLoading(false)
        }).catch(err=>{
            setLoading(false)
            console.log(err)
        })
       
    }
    //导出
    const exportExce = ()=>{
        let resSearchOpt =searchCptRef.current?.getSearchForm()||{} 
        let resTime =resSearchOpt.time?.map((itme:any)=>itme?.format('YYYY-MM-DD'))||[]
        delete resSearchOpt.time
        let searchOpt = {page:currentPage,offset:pageSize,startTime:resTime[0],endTime:resTime[1], ...resSearchOpt}
        ajax.GET("messageExportExce",searchOpt,{responseType:'blob'})
        .then(res=>{
            let fileNameFilds:string= res.headers['content-disposition'];
            let reg = /(^|;)filename=([^;]*)(;|$)/;
            let resReg = fileNameFilds.match(reg)
            let fileNmae =resReg?resReg[2]:signRonder(8)+'.xlsx' 
            downloadFile(res.data,fileNmae,'xlsx')
        }).catch(err=>{
            BlobToText(err.data).then((res:any)=>{
                message.error(res.message||"暂无数据可下载")
            })
            console.log(err)
        })
    }
    // const deleteFn = async (type:number,record?:any)=>{
    //     let postData={ids:''}
    //     if(type===0){
    //         postData.ids = record.id+'';
    //     //批量
    //     }else{
    //         if(!selectedRowKeys.length){
    //             return message.warning("暂无可操作的数据")
    //         }
    //         // 找禁用的 !=1
    //         postData.ids = getSatusIdsFn(1)
    //         if(!postData.ids){

    //             return message.warning("暂无可操作的数据")
    //         }
    //     }
    //     Modal.confirm({ 
    //         content:"确定删除吗",
    //         onOk:(colseModal)=>{
    //             //单个
    //             ajax.POST("cmsArticleDel",postData)
    //             .then(result=>{
    //                 colseModal()
    //                 let {data} = result
    //                 message.success(data.message||"操作成功")
    //                 geTableData(currentPage)
    //             })
    //             .catch(_=>colseModal())
    //         }
    //     })  
    // }

   
    const onSelectChange = (selectedRowKeys:any[])=>{
        setSelectedRowKeys(selectedRowKeys)
    }
    // eslint-disable-next-line
    useEffect(()=>{geTableData()},[])
    return <div className="view-article">
         <SearchCpt ref={searchCptRef} submitCallback={geTableData}/>
    <Table
        loading={loading}
        size="small"
        rowKey={(record:any)=>record.id}
        style={{"margin":"12px auto"}}
        rowSelection={{selectedRowKeys,onChange:onSelectChange}}
        dataSource={tableData}
        pagination={{current:currentPage, pageSize: pageSize,onChange:(page,pageSize)=>geTableData(page,pageSize), total:totalData }}
        bordered
        title={() => (
            <div className="operation-main">
                 <AuthButton type="primary">批量删除</AuthButton>
                <AuthButton type="primary" onClick={exportExce}>导出xlsx</AuthButton> 
                <Button type="primary" icon={<SyncOutlined/>} onClick={()=>geTableData(currentPage)}>刷新列表</Button>
            </div>
        )}
        columns={[
            {title: '序号',	dataIndex: 'id',	key: 'id',width:80},
            {title: '邮箱',	dataIndex: 'email',	key: 'email',width:280,align:'center'},
            {title: '联系人',	dataIndex: 'username',	key: 'username',width:160,align:'center'},
            {title: '号码',	dataIndex: 'telephone',	key: 'telephone',width:80,align:'center'},
            {title: '地址 ',  dataIndex: 'address',key:"address",width:80,align:'center'},
            {title: '备注内容',	dataIndex: 'content',	key: 'content',width:180,align:'center'},
            {title: '提交时间',	dataIndex: 'createtime',	key: 'createtime',width:180,align:'center',
                render:(text: any, record: any) => (<span>{dataFormat(record.createtime)}</span>)
            },
      
        ]}
    />

    </div>
}
export default PageMessage