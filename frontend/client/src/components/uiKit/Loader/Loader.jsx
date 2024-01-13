import styles from "./Loader.module.css";
import { useMemo } from "react";
import { getClassName, getProps, getStyle } from "../base";

export const Loader = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <div
      className={getClassName(styles.loader_wrapper, props.className)}
      style={style}
      {...getProps(props, ["style", "className"])}
    >
      <div className={styles.loader}></div>
    </div>
  );
};
