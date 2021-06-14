import ajax from "@/api/axios";
import { Button, Checkbox, message, Modal, Table } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react"

interface Iprops {
    roleId:number|string
    modelLoading?:boolean,
    submitCallback?:(value:boolean)=>void
}
const getAllAuthIds = (list: any[], key = "id", res = ([] as Array< string>)) => {
    for (let i = 0; i < list.length; i++) {
        res.push(list[i][key]+'')
        list[i].children && getAllAuthIds(list[i].children, key, res)
    }
    return res
}
const DistributeAuthCpts = (props:Iprops) => {
    let {roleId,modelLoading,submitCallback=()=>{}} = props
    const [authsList, setAuthsList] = useState<any[]>([]);
    const [checkedAllKeys, setCheckedAllKeys] = useState<Array<string>>([]);
    const [checkedKeys, setCheckedKeys] = useState<Array<string>>(['1']);

    const [checkAll, setCheckAll] = useState(false)

    //获取所有权限数据
    const getAuthsList = () => {
        ajax.GET('rbacAuth')
            .then(res => {
                let { data } = res.data
                console.log(data)
                setCheckedAllKeys(getAllAuthIds(data || [], "id"))
                setAuthsList(data)
            })
    }

    //获取角色的所属权限
    const distributeAuthFn = (roleId: number | string) => {

        ajax.GET('rbacRole', { id: roleId })
            .then(res => {
                let { data } = res.data
                let authIds = data.auths?.map((itme: { id: any; }) => itme.id+'')
                setCheckedKeys(authIds)
            })
    }
    function onChangeGroup() {
        setCheckedKeys((oldval:string[])=>oldval)
    }
    function onChageSige(e: CheckboxChangeEvent, row?: any,group?:boolean) {
        console.log("onChageSige= ", e.target.checked)
        let resKeys = [row.id+''];
        if(group){
            resKeys = [...getAllAuthIds(row.children || [], "id"),...resKeys];
        }
        console.log("resKeys:",resKeys)
        if( e.target.checked){
            let arrSet = new Set([...resKeys,...checkedKeys])
            setCheckedKeys(Array.from(arrSet))
        }else{
          let arrSet=  new Set([...checkedKeys].filter(x => !resKeys.includes(x)))
          setCheckedKeys(Array.from(arrSet))
        }
    }

    
    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setCheckAll( !checkAll)
        if(e.target.checked){
            setCheckedKeys(checkedAllKeys)
        }else{
            setCheckedKeys([])
        }
    };

    const submint = ()=>{
        console.log("submint",checkedKeys)
        ajax.POST("rbacTasksAuthority",{authIds:checkedKeys.join(","),id:roleId}).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
            submitCallback(false)
        })
    }
    useEffect(()=>{
        if(roleId){
            distributeAuthFn(roleId)
            setCheckAll( false)
        }
    },[roleId])

    useEffect(() => {
        getAuthsList()
    }, [])

    return <div>

<Modal
        getContainer={false}
        title={ <div><span>分配资源</span> &nbsp; &nbsp; <Checkbox onChange={onCheckAllChange} checked={checkAll}  > 全选</Checkbox> </div>}
        centered
        visible={modelLoading}
        okText="提交"
        cancelText="取消"
        onOk={() =>submint()}
        onCancel={() => submitCallback(false)}
        width={960}
       
    >
       
        
        <Checkbox.Group style={{ width: '100%' }} onChange={onChangeGroup} value={checkedKeys} >
            <Table 
                indentSize={20}
                rowKey={(record: any) => record.id}
                pagination={false}
                bordered
                expandable={{ 
                    defaultExpandedRowKeys: [],
                    expandIcon: ({ expanded, onExpand, record }) => {
                        let isMeunChild: any[] = record.children?.filter((itme: any) => itme.auth_type === 1) || [];
                        return  isMeunChild.length? 
                            (expanded ? ( <Button className="by-btnion-sm" size="small" icon={<MinusOutlined/>} onClick={e => onExpand(record, e)} /> ) 
                            : (<Button className="by-btnion-sm" size="small" icon={<PlusOutlined/>} onClick={e => onExpand(record, e)} />))
                            :<Button className="by-btnion-sm"></Button>
                    }
                       
                }}
               
                dataSource={authsList} columns={[
                    {
                        title: '菜单', dataIndex: 'title', key: 'title', width: 320,
                        render: (text: any, record: any) => {
                            return {
                            children: <Checkbox disabled={record.status===1?false:true} onChange={(e) => onChageSige(e, record,true)} value={record.id+''}><span>{record.title}【{record.auth_type === 1 ? '菜单' : '权限'}】</span></Checkbox>,
                                props: {
                                    rowSpan: record.auth_type === 1 ? 1 : 0
                                }
                            }
                        }
                    },
                    {
                        title: '权限', dataIndex: 'title', key: 'id', align: 'center', render: (text, record, index) => {
                            let auths: any[] = record.children?.filter((itme: any) => itme.auth_type === 2) || [];
                            return {
                            children: <div className="m-flex flex-wrap by-group-checkbox"> {auths.map((itme: any) => <Checkbox disabled={record.status===1?false:true} onChange={(e) => onChageSige(e, itme)}  key={itme.id} value={itme.id+''}><span className="itme" >{itme.title}</span></Checkbox>)} </div>,
                                props: {
                                    rowSpan: auths.length || record.auth_type === 1 ? 1 : 0
                                },
                            }
                        }
                    }
                ]} />
        </Checkbox.Group>
        </Modal>
        </div>
}

export default DistributeAuthCpts