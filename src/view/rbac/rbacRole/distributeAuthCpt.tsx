import React, { useEffect, useState } from "react"
import { Modal, Tree ,Checkbox, message } from "antd";
// import AuthButton from "@/component/AuthButton";
import ajax from "@/api/axios";
const { TreeNode } = Tree;
interface Iprops {
    roleId:number|string
    modelLoading?:boolean,
    submitCallback?:(value:boolean)=>void
}
const getAllAuthIds = (list:any[],key="id",res=([] as Array<string|number>) )=>{
    for(let i=0;i<list.length;i++){
        res.push(list[i][key]+'')
        list[i].children&&getAllAuthIds(list[i].children,key,res)
    }
    return res
}
const renderNodes = (data:any) => {
    return data.map((item:any) => {
      if (item.children) {
        return (
          <TreeNode
            data-did={item.auth_type === 2 ? "by-tree-itme-main" : ""}
            title={<div className="by-tree">{item.title}【{item.auth_type===1?'菜单':'权限'}】</div>}
            key={item.id}
            disabled={item.status!==1}
          >
            {renderNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          disabled={item.status!==1}
          {...item}
          data-did={item.auth_type === 2 ? "by-tree-itme-main" : ""}
        />
      );
    });
  };


const DistributeAuthCpt = (props:Iprops) => {
  let {roleId,modelLoading,submitCallback=()=>{}} = props

  const [authsList, setAuthsList] = useState<any[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<Array<string|number>>([]);

//   const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkAll,setCheckAll] = useState(false)


   //获取所有权限数据
   const getAuthsList =()=>{
        ajax.GET('rbacAuth')
        .then(res=>{
            let {data} = res.data
            console.log(data)
            setAuthsList(data)
        })
    }

    //获取角色的所属权限
    const distributeAuthFn=(roleId:number|string)=>{
        
        ajax.GET('rbacRole',{id:roleId})
        .then(res=>{
            let {data} = res.data
            let authIds = data.auths?.map((itme: { id: any; })=>itme.id+'')
            setCheckedKeys(authIds)
        })
    }

  const onCheck = (checkedKey:any,e:any) => {
    console.log("onCheck", e);
   
    let setkey = checkedKey.checked?checkedKey.checked:checkedKey
    // setCheckedKeys(setkey)
   
    let resKeys = getAllAuthIds(e.node.children||[],"key")
    if(e.checked){
        let arrSet = new Set([...resKeys,...setkey])
        setCheckedKeys(Array.from(arrSet))
    }else{
      let arrSet=  new Set([...setkey].filter(x => !resKeys.includes(x)))
      console.log(Array.from(arrSet))
      setCheckedKeys(Array.from(arrSet))
    }
   
  };


  const onCheckAllChange = ()=>{
        setCheckAll( !checkAll)
        if(!checkAll){
            setCheckedKeys(getAllAuthIds(authsList));
        }else{
            setCheckedKeys([])  
        }
  }
  const submint = ()=>{
        console.log("submint",checkedKeys)
        ajax.POST("rbacTasksAuthority",{authIds:checkedKeys.join(","),id:roleId}).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            submitCallback(false)
        })
    }
    useEffect(()=>{
    // setCheckedKeys(authIds);
        if(roleId){
            distributeAuthFn(roleId)
            setCheckAll( false)
        }
    },[roleId])

  useEffect(()=>{
    getAuthsList()
  },[])


  return (

    <Modal
        getContainer={false}
        title='分配资源'
        centered
        visible={modelLoading}
        okText="提交"
        cancelText="取消"
        onOk={() =>submint()}
        onCancel={() => submitCallback(false)}
        width={860}
       
    >
        <Checkbox
            onClick={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
          <br/>
        <Tree
            checkable
            // onExpand={onExpand}
            // expandedKeys={expandedKeys}
            autoExpandParent={true}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            // onSelect={onSelect}
            // selectedKeys={selectedKeys}
            checkStrictly={true}
            defaultExpandAll={true}
            // defaultExpandParent={true}
            
          >{renderNodes(authsList)}
          </Tree>
    <br/>
    {/* <AuthButton type="primary" onClick={submint}>确定</AuthButton> */}
    </Modal>
  );
};
export default DistributeAuthCpt