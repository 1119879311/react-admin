import React from "react"
import { useReducer } from "react"

const TOKENUPDATE="TOKENUPDATE"
const initState = {token:''}
const tokenReducer = (state: any, action: any)=>{
    switch (action.type) {
        case TOKENUPDATE:
            return {token:action.data}
        default:  
            return state
    }
}
// type Parameters<T extends (...args:any)=>any> = T extends (...args: infer P) => any ? P:never 
// type IuseReducerParams = Parameters<typeof useReducer>


const useCommitToken = ()=>{
    let [state,dispatch] = useReducer(tokenReducer,initState)
    const tokenUpdateCommit=(data:any)=>dispatch({type:TOKENUPDATE,data})
    return [
        state,{tokenUpdateCommit}
    ]
}



const TokenReducerTest1 = ()=>{
    let [tokenState,tokendispatch] = useReducer(tokenReducer,initState)
    let [state,{tokenUpdateCommit}] = useCommitToken()
    return <div>
            <p>token: {tokenState.token}</p>
            <p>token: {state.token}</p>
            <button type="button" onClick={()=>tokendispatch({type:"TOKENUPDATE",data:Math.random()})}>update</button>
            <button type="button" onClick={()=>tokenUpdateCommit(Math.random())}>update</button>

    </div>   
}

export default TokenReducerTest1