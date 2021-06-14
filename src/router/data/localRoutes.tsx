import LoadingView from "@/component/Loading/view";
import React, { PropsWithChildren } from "react";
import { Redirect } from "react-router-dom";
import { IRouter } from "../interface";
import * as ohter from "./authRoutes";
import Login from "@/view/login/login";
import NoFount from "@/view/404";
import LayoutMain from "@/component/layout/index";

const WithLayoutMain = ({ children }: PropsWithChildren<any>) => (
  <LayoutMain>
    <LoadingView>{children}</LoadingView>
  </LayoutMain>
);
export let NofountRoute: IRouter = {
  name: "Nofount",
  title: "404页面",
  path: "*",
  isNoAuth: true,
  Components: NoFount,
};
export let localRoutes: IRouter[] = [
  {
    name: "Index",
    path: "/",
    exact: true,
    isNoAuth: true,
    Components: () => <Redirect to="/admin"></Redirect>,
  },
  {
    name: "Login",
    title: "登录",
    path: "/login",
    isNoAuth: true,
    Components: Login,
  },
  {
    name: "Layout",
    title: "入口页",
    path: "/admin",
    Components: WithLayoutMain,
    children: [...ohter.authRoutes, NofountRoute],
  },
  NofountRoute,
];
