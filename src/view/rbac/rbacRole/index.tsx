import ajax from "@/api/axios";
import AuthButton from "@/component/AuthButton";
import { dataFormat } from "@/util";
import { Button, message, Table, Tag } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import React, { Component } from "react"
import EditAddCpt from "./editAddCpt"
import DistributeAuthCpts from "./distributeAuthCpts";
function getRoletypeText(type?: number) {
    return type===1?<Tag color="#3b5999">系统预设</Tag>:<Tag color="#108ee9">普通角色</Tag>
}
function getStatusText(status:number){
    let bool = status === 1;
    return {color:bool?'green':'red',text:bool?"正常":"禁用"}
}

export default class RbacUser extends Component{
    state = {
     
        loading:false,
            //  列表数据
        tableData:[],
        totalData:0,
        currentPage:1,
        pageSize:30,
        search_key:"",//搜索关键词
        status:'',
        selectedRowKeys :[],//选择的key
        multipleSelection:[],//选择的数据

        editAddForm:{
            "id":'',
            "name": "",
            "desc":"",
            "status": true,
            "role_type":2,
            "sort":10 
        },
        modelLoading:false,
        modelLoading2:false,
        handleRoleId:'',
        
    }
    componentDidMount(){
        this.geTableData();
    }
    
    //获取表格数据
    geTableData(page=1){
        this.setState({loading:true,currentPage:page})
        ajax.GET('rbacRole',{page:page,offset:this.state.pageSize})
        .then(res=>{
            let {data} = res.data
            console.log(data)
            this.setState({tableData:data.rows,totalData:data.total,loading:false})
        }).catch(err=>{
            this.setState({loading:false})
            console.log(err)
        })
    }
    // 提交表单后回调
    submitCallback=(result:any)=>{
        this.setState({modelLoading:false,modelLoading2:false})
        if(result){
            let {currentPage} =this.state
            this.geTableData(currentPage)
        } 
    }
    //禁用开启
    switchStatuFn=(data:any)=>{
        console.log(data)
        // e.stopPropagation()
        ajax.POST("rbacRoleSwtich",{id:data.id,status:data.status===1?2:1}).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            let {currentPage} = this.state
            this.geTableData(currentPage)
        })
    }
    //删除角色
    deleteFn = (data:any)=>{
        if(data.role_type===1){
            return message.warning("系统预设角色无法删除")
        }
        ajax.POST("rbacRoleDelete",{id:data.id}).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            this.geTableData()
        })
    }
    //点击分配资源操作
    distributeAuthFn(roleId:number){
        this.setState({handleRoleId:roleId,modelLoading2:true})
    }
    // 编辑新增
    editAddFn(record?:any){
        let editAddForm={
            "id":'',
            "name": "",
            "desc":"",
            "status": true,
            "sort":10,
            "role_type":2 
        }
        console.log(record)
        if(record){
            editAddForm.id = record.id
            editAddForm.name = record.name
            editAddForm.desc = record.desc
            editAddForm.status=record.status===1?true:false
            editAddForm.role_type = record.role_type
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
            <div className="rbacuser-view">
                 <Table
                    loading={loading}
                    size="small"
                    rowKey={(record:any)=>record.id}
                    style={{"margin":"12px auto"}}
                    columns={[
                        {title: '序号',	dataIndex: 'id',	key: 'id',width:80},
                        {title: '角色名',	dataIndex: 'name',	key: 'name',width:120,align:'center'},
                        {title: '角色描述',	dataIndex: 'desc',	key: 'desc',width:180,align:'center'},
                        {title: '角色类型',	dataIndex: 'role_type',	key: 'role_type',width:150,align:'center',
                        render: (text: any, record:any) =>( getRoletypeText(record.role_type))
                        },
                        {title: '状态 ',  dataIndex: 'status',key:"status",width:80,align:'center',render:(text:any,record: any)=>{
                            let res = getStatusText(record.status)
                            return  <span style={{color:res.color}}>{res.text}</span>
                        }
                    },
                    {title: '创建时间',	dataIndex: 'createtime',	key: 'createtime',width:180,align:'center',
                        render:(text: any, record: any) => (<span>{dataFormat(record.createtime)}</span>)
                    },
                        {title: '操作',  dataIndex: 'operation',key:"operation", width: 280, fixed: 'right',
                        render:(text: any,record: any) =>
                            <div  className="operation-main">
                                <AuthButton type="primary" danger={record.status===1}  size="small" onClick={()=>this.switchStatuFn(record)}>{record.status===1?'禁用':'开启'}</AuthButton>
                                <AuthButton type="primary" size="small" onClick={()=>this.editAddFn(record)}>编辑</AuthButton>
                                <AuthButton type="primary" size="small" onClick={()=>this.distributeAuthFn(record.id)}>分配资源</AuthButton>
                                <AuthButton type="primary" danger size="small" disabled={record.status===1} onClick={()=>this.deleteFn(record)}>删除</AuthButton>
                            </div>   
                        }
                    ]}
                    rowSelection={rowSelection}
                    dataSource={tableData}
                    pagination={{current:currentPage, pageSize: pageSize,onChange:(page)=>this.geTableData(page), total:totalData }}
                    bordered
                    title={() => (
                        <div  className="operation-main">
                            <AuthButton type="primary"  onClick={()=>this.editAddFn()}>新增</AuthButton>
                            <Button type="primary" icon={<SyncOutlined/>} onClick={()=>this.geTableData(currentPage)}>刷新列表</Button>
                        </div>
                    )}
                />
                <EditAddCpt  editAddForm={editAddForm} 
                    modelLoading={this.state.modelLoading} 
                    submitCallback={this.submitCallback} ></EditAddCpt>
                    {/* modelLoading={this.state.modelLoading} 
                    submitCallback={this.submitCallback} */}

                {/* <DistributeAuthCpt
                    roleId={this.state.handleRoleId}
                    modelLoading={this.state.modelLoading2} 
                    submitCallback={this.submitCallback}
                ></DistributeAuthCpt> */}


                <DistributeAuthCpts roleId={this.state.handleRoleId}
                      modelLoading={this.state.modelLoading2} 
                      submitCallback={this.submitCallback}
                ></DistributeAuthCpts>
            </div>
        )
    }
}