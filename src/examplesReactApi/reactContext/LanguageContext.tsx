import React from "react"


const LanguageContext = React.createContext({
    language:"cn",
    setLanguage:(value:string)=>{}
})

export default LanguageContext