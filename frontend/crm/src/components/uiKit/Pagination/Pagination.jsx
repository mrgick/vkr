import { useMemo } from "react";
import styles from "./Pagination.module.css";
import { getClassName, getStyle } from "../base";

export const Pagination = (props) => {
  const style = useMemo(() => getStyle(props.style), [props.style]);
  const prev = props.current - 1 > 0;
  const next = props.current + 1 <= props.maxPage;
  let nums = [1];
  if (props.current - 1 > 2) {
    nums.push("...");
  }
  if (props.current - 1 >= 2) {
    nums.push(props.current - 1);
  }
  if (props.current !== 1) {
    nums.push(props.current);
  }
  if (props.current + 1 < props.maxPage) {
    nums.push(props.current + 1);
  }
  if (props.current < props.maxPage - 2) {
    nums.push("...");
  }
  if (props.maxPage !== 1 && props.maxPage !== props.current) {
    nums.push(props.maxPage);
  }

  return (
    <ul
      className={getClassName(styles.pagination, props.className)}
      style={style}
    >
      <li
        style={{ cursor: !prev ? "default" : "pointer" }}
        onClick={() => {
          if (prev) {
            props.changePage(props.current - 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path
            fill={prev ? "#6AB8C6" : "#9F9F9F"}
            transform="translate(150,0)"
            d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"
          />
        </svg>
      </li>

      {nums.map((n, i) => (
        <li
          key={i}
          style={{
            cursor: n === "..." ? "default" : "pointer",
            fontWeight: n === props.current ? "bold" : "normal",
          }}
          onClick={() => {
            if (n !== "...") {
              props.changePage(n);
            }
          }}
        >
          {n}
        </li>
      ))}
      <li
        style={{ cursor: !next ? "default" : "pointer" }}
        onClick={() => {
          if (next) {
            props.changePage(props.current + 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path
            fill={next ? "#6AB8C6" : "#9F9F9F"}
            d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"
          />
        </svg>
      </li>
    </ul>
  );
};
