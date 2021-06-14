import { Provider } from "mobx-react";
import * as store from "./store";
import ChildMobx from "./example";
import React from "react";

console.log(store);
export default function AppMobx() {
  return (
    <>
      <Provider {...store}>
        <div>
          <ChildMobx />
        </div>
      </Provider>
    </>
  );
}
