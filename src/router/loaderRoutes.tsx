import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IRouter } from "./interface";
import PrivateRoute from "./PrivateRoute";

export function loadRouter(data: IRouter[] = []) {
  return data.map((itme, index) => {
    let { Components, redirect, children, isNoAuth, ...props } = itme;
    if (children&&children.length) {
      return (
        <Route key={props.name || index} {...props}>
          <Components>
            <Switch>
              {loadRouter(children)}
              {redirect ? <Redirect to={redirect}></Redirect> : ""}
            </Switch>
          </Components>
        </Route>
      );
    } else {
      let RouterCpt = isNoAuth ? Route : PrivateRoute;
      return (
        <RouterCpt key={props.name || index} {...props}>
          <Components />
        </RouterCpt>
      );
    }
  });
}
