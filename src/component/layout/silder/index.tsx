import React from "react"
import { Menu } from 'antd';
import {Link,withRouter,RouteComponentProps} from "react-router-dom"
import {  AppstoreOutlined } from '@ant-design/icons';
// import {menuData} from "./data-test"
import { inject, observer } from "mobx-react";
import { UserStoreClass } from "@/store/userStore";
import {findTreeParendId} from "@/util"

interface IProps extends  RouteComponentProps {
    UserStore?:UserStoreClass
};
const  setPathKey=(key:string)=>{
    return key.replace(/(\/)?$/,"").toLowerCase()
}
const { SubMenu } = Menu;
const menuItme = (itmeData:any[])=>{
        return itmeData.map(itmes=>{
          if(itmes.children&&itmes.children.length){
          return <SubMenu
             key={itmes.signName}
             title={
               <span>
                 <AppstoreOutlined />
                 <span>{itmes.title}</span>
               </span>
             }>
             {menuItme(itmes.children)}
         </SubMenu>
          
          }else{
            console.log("itmes.url",itmes.url)
           return (
             <Menu.Item key={itmes.url||''}>
              <Link to={itmes.url}>
                  <AppstoreOutlined />
                  <span> {itmes.title}</span>
                </Link>
              </Menu.Item>
            )
          }
         
        })
     
}
@inject("UserStore")
@observer
class Sider extends React.Component<IProps> {
  state = {
    current:setPathKey( this.props.location.pathname),
    openKeys:[]
  };
  componentDidMount(){
    let openKeys = findTreeParendId(this.props.UserStore?.userData.menus || [],this.props.location.pathname,'url','signName')
      this.setState({
      openKeys,
    });
      console.log("======",this.state.current, this.props.location.pathname,openKeys)
  }
  UNSAFE_componentWillReceiveProps(nextProps: { location: { pathname: string; }; }) {
      console.log(nextProps.location.pathname,this.props.location.pathname)
    if (nextProps.location.pathname !== this.props.location.pathname) {
        console.log("silderkey=>",setPathKey(nextProps.location.pathname))
        this.setState({current:setPathKey(nextProps.location.pathname)})
    } 
  }
  
   // 展开一级，显示二级
   onOpenChange = (openKeys:never[]) => {
    // console.log("openKeys",openKeys)
    // const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    this.setState({
      openKeys: openKeys,
    });
    
  }
  render() {

    let list = this.props.UserStore?.userData.menus||[];
    console.log("list",list,this.state.current)
    return (
      <>
        <Menu
          theme={"dark"}
          onOpenChange={(openKeys:any)=>this.onOpenChange(openKeys)}
          openKeys={this.state.openKeys}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
            {menuItme(list)}
        </Menu>
      </>
    );
  }
    
}

export default withRouter(Sider)
