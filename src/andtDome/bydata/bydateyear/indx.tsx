import { Dropdown, Input } from "antd";
import * as React from "react";
import { useState } from "react";
import { useRef } from "react";
import ByDateYear from ".";
export default function () {
  //   let value = useRef<string | null>();
  const [value, setValue] = useState<any>();
  const onSelect = (data: number) => {
    setValue(data);
  };
  return (
    <Dropdown
      key="byDateYear"
      placement={"bottomLeft"}
      trigger={["click"]}
      overlay={
        <div style={{ display: "flex" }}>
          <ByDateYear onSelect={onSelect} value={value}></ByDateYear>
          <ByDateYear onSelect={onSelect} value={value}></ByDateYear>
        </div>
      }
    >
      <Input
        style={{ width: "150px" }}
        allowClear
        value={value}
        onChange={(e: any) => {
          console.log(e.target.value);
          if (!e.target.value || /\d{4}/.test(e.target.value)) {
            setValue(e.target.value);
          }
        }}
      ></Input>
    </Dropdown>
  );
}
