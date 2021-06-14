import { Spin } from "antd";
import React from "react";
import { PropsWithChildren } from "react";

// interface WithLoadingProps {
//   setWithLoading?: (loading: boolean) => void;
// }

// const WithLoading = <T extends object>(Component: React.ComponentType<T>) =>
//   class extends React.Component<T & WithLoadingProps> {
//     state = {
//       withLoading: true,
//     };
//     setWithLoading = (withLoading: boolean) => {
//       this.setState({ withLoading });
//     };
//     render() {
//       let props = { ...this.props, setWithLoading: this.setWithLoading };
//       let { withLoading } = this.state;
//       // return <Component {...(props as T)} />;
//       return withLoading ? <Spin /> : <Component {...(props as T)} />;
//     }
//   };

export interface WithLoadingProps {
  withLoading?: boolean;
}

export default function HocLoading<T extends object>(
  Cmp: React.ComponentType<T>
) {
  return (props: PropsWithChildren<T & WithLoadingProps>) => {
    let { withLoading, ...newProps } = props;
    return withLoading ? (
      <Spin
        size="large"
        tip="Loading..."
        style={{ textAlign: "center", margin: "10% auto", width: "100%" }}
      />
    ) : (
      <Cmp {...(newProps as T)} />
    );
  };
}
