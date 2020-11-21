import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
// import { Upload } from 'antd'
import { FormInstance } from 'antd/lib/form'
import ajax from '@/api/axios'
interface Iprops {
    form:React.RefObject<FormInstance<any>>
}
export default class BraftEditorCpt extends React.Component<Iprops> {  
  state = {
    editorState: null
  }
  componentDidMount(){
      setTimeout(()=>{
        this.setState({ editorState: BraftEditor.createEditorState(this.props.form.current?.getFieldValue('content'))})  
      },0)

  }
  handleChange = (editorState:any) => {
    this.setState({ editorState })
    this.props.form.current?.setFieldsValue({'content':editorState.toHTML()})
  }

  uploadHandler = (param:any) => {
    console.log(param.file)
    if (!param.file) {
      return false
    }
    let postData = new FormData()
    postData.append("type",'article')
    postData.append("files",param.file)
    ajax.POST("uploadAll",postData, {
        'Content-Type': 'multipart/form-data'
     }).then(respose=>{
        let {data} = respose.data||[];
        let resArr = data.map((itme:any)=>{
            return {url:itme,type:"IMAGE"}
        })
        this.setState({
            editorState: ContentUtils.insertMedias(this.state.editorState,resArr)
        })
        console.log(data)
    })
    // [{
    //     type: 'IMAGE',
    //     url: URL.createObjectURL(param.file)
    // }]
  
  }
  uploadFn=(param:any)=>{
    console.log(param)
    let postData = new FormData()
    postData.append("type",'articleImg')
    postData.append("files",param.file)
    ajax.POST("uploadArticle",postData, {
        'Content-Type': 'multipart/form-data'
     }).then(respose=>{
        let {data} = respose.data||[];
        console.log(data[0])
        param.success({url:data[0]})
    })
   
  }
  render () {

    return (
      <div>
        <div className="editor-wrapper">
          <BraftEditor
            value={this.state.editorState}
            onChange={this.handleChange}
            placeholder="请输入正文内容"
            media={{uploadFn:this.uploadFn}}
            style={{ borderRadius: 5, border: '1px solid #d1d1d1' }}
            // controls={['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator','media']}
            // extendControls={[
            //     {
            //       key: 'antd-uploader',
            //       type: 'component',
            //       component: (
            //         <Upload
            //           accept="image/*"
            //           showUploadList={false}
            //           customRequest={this.uploadHandler}
            //         >
            //           {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            //           <button type="button" className="control-item button upload-button" data-title="插入图片">
            //             插入图片
            //           </button>
            //         </Upload>
            //       )
            //     }
            //   ]}
          />
        </div>
      </div>
    )

  }

}