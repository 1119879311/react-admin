import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import { Spin ,Alert,ConfigProvider} from 'antd';
import RouterLoader from "./router"
import {UserStore} from "./store/index"
import {configure} from 'mobx'; // 开启严格模式
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn'
configure({enforceActions: "observed"})
function App() {
  return (
      <ConfigProvider locale={zhCN}>
      <Provider UserStore={UserStore}>
        <Suspense fallback={<Spin tip="Loading..."><Alert  message="1" description="1" type="info" /> </Spin>}>
        <RouterLoader></RouterLoader>
        </Suspense>
      </Provider>
      </ConfigProvider>
    
  );
}

export default App;
