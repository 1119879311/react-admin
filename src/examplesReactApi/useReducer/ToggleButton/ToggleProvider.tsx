import React, { createContext, useReducer } from "react"

const initState = {isShow:true}


export const ToggleContext = createContext<{[key:string]:any}>({})

const ToggleReducer = (state:any ,action:any)=>{
    switch (action.type) {
        case "TOGGLETYPE":
            return {isShow:!state.isShow}
        default:  
            return state
    }
}

export const ToggleProvider = (props :any)=>{

    let [state,dispatch] = useReducer(ToggleReducer,initState)

    return <ToggleContext.Provider value={{state,dispatch}}>{props.children}</ToggleContext.Provider>
} 



