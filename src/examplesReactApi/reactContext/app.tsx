import React, { Component, useState } from "react"
import LanguageContext from "./LanguageContext"
import LanguageSwitchClass from "./LanguageSwitchClass"
import LanguageSwitchConsumer from "./LanguageSwitchConsumer";
import LanguageSwitchHooks from "./LanguageSwitchHooks";

const WarpCpt = ()=>{
    return <div>
            <LanguageSwitchClass></LanguageSwitchClass>
             <br/>
             <LanguageSwitchHooks></LanguageSwitchHooks>
             <br/>
             <LanguageSwitchConsumer></LanguageSwitchConsumer>
    </div>
}


const AppCpt = ()=>{
    let [language,setLanguage] = useState<string>('')
    return <LanguageContext.Provider value={{language,setLanguage}}>
            react Context在类组件和hooks函数组件中使用
            <WarpCpt></WarpCpt>
    </LanguageContext.Provider>

}

// class AppCpt extends Component{
//     setLanguage = (language:string) => {
//         this.setState({ language });
//     }
//     state = {
//         language:"init cn",
//         setLanguage:this.setLanguage
//     }
//     render(){
//         return <LanguageContext.Provider value={this.state}>
//             react Context在类组件和hooks函数组件中使用
//             <WarpCpt></WarpCpt>
//         </LanguageContext.Provider>
            

//     }
    
// }
export default AppCpt