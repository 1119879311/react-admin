import React, { Component } from "react"
import ClassParent from "./classParent"
import HooksParent from "./hooksParent"

export default class ParentToChild extends Component{
    render(){
            return <div>
                <ClassParent/>
                <hr/>
                <HooksParent/>
                </div>
    }
}