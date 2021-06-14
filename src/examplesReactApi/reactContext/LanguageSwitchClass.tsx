import React, { Component } from "react"
import  LanguageContext from "./LanguageContext"
//class 组件作为消费者 
 class LanguageSwitchClass extends Component {
    static contextType = LanguageContext
    updateLanguage=()=>{
        let context = this.context
        context.setLanguage(Math.random()+"cn")
        
    }
    context: any
    render(){
        let context = this.context
        return <div>
             <p>类子组件中 context值 :{context.language}</p>
            < button onClick = {this.updateLanguage}>update language</button> 
        </div>
    }
}
// LanguageSwitchClass.contextType = LanguageContext
export default LanguageSwitchClass