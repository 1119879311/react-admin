import React, { Component, createRef } from "react"
import HooksChild from "./hooksChild"
import ClassChild from "./classChild"

// 示例： class 父组件获取 hooks 子组件内部暴露的属性和方法 Ref
interface IChildRef {
    toGet:()=>any
}

export default class ClassParent extends Component{

    hooksChildRef = createRef<IChildRef>() //初始化ref 方式一

    classChildRef:ClassChild|null=null  //初始化ref 方式二


    // 获取 hooks 子组件 暴露的方法/属性
    getHooksChildFn(){

        // console.log("ClassParentGet--HooksChild",(this.hooksChildRef.current as IChildRed).toGet())
        
        console.log("ClassParentGet--HooksChild",this.hooksChildRef.current?.toGet())

    }
     // 获取 class 类子组件 暴露的方法/属性
    getClassChildFn(){
        // (this.classChildRef as ClassChild).childGet()
        console.log("ClassParentGet--ClassChild",this.classChildRef?.childGet())
    }
    render(){
           return <div>
               <p>class 父组件获取 子组件hooks 的内部值</p>
               <button type="button" onClick={()=>this.getHooksChildFn()}>ClassParentGet--HooksChild</button>
               <HooksChild ref={this.hooksChildRef}></HooksChild>

               <br/>
               <p>class 父组件获取  class类子组件 的内部值</p>
               <button type="button" onClick={()=>this.getClassChildFn()}>ClassParentGet--ClassChild</button>
               <ClassChild ref={(ref)=>{this.classChildRef = ref}}></ClassChild>
           </div>
    }
}