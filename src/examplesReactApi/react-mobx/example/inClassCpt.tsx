import { inject, observer } from "mobx-react";
import React from "react";
import { Component } from "react";
import { UserStore } from "../store/userStore";

interface ITestClassMobxProps {
  userStore?: UserStore;
}

@inject("userStore")
@observer
class TestClassMobx extends Component<ITestClassMobxProps> {
  componentDidMount() {
    console.log(this.props.userStore);
  }

  render() {
    let userStore = this.props.userStore!;
    return (
      <div>
        {userStore.token}
        {JSON.stringify(userStore.userinfo)}
        <br />
        <button type="button" onClick={() => userStore.setToken("admin121")}>
          设置token
        </button>
        <button type="button" onClick={() => userStore.setToken()}>
          清空token
        </button>

        <button
          type="button"
          onClick={() => userStore.setUserinfo({ username: "admin" })}
        >
          设置用户名
        </button>
        <br />
      </div>
    );
  }
}

export default TestClassMobx;
// export default inject('userStore')(observer(TestClassMobx));
