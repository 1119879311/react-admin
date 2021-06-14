import React from "react";
import TestClassMobx from "./inClassCpt";
import TestHooksMobx from "./inHooks";
export default function ChildMobx() {
  return (
    <>
      <TestClassMobx></TestClassMobx>
      <br />
      <TestHooksMobx></TestHooksMobx>
    </>
  );
}
