import { useMemo } from "react";
import styles from "./FormLink.module.css";
import { getClassName, getProps, getStyle } from "../../base";
import { Button } from "../../Button/Button";
import { Link } from "react-router-dom";

export const FormLink = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <Link
      to={props.to}
      className={getClassName(styles.form_link, props.className)}
      style={style}
      {...getProps(props, [
        "children",
        "className",
        "style",
        "text",
        "to",
        "color",
      ])}
    >
      <Button
        style={{
          width: "100%",
          backgroundColor: props.color ? props.color : "#69B6FA",
        }}
      >
        {props.text}
      </Button>
    </Link>
  );
};
