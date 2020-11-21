import ajax from "@/api/axios";
import AuthButton from "@/component/AuthButton";
import getStatusText from "@/component/StatusButton";
import { dataFormat } from "@/util";
import { Button, message, Modal, Table } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import React, { Component } from "react"
import EditAddCpt from "./editAddCpt"
function initEditAddForm(){
    return {id:"",name:"",sort:10,status:true}
}

export default class CmsTab extends Component{
    state = {
        loading:false,
            //  列表数据
        tableData:[],
        totalData:0,
        currentPage:1,
        pageSize:30,

        selectedRowKeys:[] as any[],//选择的key

        editAddForm:initEditAddForm(),
        modelLoading:false,

        
    }
    componentDidMount(){
        this.geTableData();
    }
    
    //获取表格数据
    geTableData(page=1,pageSize?:number){
        let psize = pageSize||this.state.pageSize;
        this.setState({loading:true,currentPage:page,pageSize:psize})
        ajax.GET('cmsTag',{page:page,offset:psize})
        .then(res=>{
            let {data} = res.data
            console.log(data)
            this.setState({tableData:data.rows,loading:false})
        }).catch(err=>{
            this.setState({loading:false})
            console.log(err)
        })
    }
    // 提交表单后回调
    submitCallback=(result:any)=>{
        this.setState({modelLoading:false})
        if(result){
            let {currentPage} =this.state
            this.geTableData(currentPage)
        } 
    }
    getSatusIdsFn = (type:number)=>{
        // 1:开启操作，找禁用的
        //2. 禁用操作，找开启的
        let {tableData,selectedRowKeys} = this.state
        let resFilter = tableData.filter((itme:any)=>itme.status!==type&&selectedRowKeys.includes(itme.id))
        return resFilter.map((itme:any)=>itme.id).join(',')
    }
    //禁用开启
    switchStatuFn = (type:string|number,record?:any)=>{
        let {selectedRowKeys} = this.state
        let postData = {ids:"",status:1}
        if(type!==0&&!selectedRowKeys.length){
            return message.warning("暂无可操作的数据")
        }
        switch (type) {
            case 0:
                postData.ids = record.id+'';
                postData.status = record.status===1?2:1;
                break;
            case 1:
                postData.ids = this.getSatusIdsFn(1)   
                postData.status =1      
                break;
            case 2:
                postData.ids = this.getSatusIdsFn(2)
                postData.status =2
            break;
              
            default:
                break;
        }
        if(!postData.ids){
            return message.warning("暂无可操作的数据")
        }
        ajax.POST("cmsTagSwtich",postData).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            let {currentPage} = this.state
            this.geTableData(currentPage)
        })
    }
    //删除
    deleteFn = async (type:number,record?:any)=>{
        let {selectedRowKeys,currentPage} =this.state
        let postData={ids:''}
        if(type===0){
            postData.ids = record.id+'';
        //批量
        }else{
            if(!selectedRowKeys.length){
                return message.warning("暂无可操作的数据")
            }
            // 找禁用的 !=1
            postData.ids = this.getSatusIdsFn(1)
            if(!postData.ids){

                return message.warning("暂无可操作的数据")
            }
        }
        Modal.confirm({ 
            content:"确定删除吗",
            onOk:(colseModal)=>{
                //单个
                ajax.POST("cmsTagDel",postData)
                .then(result=>{
                    colseModal()
                    let {data} = result
                    message.success(data.message||"操作成功")
                    this.geTableData(currentPage)
                })
                .catch(_=>colseModal())
            }
        })  
    }
    // 编辑新增
    editAddFn(record?:any){
        let editAddForm=initEditAddForm()
        // console.log(record)
        if(record){
            editAddForm.id = record.id
            editAddForm.name = record.name
            editAddForm.status=record.status===1?true:false
            editAddForm.sort = record.sort
           
        }
        this.setState({editAddForm, modelLoading:true})

    }
    onSelectChange =( selectedRowKeys:any[])  => {
        this.setState({selectedRowKeys})
    }
 
    render(){
        const {loading,pageSize,currentPage,totalData, selectedRowKeys,tableData,editAddForm  } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="cmstag-view">
                 <Table
                    loading={loading}
                    size="small"
                    rowKey={(record:any)=>record.id}
                    style={{"margin":"12px auto"}}
                    columns={[
                        {title: '序号',	dataIndex: 'id',	key: 'id',width:80},
                        {title: '名称',	dataIndex: 'name',	key: 'name',width:120,align:'center'},
                        
                        {title: '排序',	dataIndex: 'sort',	key: 'sort',width:80,align:'center'},
                            {title: '状态 ',  dataIndex: 'status',key:"status",width:80,align:'center',render:(text:any,record: any)=>getStatusText(record.status)
                        },
                        {title: '创建时间',	dataIndex: 'createtime',	key: 'createtime',width:180,align:'center',
                            render:(text: any, record: any) => (<span>{dataFormat(record.createtime)}</span>)
                        },
                        {title: '更新时间',	dataIndex: 'updatetime',	key: 'updatetime',width:180,align:'center',
                            render:(text: any, record: any) => (<span>{dataFormat(record.updatetime)}</span>)
                        },
                        {title: '操作',  dataIndex: 'operation',key:"operation", width: 280, fixed: 'right',
                        render:(text: any,record: any) =>
                            <div  className="operation-main">
                                <AuthButton type="primary" danger={record.status===1}  size="small" onClick={()=>this.switchStatuFn(0,record)}>{record.status===1?'禁用':'开启'}</AuthButton>
                                <AuthButton type="primary" size="small" onClick={()=>this.editAddFn(record)}>编辑</AuthButton>
                                <AuthButton type="primary" danger size="small" disabled={record.status===1} onClick={()=>this.deleteFn(0,record)}>删除</AuthButton>
                            </div>   
                        }
                    ]}
                    rowSelection={rowSelection}
                    dataSource={tableData}
                    pagination={{current:currentPage, pageSize: pageSize,onChange:(page,pageSize)=>this.geTableData(page,pageSize), total:totalData }}
                    bordered
                    title={() => (
                      
                            <div className="operation-main">
                                <AuthButton type="primary"  onClick={()=>this.editAddFn()}>新增</AuthButton>
                                <AuthButton type="primary"  onClick={()=>this.deleteFn(2)}>批量删除</AuthButton>
                                <AuthButton type="primary"  onClick={()=>this.switchStatuFn(1)}>批量开启</AuthButton>
                                <AuthButton type="primary"  onClick={()=>this.switchStatuFn(2)}>批量禁用</AuthButton>
                                <Button type="primary" icon={<SyncOutlined/>} onClick={()=>this.geTableData(currentPage)}>刷新列表</Button>
                            </div>
                    )}
                />
                <EditAddCpt  editAddForm={editAddForm} 
                    modelLoading={this.state.modelLoading} 
                    submitCallback={this.submitCallback} ></EditAddCpt>
            </div>
        )
    }
}