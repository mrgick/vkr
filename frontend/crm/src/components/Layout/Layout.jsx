import styles from "./Layout.module.css";

const Layout = (props) => {
  return (
    <main className={props.className}>
      <div className={styles.wrapper}>
        <div className={styles.container} style={props.ContainerStyle}>
            {props.children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
