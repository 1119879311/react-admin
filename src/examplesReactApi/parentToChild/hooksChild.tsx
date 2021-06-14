import React,{forwardRef,useImperativeHandle, useRef, useState}  from "react"

interface Iprops {}

const HooksChild = (props:Iprops,ref: any)=>{
    const divRef = useRef<HTMLDivElement>(null);
    const [index,setIndex] = useState(0)
    useImperativeHandle(ref,()=>{
        return {
            toGet(){
                return index
            },
            divRef
        }
    })
    const childGet = ()=>{
        console.log("HooksChildGet",setIndex(index+1))
    }
   
    return <div ref={divRef}>HooksChild <button type="button" onClick={childGet}>HooksChildGet</button></div>
}

export default forwardRef(HooksChild)