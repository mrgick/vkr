import { useMemo } from "react";
import styles from "./Select.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const Select = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <select
      className={getClassName(styles.select, props.className)}
      style={style}
      {...getProps(props, ["style", "className", "elements"])}
    >
      {props.elements.map((item) => (
        <option key={item.value} value={item.value} selected={item?.active}>
          {item.text}
        </option>
      ))}
    </select>
  );
};
