import React from "react"
import {HashRouter as Router, Redirect, Route ,Switch} from 'react-router-dom'
import {routerData,IRouterData} from "./data"
import PrivateRoute from "./PrivateRoute"
// import { CacheSwitch }  from 'react-router-cache-route'

//遍历路由数据treeData
function LoadRouter(data:IRouterData[]){
    return data.map((Itme,index)=>{
        let ops = {path:Itme.path,exact:Itme.exact,name:Itme.name,title:Itme.title,key:index}
        if(Itme.children&&Itme.children.length>0){
            return <Route {...ops} ><Itme.component >
                         <Switch>
                            { LoadRouter(Itme.children)}
                        </Switch>
                        {/* <CacheSwitch which={(element:any) => element.type === PrivateRoute}>
                            { LoadRouter(Itme.children)}
                        </CacheSwitch> */}
                </Itme.component></Route> 
        }else{
            return Itme.redirect? <Route {...ops}   key={index} render={()=> Itme.path==="/"? <Redirect to="/admin"/>:<Itme.component/>}></Route>:
            (Itme.isNoAuth?<Route {...ops} ><Itme.component/></Route>
            :<PrivateRoute {...ops} ><Itme.component /></PrivateRoute> )
              
        }
    }) 
}
export default function RouterLoader(){
    return   (
        <Router>    
            <Switch>
                 {LoadRouter(routerData)}
            </Switch>
        </Router> 
    )
}

