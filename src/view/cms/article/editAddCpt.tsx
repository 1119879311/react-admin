import { FormInstance } from "antd/lib/form";
import {Button, Form, Input, InputNumber, message, Select, Switch, TreeSelect, Upload} from "antd"
import { PlusOutlined,SyncOutlined } from '@ant-design/icons';
import React, {Component } from "react"
import {  RouteComponentProps,withRouter } from "react-router-dom"
import BraftEditorCpt from "./braftEditorCpt"
import ajax from "@/api/axios";
import { oneToTree, signRonder } from "@/util";
import {loopTreeItme} from "@/component/ClassifyTree";
const { TreeNode } = TreeSelect;
const { Option } = Select;
const layout = {  labelCol: { span: 3 }, wrapperCol: { span: 20 },};


interface IPorps extends  RouteComponentProps {}


function initEditAddForm(){
    return {id:'',title:"",content:"",remark:"",thuming:[],cid:'',tagIds:[],sort:10,status:true}
}

interface Istate {
    loading:boolean
    tagsList:any[],
    classifyList:any[]
}

class EditAddCpt extends Component<IPorps,Istate> {
    formRef = React.createRef<FormInstance>();
    key=1
    state = {
        loading:true,
        tagsList:[],
        classifyList:[]
    }

    onFinish = (value?:any)=>{

        console.log(value)
        let postData = {
            id:value.id,
            title:value.title,
            remark:value.remark,
            content:value.content,
            cid:value.cid||null,
            sort:value.sort,
            status:value.status===true?1:2,
            tagIds:value.tagIds?value.tagIds.join(','):"",
            thumimg:value.thuming?value.thuming.map((itme:any)=>itme.url).join(','):''
        }
        ajax.POST("cmsArticleSave",postData).then(result=>{
            let {data} = result
            message.success(data.message||"操作成功")
        })
        console.log(postData)
    
    }
    normFile = (e:any) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    };
    filterthuming(){
        let data = this.formRef.current?.getFieldValue("thuming") as any[]||[];
        let oldData = [];
        let waitup =[]
        for(let i=0;i<data.length;i++){
           if(data[i].url){
            oldData.push(data[i])
           }else{
            waitup.push(data[i].originFileObj)
           }
        }
        return {oldData, waitup}
    }
    uploadHandler=(params:any)=>{
        let {data={},file} = params
        let postData = new FormData()
        postData.append("type",data.type)
        postData.append("files",file)
        ajax.POST("uploadAll",postData, {
            'Content-Type': 'multipart/form-data'
         }).then(respose=>{
            let {data} = respose.data||[];

            let {oldData} = this.filterthuming()
            console.log(data)
            let resArr = data.map((itme:any)=>{
                return {url:itme,uid:signRonder(10)}
            })
            this.formRef.current?.setFieldsValue({thuming:[...oldData,...resArr]})
            console.log(data)
        })
    }
    getTagsList(){
        ajax.GET('cmsTag',{isPage:true})
        .then(res=>{
            let {data} = res.data
            console.log(data)
            this.setState({tagsList:data.rows})
        }).catch(err=>{
            this.setState({loading:false})
            console.log(err)
        })
    }
    getClassifyList =()=>{
        this.setState({loading:true})
        ajax.GET('cmsClassify',{isPage:true})
        .then(res=>{
            let {data} = res.data
            this.setState({classifyList:oneToTree(data.rows)})
        }).catch(err=>{
            this.setState({loading:false})
        })
    }
    getDataDetail(params:any){
        console.log( params)
        if(!params||!params.id) return
        this.key++
        this.setState({loading:true})
        if(params.id==='no'){
            this.formRef.current?.setFieldsValue(initEditAddForm())
            this.setState({loading:false})
        }else{
            ajax.GET("cmsArticle",{id:params.id})
            .then(res=>{
                let {data} = res.data
                console.log(data)
                
                this.formRef.current?.setFieldsValue({
                    id:data.id,
                    title:data.title,
                    remark:data.remark,
                    content:data.content,
                    cid:data.classify?data.classify.id:'',
                    tagIds:data.tags&&data.tags.map((itme:any)=>itme.id),
                    sort:data.sort,
                    status:data.status===1?true:false,
                    thuming:data.thumimg?data.thumimg.split(',').map((itme:any)=>{ return {url:itme,uid:signRonder(10)}}):[]
                })
                this.setState({loading:false})
            }).catch(err=>{
               console.log(err)
            })
        }
    }
    componentWillReceiveProps(nprops:any){
       
        this.init(nprops.match.params)
       
    }
    init(params:any){
        this.getClassifyList();
        this.getTagsList()
        this.getDataDetail(params)
    }
    componentDidMount(){
        this.init(this.props.match.params)
        // this.getClassifyList();
        // this.getTagsList()
        // this.getDataDetail(this.props.match.params)
        
    }
    render(){
        let {loading,classifyList,tagsList} = this.state
        console.log(classifyList)
        return <div style={{width:1050,margin:"auto",background:"#fff",padding:"20px 20px 40px"}}>
            <div className="operation-main">
                <Button type="primary" icon={<SyncOutlined/>} onClick={()=>this.init(this.props.match.params)}>刷新数据</Button>
            </div>
            <br/>
            <Form
                {...layout}
                ref={this.formRef}
                name="basic"
                initialValues={{ ...initEditAddForm() }}
                onFinish={this.onFinish}
            >
            
                <Form.Item label="序号id" name="id">
                    <Input disabled />
                </Form.Item> 
          
                <Form.Item label='标题' name="title"
                    rules={[{ required: true, message: '请输入标题!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label='简述' name="remark" >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="分类" name="cid">
                    {/* <ClassifyTree data={classifyList}>
                     <TreeNode value={0} title="无"></TreeNode>
                    </ClassifyTree> */}
                <TreeSelect
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
                    </TreeSelect>
                </Form.Item>
                
                <Form.Item
                name="tagIds"
                label="标签"
            >
                <Select mode="multiple" >
                {tagsList.map((itme:any)=> <Option key={itme.id} disabled={itme.status!==1} value={itme.id}>{itme.name}</Option> )}
                </Select>
            </Form.Item>

                <Form.Item label="缩略图" > 
                    <Form.Item  
                                name="thuming" 
                                valuePropName="fileList"
                                getValueFromEvent={this.normFile}
                            >
                                {/* <Upload beforeUpload={()=>false}  name="articlethuming" multiple  listType="picture-card"> */}
                                <Upload accept="image/*" customRequest={this.uploadHandler} data={{type:"thuming"}}  name="articlethuming" multiple  listType="picture-card">

                            <PlusOutlined />
                    </Upload>
                </Form.Item>
                  
                    {/* <Button icon={<UploadOutlined />} onClick={this.sureUpload}>确定上传</Button> */}
                </Form.Item>

                <Form.Item name="sort" label="排序" >
                    <InputNumber />
                </Form.Item>

                <Form.Item name="status" label="状态" valuePropName="checked" >
                    <Switch checkedChildren="开" unCheckedChildren="关" />
                </Form.Item>

                <Form.Item label="正文"  >
                   {loading?'加载中内容...':
                    <Form.Item name="content"  rules={[{ required: true, message: '请输入内容!' }]} >
                    <BraftEditorCpt form={this.formRef} key={this.key} />
                 </Form.Item>} 
                </Form.Item>
               

                <div className="m-flex m-center">
                    <Button type="primary" htmlType="submit" block> 提交 </Button>
                </div>
            </Form>
        </div>
    }
}
export default withRouter(EditAddCpt)