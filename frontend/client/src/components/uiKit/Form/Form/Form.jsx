import { useMemo } from "react";
import styles from "./Form.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const Form = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <form
      className={getClassName(styles.form, props.className)}
      style={style}
      {...getProps(props)}
    >
      {props.children}
    </form>
  );
};
