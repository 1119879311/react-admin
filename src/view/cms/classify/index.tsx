import {   message, Table, Button, Modal } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import React from 'react';
import ajax from '@/api/axios';
import AuthButton from '@/component/AuthButton';
import getStatusText from '@/component/StatusButton';
import { dataFormat, oneToTree } from '@/util';
import EditAddCpt from './editAddCpt';


function initEditAddForm(){
    return {
        id:'',
        name:'',
        pid:'',
        sort:10,
        status:true
    }
}

export default class CmsClassify  extends React.Component {

    state = { 
        loading:false,
        orginTableList:[] as any[],
        tableList:[] as any[],
        selectedRowKeys:[] as any[],//选择的key
        openTableKeys:[],

        editAddForm : initEditAddForm(),
        modelLoading:false,
    }

    //获取所有数据
    geTableData =()=>{
        this.setState({loading:true})
        ajax.GET('cmsClassify',{isPage:true})
        .then(res=>{
            let {data} = res.data
            let openTableKeys = data.rows?.map((itme:any)=>itme.id)||[];
            this.setState({orginTableList:data.rows,tableList:oneToTree(data.rows),openTableKeys,loading:false})
        }).catch(err=>{
            this.setState({loading:false})
        })
    }
    // 添加/修改
    editAddFn=(data?:any)=>{
        // e.stopPropagation()
        let editAddForm = initEditAddForm()
        if(data){
            editAddForm.id=data.id;
            editAddForm.name=data.name
            editAddForm.pid =  data.pid
            editAddForm.sort = data.sort||10
            editAddForm.status=data.status===1
        }
        this.setState({editAddForm,modelLoading:true})
    }
    //禁用开启
    getSatusIdsFn = (type:number)=>{
        // 1:开启操作，找禁用的
        //2. 禁用操作，找开启的
        let {orginTableList,selectedRowKeys} = this.state
        let resFilter = orginTableList.filter((itme:any)=>itme.status!==type&&selectedRowKeys.includes(itme.id))
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
        ajax.POST("cmsClassifySwtich",postData).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            // let {currentPage} = this.state
            this.geTableData()
        })
    }

    deleteFn =(data:any)=>{
        Modal.confirm({ 
            content:"确定删除吗",
            onOk:(colseModal)=>{
                //单个
                ajax.POST("cmsClassifyDel",{id:data.id})
                .then(result=>{
                    colseModal()
                    let {data} = result
                    message.success(data.message||"操作成功")
                    this.geTableData()
                })
                .catch(_=>colseModal())
            }
        })  
    }
    onSelectChange =( selectedRowKeys:any[])  => {
        this.setState({selectedRowKeys})
    }
     // 提交表单后回调
     submitCallback=(result:any)=>{
        this.setState({modelLoading:false,modelLoading2:false})
        if(result){
            this.geTableData()
        } 
    }
    componentDidMount(){
        this.geTableData()
    }
    render() {
      let {tableList,openTableKeys,loading,selectedRowKeys} = this.state
      const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
       return (
          <>
            <Table 
            rowKey={(record:any)=>record.id}  
            loading={loading}
            rowSelection={rowSelection}
            bordered
            expandable={{defaultExpandedRowKeys:openTableKeys,rowExpandable:()=>true}}
                title={() => (
                <div className="operation-main">
                    <AuthButton authname="per-saveClassify" type="primary"  onClick={()=>this.editAddFn()}>新增分类</AuthButton>
                    <AuthButton authname="per-modifyStatusClassify" type="primary"  onClick={()=>this.switchStatuFn(1)}>批量开启</AuthButton>
                    <AuthButton authname="per-modifyStatusClassify" type="primary"  onClick={()=>this.switchStatuFn(2)}>批量禁用</AuthButton>
                    <Button type="primary" icon={<SyncOutlined/>} onClick={()=>this.geTableData()}>刷新列表</Button>
                </div>
            )}
            dataSource={tableList} columns={[
                { title: '名称', dataIndex: 'name',  key: 'name'},
                { title: '序号', dataIndex: 'id',  key: 'id',width:120},
                // {title: '上级id',	dataIndex: 'pid',	key: 'pid',width:80,align:'center'},
                {title: '排序',	dataIndex: 'sort',	key: 'sort',width:80,align:'center'},
                {title: '状态 ',  dataIndex: 'status',key:"status",width:80,align:'center',render:(text:any,record: any)=>getStatusText(record.status)
                },
                {title: '创建时间',	dataIndex: 'createtime',	key: 'createtime',width:180,align:'center',
                    render:(text: any, record: any) => (<span>{dataFormat(record.createtime)}</span>)
                },
                {title: '更新时间',	dataIndex: 'updatetime',	key: 'updatetime',width:180,align:'center',
                    render:(text: any, record: any) => (<span>{dataFormat(record.updatetime)}</span>)
                },
                {title: '操作',  dataIndex: 'operation',key:"operation",  fixed: 'right',width:240,
                render:(text: any,record: any) => 
                <div className="operation-main">
                    {/* <AuthButton type="primary"  onClick={()=>this.editAddFn(0,record)}>新增子分类</AuthButton> */}
                    <AuthButton authname="per-modifyStatusClassify" type="primary"  danger={record.status===1}  size="small" onClick={()=>this.switchStatuFn(0,record)}>{record.status===1?'禁用':'开启'}</AuthButton>
                    <AuthButton authname="per-saveClassify" type="primary"  onClick={()=>this.editAddFn(record)}>编辑</AuthButton>
                    <AuthButton authname="per-deleteClassify" type="primary" danger size="small" disabled={record.status===1} onClick={()=>this.deleteFn(record)}>删除</AuthButton>   
                </div>
                    
                }
            ]} />
        <EditAddCpt 
            modelLoading={this.state.modelLoading}
            parendSelect={this.state.tableList} 
            editAddForm={this.state.editAddForm}
            submitCallback={this.submitCallback}></EditAddCpt>
        </>
        );
  }
}