import { useMemo } from "react";
import styles from "./Button.module.css";
import { getClassName, getProps, getStyle } from "../base";

export const Button = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <button
      className={getClassName(styles.button, props.className)}
      style={style}
      {...getProps(props)}
    >
      {props.children}
    </button>
  );
};
