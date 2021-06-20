import React, { Component, ComponentType, createRef, ReactNode } from "react";
import "./index.less";
import { TreeSelect, Button } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ReactDOM, { findDOMNode } from "react-dom";
import { PropsWithChildren } from "react";
import { TreeSelectProps } from "antd/lib/tree-select";
const { TreeNode } = TreeSelect;
type TreeNodeProps = {
  title: string | ReactNode;
  value: string;
  key?: string;
  selectable?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  disabled?: boolean;
  isLeaf?: boolean;
  children?: Array<TreeNodeProps>;
};
const treeData: Array<TreeNodeProps> = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-0",
        key: "0-0-0",
      },
    ],
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1",
    children: [
      {
        title: "Child Node3",
        value: "0-1-0",
        key: "0-1-0",
      },
      {
        title: "Child Node4",
        value: "0-1-1",
        key: "0-1-1",
      },
      {
        title: "Child Node5",
        value: "0-1-2",
        key: "0-1-2",
      },
      {
        title: "Child Node5",
        value: "0-1-3",
        key: "0-1-3",
      },
      {
        title: "Child Node5",
        value: "0-1-4",
        key: "0-1-4",
      },
      {
        title: "Child Node5",
        value: "0-1-5",
        key: "0-1-5",
      },
      {
        title: "Child Node5",
        value: "0-1-6",
        key: "0-1-6",
      },
      {
        title: "Child Node5",
        value: "0-1-7",
        key: "0-1-7",
      },
    ],
  },
];

//自定义递归渲染 树节点
function renderTreeNode(data: Array<TreeNodeProps> = []) {
  return data.map((itme) => {
    let { children, ...props } = itme;
    return (
      <TreeNode
        key={itme.key || itme.value}
        {...(props as Omit<TreeNodeProps, "children">)}
      >
        {renderTreeNode(children)}
      </TreeNode>
    );
  });
}

//增强下拉 自定义页尾节点
/**
 *
 * @param Cmp
 * @param dropdownRender:(props)=> JSX.Element
 * @returns
 */
function WithSelectTree<T extends TreeSelectProps<any>>(Cmp: ComponentType<T>) {
  return class extends Component<
    PropsWithChildren<
      T & {
        dropdownRender?: (props?: T) => JSX.Element;
      }
    >
  > {
    dropdownClassName =
      "by-select-dropdown-" + Math.floor(Math.random() * 1000);
    isbool = false;
    dropdownRender() {
      if (this.isbool) return;
      this.isbool = true;
      let { dropdownRender } = this.props;
      if (dropdownRender && typeof dropdownRender === "function") {
        let dropdownRef = document.querySelector(
          `.${this.dropdownClassName} .ant-select-tree`
        );
        let addRef = document.createElement("div");
        addRef.className = "by-treeSelect-footer ";
        dropdownRef?.appendChild(addRef);
        ReactDOM.render(dropdownRender(this.props), addRef);
      }
    }
    componentDidMount() {
      console.log("is:", React.isValidElement(this.props.dropdownRender));

      if (!this.props.dropdownRender) return; // 如果不存在在改参数，不需要执行该插入节点操作
      let rootRef = findDOMNode(this) as Element;
      console.log("rootRef", rootRef);

      let inputRef = rootRef.querySelector(
        ".ant-select-selection-search-input"
      ) as Element;
      inputRef.addEventListener(
        "focus",
        () => {
          this.dropdownRender();
        },
        false
      );
    }
    render() {
      let {
        children,
        dropdownClassName = "",
        dropdownRender,
        ...props
      } = this.props;
      return (
        <Cmp
          dropdownClassName={`${dropdownClassName} ${this.dropdownClassName}`}
          {...(props as T)}
        >
          {children}
        </Cmp>
      );
    }
  };
}
const BySelectTree = WithSelectTree(TreeSelect);

