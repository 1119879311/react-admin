import React, { PropsWithChildren } from "react";
import { ComponentType } from "react";
import UserStore from "@/store/userStore";
import { observer } from "mobx-react";
import { Redirect } from "react-router-dom";
export function IsLoignCpt<T = any>(Cmp: ComponentType<T>) {
  return observer((props: PropsWithChildren<T>) => {
    let { token } = UserStore.userData;
    let { children } = props;
    return token ? (
      <Cmp {...(props as T)}>{children}</Cmp>
    ) : (
      <Redirect to="/login"></Redirect>
    );
  });
}
export default IsLoignCpt;
