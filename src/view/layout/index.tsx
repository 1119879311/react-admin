import React, { useEffect, useRef, useState } from "react";
import LayoutMainCpt from "@/component/layout/index";
import { Spin, Button } from "antd";
import ajax from "@/api/axios";
import UserStores from "@/store/userStore";
import { useHistory } from "react-router-dom";
interface Iprops {
  children?: React.ReactNode;
}

const TayouMains = (props: Iprops) => {
  const { children } = props;
  let [loading, setLoading] = useState(false);
  let [errorMsg, setErrorMsg] = useState("");
  let [index, setIndex] = useState(5);
  let indexRef = useRef(5);
  let History = useHistory();

  function getUserInfo() {
    ajax
      .POST("getManagerRole")
      .then((res) => {
        let { data } = res.data;
        UserStores.setData({
          user_name: data.name,
          user_id: data.id,
          user_type: data.user_type,
          menus: data.menu,
          auths: data.auth,
          roles: data.roles,
        });
        setLoading(true);
        setErrorMsg("");
        console.log(res.data);
      })
      .catch((err) => {
        console.log("error", err);
        setErrorMsg(
          `获取用户验证错误:[${
            err.message || "服务器错误"
          }],你可能需要重新登录` || "error:[加载失败,请尝试重新操作]"
        );
        let timer = window.setInterval(() => {
          setIndex((old) => {
            if (old === 1) {
              window.clearInterval(timer);
              return 1;
            }
            return (old = old - 1);
          });
          if (indexRef.current === 1) {
            History.push("/login");
          }
        }, 1000);
      });
  }
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <LayoutMainCpt>{children}</LayoutMainCpt>
  ) : (
    <Spin tip="loading..." spinning={errorMsg === ""}>
      <div className="by-full-mask">
        <br />
        <p style={{ color: "red", textAlign: "center" }}>
          {errorMsg || "服务器错误"}
        </p>
        <br />
        <p style={{ textAlign: "center" }}>{index}秒后为你自动跳转登录页</p>
        <br />
        <div className="m-flex m-center operation-main">
          <Button type="primary" onClick={() => History.push("/login")}>
            重新登录
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default TayouMains;
