// import { Debounced,Throttle } from "@/util"
import React, { useContext } from "react";
import { ToggleContext, ToggleProvider } from "./ToggleProvider";

// const debouncedUse = new Debounced()

const ShowData = () => {
  let { state } = useContext(ToggleContext) as { [key: string]: any };
  return <div> 显示：{state.isShow + ""}</div>;
};
const Button = () => {
  let { dispatch } = useContext(ToggleContext) as { [key: string]: any };
  const onClick = (e: any) => {
    e.persist();
    console.log(e);
  };
  return (
    <>
      <ShowData></ShowData>
      <button type="button" onClick={onClick}>
        debouncedUse
      </button>
      <button type="button" onClick={onClick}>
        button
      </button>

      <button type="button" onClick={() => dispatch({ type: "TOGGLETYPE" })}>
        切换
      </button>
    </>
  );
};

export const ToggleTest = () => {
  return (
    <ToggleProvider>
      <Button></Button>
    </ToggleProvider>
  );
};
