import { useMemo } from "react";
import styles from "./FormHelp.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const FormHelp = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <div
      className={getClassName(styles.help, props.className)}
      style={style}
      {...getProps(props)}
    >
      {props.children}
    </div>
  );
};
