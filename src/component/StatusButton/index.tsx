import React from "react";

export default function getStatusText(status:number,user_type?:number){
    let bool = user_type===1||status === 1;
    let color =bool?'green':'red'
    let text = bool?"正常":"禁用"
    return <span style={{color:color}}>{text}</span>
}