import styles from "./Loader.module.css";
export const Loader = (props) => {
  return (
    <div className={styles.loader_wrapper}>
      <div className={styles.loader}></div>
    </div>
  );
};
