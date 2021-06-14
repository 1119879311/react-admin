import React, { useContext } from "react"
import LanguageContext from  './LanguageContext'
// 在函数组件中使用useContext
const LanguageSwitchHooks = ()=>{
    const languageContext = useContext(LanguageContext)
    const updateLanguage = ()=>{
        languageContext.setLanguage(Math.random()+"cn")
    }
    return <div>
             <p>函数子组件中context值(useContext) :{languageContext.language}</p>
            < button onClick = {updateLanguage}>update language</button> 
    </div>
}
export default LanguageSwitchHooks 