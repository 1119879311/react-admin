import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Tabs } from 'antd';
import {routerData,IRouterData} from "@/router/data"
import { treeToOneArr } from '@/util';
const { TabPane } = Tabs;
const allRouter= treeToOneArr(routerData)

interface Iprops extends RouteComponentProps{}
interface Istate {
    activeKey:string,
    panes:any[]
}
const  setPathKey=(key:string)=>{
    return key.replace(/(\/)?$/,"").toLowerCase()
}

class LayoutTabs extends Component<Iprops> {
   
    state:Istate = {
        panes:[],
        activeKey:""
    }
     // 在路由中找一个tabs
    filterRouter(path:string){
        let pathItme = allRouter.filter(itme=>setPathKey(itme.path||'')===setPathKey(path)&&itme.title);
        return pathItme[0]?pathItme[0]:null
    }
    addTabs = (item:IRouterData)=>{
        if(!item.title) return
        const { panes } = this.state;
        const activeKey =item.path?.toLowerCase();
        panes.push({ title:item.title,  key: activeKey?activeKey:'' ,closable:true});
        this.setState({ panes, activeKey });
    }
    onChange = (activeKey:any) => {
        this.setState({ activeKey });
        var {history:{replace}} = this.props;
        replace(activeKey)
    };

    onEdit = (targetKey:any, action:  "add"|"remove" ) => {
        if(action==="remove"){
            this.remove(targetKey)
        }
    };
    
     //判断下一个路由是否在tabs 中
    isRouteTabs(key:string){
        // ctx.path.replace(/(\/)?$/,"/");
        var pathItme = this.state.panes.filter(itme=>setPathKey(itme.key)===setPathKey(key));
        console.log("isRouteTabs=>",pathItme)
        return pathItme[0]?true:false
    }
    //添加tabs
    setTabs = (pathname:string)=>{
        if(!this.isRouteTabs(pathname)){//不存在tabs 
            var tabItem = this.filterRouter(pathname);
            console.log("tabItem",tabItem)
            if(tabItem){ //存在route ,加入新一个tabs
                this.addTabs(tabItem)
            }else{

                this.setState({ activeKey:"-1" }); //去掉激活的
            }
        }else{ //如果存在，则要激活
            
            this.setState({  activeKey:pathname });
        }
    }
    //路由变化时判断
    
    UNSAFE_componentWillReceiveProps(nextProps: { location: { pathname: any; }; }){
        
        //先判断是否在tabs；在不处理，不在则在路由中找出加入
        if (nextProps.location.pathname !== this.props.location.pathname) {
            var {pathname} = nextProps.location 
            this.setTabs(pathname)
        } 
        console.log(pathname)
    }
    componentDidMount(){
        
        this.setTabs(this.props.location.pathname)
    }
    remove = (targetKey:any) => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        console.log(this.state.panes)
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex!==undefined&&lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        this.setState({ panes, activeKey });
        var {history:{replace}} = this.props;
        replace(activeKey)
    };
    render() {
        return (
            <Tabs
            hideAdd
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}
            >
            {this.state.panes?.map(pane => (
                <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                </TabPane>
            ))}
            </Tabs>
        );
        }

}
export default withRouter(LayoutTabs)
