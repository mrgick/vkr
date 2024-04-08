import { useMemo } from "react";
import styles from "./TextArea.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const TextArea = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <textarea
      className={getClassName(styles.textarea, props.className)}
      style={style}
      {...getProps(props, ["style", "className"])}
    />
  );
};
