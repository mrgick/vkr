import { useMemo } from "react";
import styles from "./Label.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const Label = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <label
      className={getClassName(styles.label, props.className)}
      style={style}
      {...getProps(props)}
    >
      {props.children}
    </label>
  );
};
