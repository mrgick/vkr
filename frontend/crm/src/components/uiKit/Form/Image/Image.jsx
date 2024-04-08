import { useMemo } from "react";
import styles from "./Image.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const Image = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <img
      className={getClassName(styles.image, props.className)}
      style={style}
      {...getProps(props, ["style", "className"])}
    />
  );
};
