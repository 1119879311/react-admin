import 'braft-editor/dist/index.css'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import BraftEditor, { MediaType } from 'braft-editor'
import { FormInstance } from 'antd/lib/form'
import ajax from '@/api/axios'

interface Iprops {
    form: FormInstance<any>
}

const BraftEditorCpt = (props: Iprops, ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined) => {
    const { form } = props
    let initData = BraftEditor.createEditorState(form.getFieldValue("content"))
    const [content, setContent] = useState(initData)
    const contentRef = useRef(initData.toHTML())
    useEffect(() => {
        contentRef.current = content.toHTML();
    }, [content])

    useImperativeHandle(ref, () => {
        return {
            getContent: () => {
               let reg = /^<p>(.*)<\/p>/;
               let resContent = (contentRef.current as string).match(reg)
               if(resContent&&resContent[1].trim()){
                form.setFieldsValue({content:contentRef.current})
               }else{
                form.setFieldsValue({content:''})
               }
            }
        };//使用方法获取最新的表单数据
    })

    const handleChange = (editorState: any) => {
        setContent(editorState)
    }
    const uploadFn: MediaType['uploadFn'] = (param: any) => {
        console.log(param)
        let postData = new FormData()
        postData.append("type", 'articleImg')
        postData.append("files", param.file)
        ajax.POST("uploadAll", postData, {
            'Content-Type': 'multipart/form-data'
        }).then(respose => {
            let { data } = respose.data || [];
            console.log(data[0])
            param.success({ url: data[0] })
        })
    }
    return <div className="editor-wrapper">
        <BraftEditor
            value={content}
            onChange={handleChange}
            placeholder="请输入正文内容"
            media={{ uploadFn: uploadFn }}
            style={{ borderRadius: 5, border: '1px solid #d1d1d1' }}
        />
       
    </div>
}
export default forwardRef(BraftEditorCpt)
