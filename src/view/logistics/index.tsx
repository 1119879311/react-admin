import React from "react";
import { Form, Input, Button } from "antd";

const LogisticsCpt = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
  return (
    <div className="view-logistics bg-block" style={{ margin: "auto" }}>
      <Form
        name="complex-form"
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="物流单号" style={{ marginBottom: 0 }}>
          <Form.Item
            name="numbers"
            style={{ display: "inline-block" }}
            rules={[
              { required: true, message: "please enter Logistics Numbers" },
            ]}
          >
            <Input placeholder="please enter Logistics Numbers" allowClear />
          </Form.Item>
        </Form.Item>

        <Form.Item label="起始位置" style={{ marginBottom: 0 }}>
          <Form.Item
            name="startLocation"
            rules={[{ required: true, message: "please enter Start Address" }]}
            style={{ display: "inline-block" }}
          >
            <Input placeholder="please enter Start Address" allowClear />
          </Form.Item>
          <Form.Item
            name="endLocation"
            rules={[{ required: true, message: "please enter End Address" }]}
            style={{ display: "inline-block", marginLeft: "16px" }}
          >
            <Input placeholder="please enter End Address" allowClear />
          </Form.Item>
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" htmlType="submit">
            物流查询
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LogisticsCpt;
