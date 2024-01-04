import styles from "./Layout.module.css";

const Layout = (props) => {
  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.container}>
            {props.children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
