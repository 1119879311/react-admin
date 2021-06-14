import React, { Component } from "react"

// 类子组件
export default class ClassChild extends Component{
    Timer:any
    state = {
        index : 0
    }
    childGet=()=>{
        return "this is classComponent methonds and  data"+this.state.index
    }
    componentDidMount(){
       this.Timer =  setInterval(()=>{
            let {index} = this.state
            this.setState({index:index+1})
        },2000)
    }
    componentWillUnmount(){
        clearInterval(this.Timer)
    }
    render(){
           return <div>
              
              ClassChild <button type="button" onClick={this.childGet}>ClassChildGet</button>
           </div>
    }
}