import { useMemo } from "react";
import styles from "./FormError.module.css";
import { getClassName, getProps, getStyle } from "../../base";

export const FormError = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <ul
      className={getClassName(styles.error, props.className)}
      style={style}
      {...getProps(props)}
    >
      {props.elements.map((text, i) => 
        <li key={i} className={styles.error_element}>- {text}</li>
      )}
    </ul>
  );
};
