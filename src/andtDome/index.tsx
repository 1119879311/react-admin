import AntdTableDome from "./table";
import AntdSelectTree from "./selectTree";

import { Tabs } from "antd";
import React, { useState } from "react";
import { TabsProps, TabPaneProps } from "antd/lib/tabs";
const { TabPane } = Tabs;
function mapCmp<T>(Cmp: React.ComponentType<T>, data: Array<T> = []) {
  return data.map((itme) => <Cmp {...itme}></Cmp>);
}

const ByTabs = (props: TabsProps & { data: Array<TabPaneProps> }) => {
  let { data = [], ...otherProps } = props;
  return <Tabs {...otherProps}>{mapCmp(TabPane, data)}</Tabs>;
};

export default function AntdDome() {
  let [tkey, setTkey] = useState("2");
  let tabsParm = {
    activeKey: tkey,
    onTabClick: (key: string) => setTkey(key),
    data: [
      { tab: "Tab Title 2", key: "1", children: <AntdTableDome /> },
      {
        tab: "Tab Title 2",
        key: "2",
        children: (
          <div>
            <AntdSelectTree />
            <AntdSelectTree />
          </div>
        ),
      },
      { tab: "Tab Title 2", key: "3", children: "tabl3" },
    ],
  };
  return (
    <div className="card-container">
      <ByTabs {...tabsParm}></ByTabs>
    </div>
  );
}
