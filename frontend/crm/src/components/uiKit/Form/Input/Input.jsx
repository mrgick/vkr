import { useMemo } from "react";
import styles from "./Input.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const Input = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <input
      className={getClassName(styles.input, props.className)}
      style={style}
      {...getProps(props, ["style", "className"])}
    />
  );
};
