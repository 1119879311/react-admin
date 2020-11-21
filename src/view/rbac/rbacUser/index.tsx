import ajax from "@/api/axios";
import AuthButton from "@/component/AuthButton";
import { dataFormat } from "@/util";
import { Table ,Tag,Button, message, Modal} from "antd";
import React, { Component, createRef } from "react"
import EditAddCpt from "./editAddCpt"
import SearchCpt from "./searchCpt";
import { SyncOutlined,CheckCircleOutlined,MinusCircleOutlined  } from '@ant-design/icons';
 
function getUsertypeText(type?: number) {
    if (type === 1) {
        return <Tag color="#3b5999">超级用户</Tag>
    } else if (type === 2) {
        return <Tag color="#2db7f5">系统用户</Tag> 
    } else {
        return <Tag color="#108ee9">普通用户</Tag>  
    }
}
function getStatusText(status:number,user_type?:number){
    let bool = user_type===1||status === 1;
    return {color:bool?'green':'red',text:bool?"正常":"禁用"}
}
function resetEditAddForm(){
    return {
        id:'',
        name:"",
        password:'',
        email:'',
        contact:'',
        user_type:'',
        roleIds:[],
        status:false,
       
    }
}
interface ISearchRefOption {
    getSearchData:()=>any
}

export default class RbacUser extends Component{
    private _searchCptRef = createRef<ISearchRefOption>(); //初始化ref 
    public get searchCptRef() {
        return this._searchCptRef;
    }
    public set searchCptRef(value) {
        this._searchCptRef = value;
    }
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

        editAddForm:resetEditAddForm(),
        modelLoading:false,
        // rolesList:[]
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    componentDidMount(){
        this.geTableData();
    }
    
    //获取表格数据
    geTableData=(page=1)=>{
        console.log(this.searchCptRef.current?.getSearchData())
        let searOpt = this.searchCptRef.current?.getSearchData()||{}
        this.setState({loading:true,currentPage:page})
        ajax.GET('rbacUser',{page:page,offset:this.state.pageSize,...searOpt})
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
        this.setState({modelLoading:false})
        if(result){
            this.geTableData(this.state.currentPage)
        } 
    }
     //禁用开启
     getSatusIdsFn = (type:number)=>{
        // 1:开启操作，找禁用的
        //2. 禁用操作，找开启的
        let {tableData,selectedRowKeys} = this.state as {[key:string]:any}
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
        ajax.POST("rbacUserSwtich",postData).then(result=>{
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
                ajax.POST("rbacUserDel",postData)
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
    //  switchStatuFn=(data:any)=>{
    //     console.log(data)
    //     // e.stopPropagation()
    //     ajax.POST("rbacUserSwtich",{id:data.id,status:data.status===1?2:1}).then(result=>{
    //         let {data} = result
    //         message.success(data.message||"操作成功")
    //         let {currentPage} = this.state
    //         this.geTableData(currentPage)
    //     })
    // }
    // 编辑新增
    editAddFn(record?:any){
        let editAddForm = resetEditAddForm()
        console.log(record)
        if(record){
            editAddForm.id = record.id
            editAddForm.name = record.name
            editAddForm.roleIds = record.roles.map((itme:any)=>itme.id)
            editAddForm.status = record.status===1?true:false
            editAddForm.user_type=record.user_type
            editAddForm.email=record.email
            editAddForm.contact=record.contact
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
                <SearchCpt ref={this.searchCptRef} submitCallback={this.geTableData}/>
                 <Table
                    loading={loading}
                    size="small"
                    rowKey={(record:any)=>record.id}
                    style={{"margin":"12px auto"}}
                    rowSelection={rowSelection}
                    dataSource={tableData}
                    pagination={{current:currentPage, pageSize: pageSize,onChange:(page)=>this.geTableData(page), total:totalData }}
                    bordered
                    title={() => (
                        <div className="operation-main">
                            <AuthButton type="primary"  onClick={()=>this.editAddFn()}>新增</AuthButton>
                            <AuthButton type="primary"  onClick={()=>this.deleteFn(2)}>批量删除</AuthButton>
                            <AuthButton type="primary"  onClick={()=>this.switchStatuFn(1)}>批量开启</AuthButton>
                            <AuthButton type="primary"  onClick={()=>this.switchStatuFn(2)}>批量禁用</AuthButton>
                            <Button type="primary" icon={<SyncOutlined/>} onClick={()=>this.geTableData(currentPage)}>刷新</Button>
                        </div>
                    )}
                    columns={[
                        {title: '序号',	dataIndex: 'id',	key: 'id',width:80},
                        {title: '用户名',	dataIndex: 'name',	key: 'name',width:120,align:'center'},
                        {title: '联系方式',	dataIndex: 'contact',	key: 'contact',width:180,align:'center'},
                        {title: '邮箱',	dataIndex: 'email',	key: 'email',width:180,align:'center'},
                        {title: '创建者',	dataIndex: 'parent',	key: 'parent',width:150,align:'center',
                        render: (text: any, record:any) =><> {record.parent?record.parent.name:''} </>
                        },
                        {title: '用户类型',	dataIndex: 'user_type',	key: 'user_type',width:150,align:'center',
                        render: (text: any, record:any) =>( getUsertypeText(record.user_type))
                        },
                        {title: '所属角色',	dataIndex: 'roles',	key: 'roles',width:150,align:'center',
                            render: (roles: any[]) => roles.map((itme:any)=><Tag key={itme.id} icon={itme.status===1?<CheckCircleOutlined />:<MinusCircleOutlined /> } color={itme.status===1?'success':'default'}>{itme.name}{itme.role_type===1?'[系统预设]':''}</Tag> )
                        },
                        {title: '状态 ',  dataIndex: 'status',key:"status",width:80,align:'center',render:(text:any,record: any)=>{
                            let res = getStatusText(record.status,record.user_type)
                            return  <span style={{color:res.color}}>{res.text}</span>
                        }
                    },
                    {title: '创建时间',	dataIndex: 'createtime',	key: 'createtime',width:180,align:'center',
                        render:(text: any, record: any) => (<span>{dataFormat(record.createtime)}</span>)
                    },
                    {title: '操作',  dataIndex: 'operation',key:"operation", width: 320, fixed: 'right',
                        render:(text: any,record: any) =>
                            <> {
                                record.user_type!==1?<div  className="operation-main">
                                <AuthButton type="primary" danger={record.status===1}  size="small" onClick={()=>this.switchStatuFn(0,record)}>{record.status===1?'禁用':'开启'}</AuthButton>

                                {/* <AuthButton type="primary" danger={record.status===1}  size="small" onClick={()=>this.switchStatuFn(record)}>{record.status===1?'禁用':'开启'}</AuthButton> */}
                                <AuthButton type="primary" size="small" onClick={()=>this.editAddFn(record)}>编辑</AuthButton>
                                <AuthButton type="primary" danger size="small" disabled={record.status===1} onClick={()=>this.deleteFn(0,record)}>删除</AuthButton>
                            </div>:''
                            }</>
                               
                    }
                    ]}
                />
                <EditAddCpt 
                    editAddForm={editAddForm} 
                    modelLoading={this.state.modelLoading} 
                    // rolesList={this.state.rolesList}
                    submitCallback={this.submitCallback} 
                ></EditAddCpt>
            </div>
        )
    }
}