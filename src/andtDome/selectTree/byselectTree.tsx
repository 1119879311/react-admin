import { TreeSelect } from "antd";
import { TreeSelectProps } from "antd/lib/tree-select";
import React, {
  ComponentType,
  Component,
  PropsWithChildren,
  ReactNode,
} from "react";
import ReactDOM, { findDOMNode } from "react-dom";
const TreeNode = TreeSelect.TreeNode;
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
export default WithSelectTree(TreeSelect);
