import  React,{Component} from "react"
import { Layout,Button } from 'antd';
import { MenuUnfoldOutlined,MenuFoldOutlined } from '@ant-design/icons';
import "./index.css"
import LayoutSider from "../silder"
import { withRouter } from "react-router-dom";


import LayoutHeader from "../header"
import LayoutTabs from "../tabs";


const { Header, Sider, Content } = Layout;

//@ts-ignore
@withRouter
class LayoutMain extends Component{
    state = {
        collapsed:false
    }
   
    toggleCollapsed(){
        let {collapsed} = this.state
        this.setState({collapsed:!collapsed})
    }
    render(){
        let {children} = this.props
        let {collapsed} = this.state
        return (
            <Layout style={{height:"100%"}}>
             <Sider className="layout-sider" trigger={null} collapsible collapsed={collapsed}>
                <div className="logo"> 管理系统</div>
              <LayoutSider/>
            </Sider>
            <Layout>
              <Header className="layout-header" style={{"left":collapsed?"80px":"200px"}} >
              <Button type="primary" onClick={()=>this.toggleCollapsed()} style={{ marginBottom: 16 }}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button>
                 <LayoutHeader/>
              </Header>
              <Content className="layout-contents" >
                 <LayoutTabs></LayoutTabs> 
                 {children}
              </Content>
            </Layout>
          </Layout>
        )
    }
}

// const App:React.FC<IProps> = (props)=>{
//     const [collapsed,setCollapsed] = useState(false)
//     const toggleCollapsed = ()=>{
//         setCollapsed(!collapsed)
//     }
//     return (
//         <Layout style={{height:"100%"}}>
//          <Sider className="layout-sider" trigger={null} collapsible collapsed={collapsed}>
//           {layoutLogo}
//           <LayoutSider/>
//         </Sider>
//         <Layout>
//           <Header className="layout-header" style={{"left":collapsed?"80px":"200px"}} >
//           <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
//             {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
//             </Button>
//              {/* <LayoutHeader/> */}
//           </Header>
//           <Content className="layout-contents" >
//              {props.children}
//           </Content>
//         </Layout>
//       </Layout>
//       )
// }

export default LayoutMain
// export default withRouter(LayoutMain)