// class BySelectTree<T> extends Component<
//   PropsWithChildren<
//     TreeSelectProps<T> & {
//       dropdownRender?: (props?: TreeSelectProps<T>) => JSX.Element;
//     }
//   >
// > {
//   dropdownClassName = "by-select-dropdown-" + Math.floor(Math.random() * 1000);
//   isbool = false;
//   dropdownRender() {
//     if (this.isbool) return;
//     this.isbool = true;
//     let { dropdownRender } = this.props;
//     if (dropdownRender && typeof dropdownRender === "function") {
//       let dropdownRef = document.querySelector(
//         `.${this.dropdownClassName} .ant-select-tree`
//       );
//       let addRef = document.createElement("div");
//       addRef.className = "by-treeSelect-footer ";
//       dropdownRef?.appendChild(addRef);
//       ReactDOM.render(dropdownRender(this.props), addRef);
//     }
//   }
//   componentDidMount() {
//     console.log("is:", React.isValidElement(this.props.dropdownRender));

//     if (!this.props.dropdownRender) return; // 如果不存在在改参数，不需要执行该插入节点操作
//     let rootRef = findDOMNode(this) as Element;
//     console.log("rootRef", rootRef);

//     let inputRef = rootRef.querySelector(
//       ".ant-select-selection-search-input"
//     ) as Element;
//     inputRef.addEventListener(
//       "focus",
//       () => {
//         this.dropdownRender();
//       },
//       false
//     );
//   }
//   render() {
//     let {
//       children,
//       dropdownClassName = "",
//       dropdownRender,
//       ...props
//     } = this.props;
//     return (
//       <TreeSelect
//         dropdownClassName={`${dropdownClassName} ${this.dropdownClassName}`}
//         {...props}
//       >
//         {children}
//       </TreeSelect>
//     );
//   }
// }

class Demo extends React.Component {
  slectTreeRef = createRef<any>();
  dropdownClassName = "by-dropdown-warp-" + Math.floor(Math.random() * 1000);
  isbool = false;
  state = {
    value: undefined,
  };

  extactFooterHTML() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => this.onAdd()}
          size="small"
          icon={<PlusOutlined />}
        >
          新增
        </Button>

        <Button onClick={this.onRefresh} size="small" icon={<SyncOutlined />}>
          刷新
        </Button>
      </div>
    );
  }

  onChange = (value: any) => {
    console.log(value);
    this.setState({ value });
  };

  onAdd = () => {
    console.log("新增");
  };
  onRefresh = () => {
    console.log("刷新");
  };
  onBlur = (e: any) => {};
  render() {
    return (
      <div className="by-tree">
        <BySelectTree
          showSearch
          treeData={treeData}
          dropdownClassName={this.dropdownClassName}
          style={{ width: "100%" }}
          //   value={this.state.value}
          treeCheckable={true}
          showCheckedStrategy="SHOW_ALL"
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Please select"
          allowClear
          multiple
          treeDefaultExpandAll
          //   getPopupContainer={(triggerNode) => triggerNode.parentNode}
          //   onChange={this.onChange}
          ref={this.slectTreeRef}
          dropdownRender={() => this.extactFooterHTML()}
        >
          {/* {renderTreeNode(treeData)} */}
          {/* <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
            <TreeNode value="leaf2" title="your leaf" key="random1" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
          </TreeNode>
        </TreeNode>
        <TreeNode value="parent-2" title="parent 2" key="0-2" /> */}
          {/* <TreeNode  key='0-3'  title={
        <div className="by-treeSelect-footer">
        <div><Button onClick={()=>this.onAdd()} size="small" icon="plus">新增数据啦啦啦</Button></div>
        <div><Button onClick={this.onRefresh} size="small" icon="sync">刷新</Button></div>
        </div>

        } value="parent-3" selectable={false} checkable={false}>
        </TreeNode> */}
          {/* <div className="by-treeSelect-footer">
          <div><Button onClick={()=>this.onAdd()} size="small" icon="plus">新增</Button></div>
          <div><Button onClick={this.onRefresh} size="small" icon="sync">刷新</Button></div>
        </div> */}
        </BySelectTree>
      </div>
    );
  }
}

export default Demo;
// ReactDOM.render(<Demo />, document.getElementById('container'));
