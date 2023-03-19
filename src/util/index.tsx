//时间格式化：dataFormat(时间，时间的显示的格式)
    //如 (new Date(),yyyy-MM-dd)//2017-6-28
    //如 (new Date(),yyyy-MM-dd hh:mm:ss)//2017-6-28 15:02:30
    export  let dataFormat=  (date:number|Date, format ="yyyy-MM-dd hh:mm:ss") =>{//参数一:时间，参数，要显示的时间格式
        if(!date) return date;
        date = new Date(date);
        if (Object.prototype.toString.call(date) !== "[object Date]") return false;
        var o = {
            "M+": date.getMonth() + 1,                 //月份 
            "d+": date.getDate(),                    //日 
            "h+": date.getHours(),                   //小时 
            "m+": date.getMinutes(),                 //分 
            "s+": date.getSeconds(),                 //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {

                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? ((o as any )[k]) : (("00" + (o as any)[k]).substr(("" + (o as any)[k]).length)));
            }
        }
        return format;
    }

 
    /**
 * @param data 数据源(数状结构)
 * @param childrenKeys : 每项的子级字段key，默认为：children
 */
export function treeToOneArr<T extends {[key:string]:any}>(data:T[],childrenKey?:string):T[]{
    let resArr:T[] = [];
    childrenKey = childrenKey||'children'
    for(let i=0;i<data.length;i++){
        let itme:any = data[i];// 这里有点不好，用了any 类型，返回数据的成员掉失了类型检测，
        if(Array.isArray(itme[childrenKey])){
            let child:T[] = itme[childrenKey];
            itme[childrenKey] = [];
            resArr = resArr.concat(itme).concat(treeToOneArr(child,childrenKey))
        }else{
            resArr.push(itme)
        }
    }

    return resArr
}
// Typescript中的this单独在函数中使用是大大受限制的。所以在typescript中使用class来解决这一问题
//防抖：在规定时间内重复操作一个事件只会执行一次，在时间段内会重新计算执行开始时间,常用与滚动事件，操作请求后台接口(防止频繁操作)
export class Debounced {

    /**
     * 
     * @param fn 要执行的函数
     * @param awit  时间
     * @param immediate 是否在触发事件后 在时间段n开始，立即执行，否则是时间段n结束，才执行
     */
    static use(fn:Function,awit:number=1000,immediate:boolean=false){
        let timer:NodeJS.Timeout|null
        return (...args:any)=>{
            if(timer) clearInterval(timer)
            if(immediate){
                if(!timer) fn.apply(this,args);
                timer = setTimeout(function(){//n 秒内 多次触发事件,重新计算.timeer 
                    timer = null;//n 秒内没有触发事件 timeer 设置为null，保证了n 秒后能重新触发事件 flag = true = !timmer  
                },awit)
            }else{
                timer = setTimeout(()=>{ fn.apply(this,args)},awit)
            }
        }
    }

}


// 节流:连续触发事件，n秒内只执行一次，节流会降低执行函数频率，可以用在并发的操作

export class Throttle{
    /**
     * 
     * @param fn 
     * @param awit 
     * @param immediate true 是启用时间戳版，false 是启用定时器版，作用一样
     */
    static use(fn:Function,awit:number=1000,immediate:boolean=true){
        //时间戳
        if(immediate){
            let prevTime = 0;
            return (...args:any)=>{
                let nowTime = Date.now();
                if(nowTime-prevTime>=awit){
                    fn.apply(this,args)
                    prevTime=nowTime
                }
            }
        }else{
            //定时器
            let timer: NodeJS.Timeout|null;
            return (...args:any)=>{
                if(!timer){
                    fn.apply(this,args)
                    timer = setTimeout(() => {
                        timer&&clearTimeout(timer)
                        timer= null
                    }, awit);
                }
               
            }
        }

        
    }
    
}

//递归法：一维数组转无限极树状结构
/**
 *
 * @param data 数据源，一维数据
 * @param idKeys 要匹配所在项的唯一idkey 属性字段，比如idkeys ='id',
 * @param pidKeys 要匹配所在项的上级 pidkey 属性字段，比如pidkeys = 'pid',
 * @param pid  要匹配所在项目的上级pidkey 字段的值,比如 pid = 0
 * @param leve 当前所在树状结构的层级数
 */
export function oneToTree<T extends {[key:string]:any}>(data:T[],idKeys?:string,pidKeys?:string,pid?:any,leve?:number,insertFn?:Function){
    let idKey = idKeys||"id"
    let pidKey = pidKeys||'pid'
    let leveKey = "$leve"
    let childrenKey = "children"
    let pidData = pid||0
    let leves = leve||1;
    if(!Array.isArray(data)) return data;
    type resI = T&{$leve:number,children:resI[]};//使用交叉类型，新增了两个字段$live,children
    let resArr:Array<resI> =[];
    data.forEach( (itme:any)=> {
        if (itme[pidKey] === pidData) {
            itme[leveKey] = leves;
            insertFn&&insertFn(itme)
            itme[childrenKey] = oneToTree(data, idKey, pidKey, itme[idKey], leves + 1,insertFn);
            resArr.push(itme)
        }
    })

    return resArr

}

export function signRonder(n = 30){ //取随机数
    var str = "123456789aAbBcCdDeEfFgGhHiIjJkKlLmMoOpPqQurRsStTuUvVwWxXyYzZ_-";
    if ( n < 3) n = 30;
    var ronderstr = "";
    for (var i = 0; i < n; i++) {
        var index = Math.floor(Math.random() * str.length);
        ronderstr += str[index];
    }
    return ronderstr
}

export function downloadFile(data:any,filename:string,type:string){
    let contentType = ''
    if(type==="docx"){
        contentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }else if(type==='xlsx'){
        contentType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }else{
        console.error("type params is not empty")
        return false
    }
    let resData = new Blob([data],{type:contentType})

    let dowLink= URL.createObjectURL(resData)
    var aDom = document.createElement("a");
    aDom.setAttribute('style', 'display:none');
    aDom.setAttribute('href', dowLink);
    aDom.setAttribute('download', filename);
    document.body.appendChild(aDom);
    aDom.click();
    URL.revokeObjectURL(dowLink);
    document.body.removeChild(aDom);
}

export  function BlobToText(data:Blob){
    let reader = new FileReader()
    reader.readAsText(data)
    return new Promise((resolve)=>{
        reader.onload = function(){
            resolve( JSON.parse(reader.result as string ))
        }
    })
}


export function findTreeParendId<T extends {[key:string]:any}>(dataArr:T[],value:any,keys:string,rekeys:string,childrenKeys?:string):Array<keyof T>{
    let data = JSON.parse(JSON.stringify(dataArr));//避免引用，做深拷贝处理
    var resArr:Array<keyof T> =  [];
    let childrenKey = childrenKeys||'children';
    if(data.length<0){
        return resArr
    }
    let recursion = (arrs:T[],itmeId:any,parendId?:any)=>{
        for(let i=0;i<arrs.length;i++){

            let itme:T = arrs[i]
            if(itme[keys]===itmeId){
                resArr.unshift(itme[rekeys]);// 找到匹配的就加进去
                if(parendId){
                    recursion(data,parendId)
                }
                break;//跳出当前循环
            }else{
                //找不到，如果有子级，递归往下找
                if(itme[childrenKey]&& Array.isArray(itme[childrenKey])){
                    recursion(itme[childrenKey],itmeId,itme[keys])
                }
            }
        }
    }
    recursion(data,value)
    return resArr;
}