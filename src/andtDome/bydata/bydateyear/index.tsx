import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./index.less";

const yearReg = /\d{4}/;
interface Iprops {
  defaultValue?: number;
  value?: number;
  onSelect?: (value: number) => void;
}
const COUNT = 10;
function ByDateYear(props: Iprops) {
  let nowYear = new Date().getFullYear(); //今年
  let baseValue = useRef<number | null>(null);
  let [selectValue, setSelectValue] = useState(
    props.value || props.defaultValue
  );
  const getBase = (base: number) => base - (base % 10);
  let [yearList, setYearList] = useState<Array<number>>([]);

  const addYearList = (base: number) => {
    let newbase = getBase(base);
    if (baseValue.current !== newbase) {
      baseValue.current = newbase;
      setYearList(Array.from(new Array(COUNT), (_, v) => v + newbase));
    }
  };
  //切换年
  const changeYear = (e:React.MouseEvent<HTMLDivElement>,type: string) => {
    e.stopPropagation();
    let base = baseValue.current as number;
    if (base <= COUNT) return;
    if (type === "+") {
      base = base + COUNT;
    } else {
      base = base - COUNT;
    }
    addYearList(base);
  };
  //监听props.value
  useEffect(() => {
    console.log("propsvalue", props.value);

    setSelectValue(props.value);
    if (
      props.value &&
      props.value !== selectValue &&
      yearReg.test(props.value + "")
    ) {
      addYearList(props.value);
    } else {
      addYearList(selectValue || nowYear);
    }
  }, [props.value]);

  return (
    <div className="by-date-main by-dateyear" onClick={(e)=>{
      e.stopPropagation();
    }}>
      <div className="by-flex by-date-header">
        <div className="left-header" onClick={(e:React.MouseEvent<HTMLDivElement>) => changeYear(e,"-")}>
          <span>&lt;&lt;</span>&nbsp;&nbsp;
        </div>
        <div className="center-header">
          {baseValue.current} 年 -
          {baseValue.current ? baseValue.current + COUNT - 1 : ""} 年
        </div>
        <div className="right-header" onClick={(e:React.MouseEvent<HTMLDivElement>) => changeYear(e,"+")}>
          <span>&gt;&gt;</span> &nbsp;&nbsp;
        </div>
      </div>
      <div className="by-flex by-date-content by-dateyear">
        {yearList.map((itme) => {
          return (
            <div
              key={itme}
              className={
                "by-flex-center by-dateYear-col available-cell " +
                (itme === nowYear ? " by-now-dateyear " : "") +
                (itme === selectValue ? "by-select-dateyear" : "")
              }
              onClick={(e) => {
                e.stopPropagation();
                setSelectValue(itme);
                props.onSelect && props.onSelect(itme);
              }}
            >
              <span>{itme}</span>
            </div>
          );
        })}
      </div>
      <div className="by-data-footer">121212</div>
    </div>
  );
}

export default ByDateYear;
