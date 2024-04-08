import styles from "./FormGroup.module.css";
import { useMemo } from "react";
import { getClassName, getProps, getStyle } from "../../base";

export const FormGroup = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <div
      className={getClassName(
        !!props.column ? styles.form_group_column : styles.form_group,
        props.className
      )}
      style={style}
      {...getProps(props, ["children", "className", "style", "column"])}
    >
      {props.children}
    </div>
  );
};
