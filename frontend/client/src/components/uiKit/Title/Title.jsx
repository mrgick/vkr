import styles from "./Title.module.css";
import { useMemo, useState } from "react";
import { getClassName, getStyle } from "../base";

export const Title = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  return (
    <h1
      className={props.theme === "white" ? styles.white : styles.title}
      style={style}
    >
      <span>{props.text}</span>
      {props.children}
    </h1>
  );
};
