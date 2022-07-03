import React, { Component, PropsWithChildren } from "react";
import { Layout } from "antd";
import "./index.css";
import LayoutSider from "../silder";
import LayoutHeader from "../header";
import LayoutTabs from "../tabs";
import ajax from "@/api/axios";
import UserStores from "@/store/userStore";
import HocLoading, { WithLoadingProps } from "@/component/Loading";
import IsLoignCpt from "@/component/IsLoginCpt";
import PrintChar from "@/component/PrintChar";

const { Header, Sider, Content } = Layout;
const filterUser = (data: Record<string, any>) => {
  return {
    user_name: data.name,
    user_id: data.id,
    user_type: data.user_type,
    menus: data.menu,
    auths: data.auth,
    roles: data.roles,
  };
};

const HocLayoutMain: React.ComponentType<PropsWithChildren<WithLoadingProps>> =
  HocLoading<PropsWithChildren<any>>(({ children }: PropsWithChildren<any>) => {
    return (
      <Layout style={{ height: "100%" }}>
        <Header className="layout-header">
          <LayoutHeader />
        </Header>
        <Layout>
          <Sider>
            <LayoutSider />
          </Sider>
          <Content className="layout-contents">
            <LayoutTabs></LayoutTabs>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  });
class LayoutMain extends Component {
  state = {
    loading: true,
  };
  async getUserInfo() {
    try {
      let { data } = await ajax.POST("getManagerRole");
      UserStores.setData(filterUser(data.data));
      this.setState({ loading: false });
    } catch (error) {
      console.log("error:", error);
    }
  }
  componentDidMount() {
    this.getUserInfo();
  }
  render() {
    let { children } = this.props;
    return (
      // <Redirect to="/login"></Redirect>
      <HocLayoutMain withLoading={this.state.loading}>{children}</HocLayoutMain>
    );
  }
}

export default IsLoignCpt(LayoutMain);
