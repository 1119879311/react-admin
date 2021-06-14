import React, { useRef } from "react"
import HooksChild from "./hooksChild"
export interface IChildRef {
    toGet:()=>any,
    divRef:HTMLDivElement
}

// 示例： hooks 父组件获取 hooks 子组件内部暴露的属性和方法 Ref
const HooksParent = ()=>{
    const childRef = useRef<IChildRef>()
    const getdataFn=()=>{
        console.log(childRef)
        console.log("HooksParent--HooksChild",childRef.current?.toGet())
    }

    return <div>
         <p> hooks父组件获取 子组件hooks 的内部值</p>
         <button type="button" onClick={getdataFn}>HooksParent{`=>`}hooksChild :</button>
         <HooksChild ref={childRef}/>
        </div>
}

export default HooksParent