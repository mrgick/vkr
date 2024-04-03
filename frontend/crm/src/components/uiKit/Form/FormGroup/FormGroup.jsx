import styles from "./FormGroup.module.css";
import { useMemo } from "react";
import { getClassName, getProps, getStyle } from "../../base";

export const FormGroup = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <div
      className={getClassName(styles.form_group, props.className)}
      style={style}
      {...getProps(props)}
    >
      {props.children}
    </div>
  );
};
