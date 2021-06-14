import { Radio } from "antd";
import React from "react";
import { Component } from "react";
const formType = {
  RadioGroup: Radio.Group,
};

type IformType = keyof typeof formType;

export default class PanelSearch extends Component {
  get formList() {
    let formList = [
      {
        type: "RadioGroup",
        props: {},
      },
    ];
    return [];
  }
  render() {
    return <div>1212</div>;
  }
}
