import React from "react"
import LanguageContext from  './LanguageContext'
// 在函数组件中使用
const LanguageSwitchConsumer = ()=>{
   
    const updateLanguage = (setLanguage:Function)=>{
        setLanguage(Math.random()+"cn")
    }
    return <LanguageContext.Consumer>
            {
                ({language, setLanguage})=>{
                 return  <> <p>函数组件中context值(Context.Consumer) : language:{language}</p>
                    < button onClick = {()=>updateLanguage(setLanguage)}>update language</button> </>
                }
            }
    </LanguageContext.Consumer>
}
export default LanguageSwitchConsumer 