import { Col, Menu, message, Row, Table, TreeSelect,Dropdown } from 'antd';
import { AppstoreOutlined,DownOutlined } from '@ant-design/icons';
import React from 'react';
import ajax from '@/api/axios';
import AuthButton from '@/component/AuthButton';
import EditAddCpt from './editAddCpt';
const { TreeNode } = TreeSelect;
const { SubMenu } = Menu;
function getStatusText(status:number){
    let bool = status === 1;
    let color =bool?'green':'red'
    let text = bool?"正常":"禁用"
    return <span style={{color:color}}>{text}</span>
}
// 找下级的 权限数据
function findFirstChild(id:number,list:any[]){
    let res:any =[];
    let fn = (data:any[])=>{
        for(let i =0;i<data.length;i++){
            let itme = data[i];
            if(itme.id===id){
                console.log("itme----",itme.auths)
                res =  itme.auths||[];
                break;
            }else{
                fn(itme.children||[]);
            }
    
        }
    }
    fn(list)
    return res
}
//将菜单和功能权限分开
function splitGroupAuths(data:{[key:string]:any}[]){
    data.forEach((itme)=>{
        if(itme.children?.length){
            let auths:any[] = []
            let childs:any=[];
            for(let i=0;i<itme.children.length;i++){
                if(itme.children[i].auth_type===1){
                    childs.push(itme.children[i])
                }else{
                    itme.children[i].children=null;
                    auths.push(itme.children[i])
                }
            }

            itme['auths'] =  auths;
            itme.children = childs;
            splitGroupAuths(itme.children)
        }else{
            itme.children=null;
            itme.auths=[];
        }
    })  
}


function initEditAddForm(){
    return {
        id:'',
        title:'',
        signName:'',
        url:'',
        pid:'',
        auth_type:1,
        sort:10,
        status:true
    }
}
interface IOperationPorps {
    itmes:{[key:string]:any}
    auth_type:number,
    editAddFn:Function,
    switchStatuFn:Function
}

const OperationCpt = (props:IOperationPorps)=>{
    let  {itmes,auth_type,switchStatuFn,editAddFn} = props
    const meun = <Menu>
                    <Menu.Item>
                         <AuthButton type="primary" danger={itmes.status===1} onClick={(e:any)=>{switchStatuFn(e,itmes)}}  size="small">{itmes.status===1?'禁用':'开启'}</AuthButton>
                    </Menu.Item>
                    <Menu.Item>
                        <AuthButton type="primary" size="small" onClick={(e:any)=>editAddFn(e,auth_type,itmes)}>[查看|编辑]</AuthButton>
                    </Menu.Item>
                </Menu>
    return  <Dropdown overlay={meun} placement="bottomLeft" arrow><span  onClick={e => e.preventDefault()}>
   操作 <DownOutlined /></span></Dropdown>
}      

export default class RbacAuth  extends React.Component {
    clickIndex=0
    state = { 
         authsList:[],
         tableList:[],
         editAddForm : initEditAddForm(),
        modelLoading:false,
    }
    componentWillUnmount() {
        this.setState = () => false;
    }

