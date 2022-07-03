import { Provider } from "mobx-react";
import React from "react";
import { ConfigProvider } from "antd";
import RouterLoader from "./router";
import { UserStore } from "./store/index";
import { configure } from "mobx"; // 开启严格模式
import zhCN from "antd/lib/locale/zh_CN";
import "moment/locale/zh-cn";
import { PrintUtil } from "./component/PrintChar";
configure({ enforceActions: "observed" });
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider UserStore={UserStore}>
        <RouterLoader></RouterLoader>
        {/* <p data-print="prinEndHtml" hidden /> */}
        {/* <Suspense
          fallback={
            <Spin tip="Loading...">
              <div className="by-full-mask"></div>{" "}
            </Spin>
          }
        >
          <RouterLoader></RouterLoader>
        </Suspense> */}
      </Provider>
    </ConfigProvider>
  );
}

export default App;
