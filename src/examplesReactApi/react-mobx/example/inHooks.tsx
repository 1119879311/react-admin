// 在函数组件中使用mobx

import { inject, observer } from "mobx-react";
import React from "react";
import { UserStore } from "../store/userStore";
interface IPorps {
  userStore?: UserStore;
}

//方式一
function TestHooksMobx(props: IPorps) {
  let { userStore } = props;
  console.log(userStore);
  return <div>{userStore?.token}</div>;
}

// 方法2
// function Demo2() {
//     const localStore = useLocalStore(() => store);
//     return useObserver(() => <div onClick={localStore.setCount}>{localStore.count}</div>)
// }

// // 方法3，更新Observer包裹的位置，注意这里包裹的必须是一个函数
// function Demo3() {
//     const localStore = useLocalStore(() => store);
//     return <Observer>{() => <span>{localStore.count}</span>}</Observer>
// }

export default inject("userStore")(observer(TestHooksMobx));