    //点击菜单获取右边显示的权限列表
    onTitleClick = (e:Event,data:any)=>{
        // e.stopPropagation()
        // 如果子节点是菜单跳过
        if(!data.children?.length||data.auths?.length){
            this.clickIndex = data.id;
            this.setState({tableList:data.auths})
        }
       
    }
    //获取权限所有数据
   getAuthsList =()=>{
        ajax.GET('rbacAuth')
        .then(res=>{
            let {data} = res.data||[]
            console.log(data)
           
            splitGroupAuths(data)
            let tableList=[];
            if(this.clickIndex!==0){
                tableList = findFirstChild(this.clickIndex,data);
            }
            this.setState({authsList:data,tableList:tableList})
        })
    }
    // 添加/修改
    editAddFn=(e:Event,auth_type:number,data?:any)=>{
        e.stopPropagation()
        let editAddForm = initEditAddForm()
        editAddForm.auth_type = auth_type
        if(data){
            editAddForm.id=data.id;
            editAddForm.title=data.title
            editAddForm.signName=data.signName
            editAddForm.url = data.url
            editAddForm.pid =  data.pid
            editAddForm.sort = data.sort||10
            editAddForm.status=data.status===1
        }
        this.setState({editAddForm,modelLoading:true})
    }
    //禁用开启
    switchStatuFn=(e:Event,data:any)=>{
        console.log(data)
        e.stopPropagation()
        ajax.POST("rbacAuthSwtich",{id:data.id,status:data.status===1?2:1}).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            this.getAuthsList()
        })
    }
     // 提交表单后回调
     submitCallback=(result:any)=>{
        this.setState({modelLoading:false,modelLoading2:false})
        if(result){
            this.getAuthsList()
        } 
    }
    componentDidMount(){
        this.getAuthsList()
    }
    //渲染菜单列表
    menuItme = (data:any[])=>{
        return data.map(itmes=>{
            let bool = itmes.children?.length&&itmes.children[0]?.auth_type===1;
            return bool?<SubMenu
                key={itmes.signName}
                title={
                <div style={{display:"flex",justifyContent:'space-between',alignItems:"center"}}>
                   <span onClick={(e:any)=>this.onTitleClick(e,itmes)}>
                        <AppstoreOutlined />
                        <span>{itmes.title}&nbsp;&nbsp;({getStatusText(itmes.status)})</span>
                   </span>
                   <OperationCpt 
                        itmes={itmes}
                        auth_type={1}
                        switchStatuFn={this.switchStatuFn}
                        editAddFn={this.editAddFn}
                    />
                </div>
                }>
                {this.menuItme(itmes.children)}
            </SubMenu>:(itmes.auth_type===1?<Menu.Item key={itmes.signName} data-children={itmes.children}>
                <div style={{display:"flex",justifyContent:'space-between',alignItems:"center"}}>
                    <span onClick={(e:any)=>this.onTitleClick(e,itmes)}>
                        <AppstoreOutlined />
                        <span> {itmes.title}&nbsp;&nbsp;({getStatusText(itmes.status)})</span>
                    </span> 
                    <OperationCpt 
                        itmes={itmes}
                        auth_type={1}
                        switchStatuFn={this.switchStatuFn}
                        editAddFn={this.editAddFn}
                    />
                   
                </div>
            </Menu.Item>:'')
        })
     
    }
    loopTreeItme = (data:any[])=>{
        return data.map(itme=>{
            let bool= itme.children?.length;
            return itme.auth_type===1?<TreeNode value={itme.id} title={itme.title}> 
               { bool?this.loopTreeItme(itme.children):''}
            </TreeNode>:''
        })
    }

    render() {
      let {authsList,tableList} = this.state
       return (
          <>
            <Row gutter={20}>
            <Col span={7} >
                <div style={{background: "#fff", padding: "16px",borderBottom: "1px solid #f0f2f5"}}>
                    <AuthButton type="primary" size="small" onClick={(e:any)=>this.editAddFn(e,1)}>新增菜单</AuthButton>
                </div>
                <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
            >
                {this.menuItme(authsList)}
            
            </Menu>
            </Col>
            <Col span={17}>

                <Table  rowKey={(record:any)=>record.id}  
                 title={() => (
                    <div>
                        <AuthButton type="primary" size="small" onClick={(e:any)=>this.editAddFn(e,2)}>新增权限</AuthButton>
                    </div>
                )}
                dataSource={tableList} columns={[
                    { title: '权限id', dataIndex: 'id',  key: 'id',width:120,align:"center"},
                    { title: '权限名称', dataIndex: 'title',  key: 'title'},
                    { title: '权限标识', dataIndex: 'signName',  key: 'signName'},
                    { title: '权限链接', dataIndex: 'url',  key: 'url'},
                    { title: '权限状态', dataIndex: 'status',  key: 'status',render:(text:any,record: any)=>getStatusText(record.status)},
                    {title: '操作',  dataIndex: 'operation',key:"operation",  fixed: 'right',
                    render:(text: any,record: any) =>
                         <OperationCpt 
                            itmes={record}
                            auth_type={2}
                            switchStatuFn={this.switchStatuFn}
                            editAddFn={this.editAddFn}
                         />
                     
                    }
                ]} />
            </Col>
        </Row>
        <EditAddCpt 
            modelLoading={this.state.modelLoading}
            authList={this.state.authsList} 
            editAddForm={this.state.editAddForm}
            submitCallback={this.submitCallback}></EditAddCpt>
        </>
        );
  }
}