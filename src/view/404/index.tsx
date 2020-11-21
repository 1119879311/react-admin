import { Button } from "antd"
import React from "react"
import { useHistory } from "react-router-dom"

const Nofount = ()=>{
    let uHistory = useHistory()
    
    return <div className="m-flex m-center m-column">
        <img src="./404.jpg" alt="404" />
        <br/>
        <div className="m-flex m-center">
             <Button type="primary" onClick={uHistory.goBack}>返回上一页</Button>
        </div>
    </div>
}

export default Nofount