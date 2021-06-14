import { Spin } from "antd";
import React, { PropsWithChildren, Suspense } from "react";

export default function LoadingView({ children }: PropsWithChildren<any>) {
  return (
    <Suspense
      fallback={
        <Spin tip="Loading...">
          <div className="by-full-mask"></div>
        </Spin>
      }
    >
      {children}
    </Suspense>
  );
}
