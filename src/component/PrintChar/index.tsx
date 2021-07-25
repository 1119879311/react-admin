import React from "react";
export const Printbreak = () => (
  <div style={{ pageBreakAfter: "always", height: 0 }}></div>
);
export const PrintStart = () => <p data-print="PrintStart" hidden />;
export const PrintEnd = () => <p data-print="PrintEnd" hidden />;
export const prinStartHtml = '<p data-print="PrintStart" hidden=""></p>';
export const prinEndHtml = '<p data-print="PrintEnd" hidden=""></p>';

export const PrintUtil = (id?: string) => {
  if (id) {
    let printDom = document.getElementById(id);
    if (!printDom)
      return console.error("指定打印区域的节点Id 【" + id + "】不存在");
    window.document.body.innerHTML = printDom.innerHTML;
    window.print();
    window.location.reload();
  } else {
    //判断是否打印开始标记
    let bodyHtml = document.body.innerHTML;
    let isPrintStart = bodyHtml.includes(prinStartHtml);
    let isPrintEnd = bodyHtml.includes(prinEndHtml);
    if (!isPrintStart && !isPrintEnd) {
      //没开始，没结束，全部打印
      window.print();
    } else {
      //有开始，没结束
      //没开始，有结束
      //有开始，有结束
      let printHtml = bodyHtml;
      if (isPrintStart) {
        printHtml = bodyHtml.substring(
          bodyHtml.indexOf(prinStartHtml) + prinStartHtml.length
        );
      }

      if (isPrintEnd) {
        printHtml = printHtml.substring(0, printHtml.indexOf(prinEndHtml));
      }

      window.document.body.innerHTML = printHtml;
      window.print();
      window.location.reload();
    }
  }
};

interface Iprops {
  type: "printbreak" | "printStart" | "printEnd";
}
const PrintChar = ({ type }: Iprops) => {
  let PrintType = {
    printbreak: Printbreak,
    printStart: PrintStart,
    printEnd: PrintEnd,
  };
  let Com = PrintType[type];
  return <Com></Com>;
};

export default PrintChar;
