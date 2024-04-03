import styles from "./TitleLinks.module.css";
import { Link } from "react-router-dom";

export const TitleLinks = (props) => {
  return (
    <div className={styles.title}>
      {props.links.map((link) => (
        <Link
          to={link.to}
          style={link?.active ? { textDecoration: "underline" } : {}}
        >
          {link.text}
        </Link>
      ))}
    </div>
  );
};
