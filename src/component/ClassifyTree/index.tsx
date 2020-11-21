import React from "react"
import {TreeSelect} from "antd"
const { TreeNode } = TreeSelect;
 export const loopTreeItme = (data: any[]) => {
    return data.map(itme => {
        let bool = itme.children?.length;
        return  <TreeNode key={itme.id} value={itme.id} title={itme.name}>
            {bool ? loopTreeItme(itme.children) : ''}
        </TreeNode> 
    })
}

const ClassifyTree = (props:{data:any[],children?:any,style?:React.CSSProperties})=>{

    return  <TreeSelect
            showSearch
            style={props.style}
            dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            treeNodeFilterProp="title"
        >
            {props.children?props.children:''};
            {loopTreeItme(props.data)}
        </TreeSelect>
}

export default ClassifyTree