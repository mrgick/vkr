import Logo from "../images/Logo";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const { user, logout, userInfo } = useAuth();
  const navigate = useNavigate();
  const clickLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <header className={styles.logo}>
        <Link to="/">
          <Logo />
          <span>Dice Harmony CRM</span>
        </Link>
      </header>
      <div className={styles.wave}>
        <div></div>
      </div>
      <nav className={styles.navbar}>
        <input type="checkbox" id="nav-button" />
        <label htmlFor="nav-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path
              fill="#FFFFFF"
              d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
            />
          </svg>
        </label>
        <div className={styles["navbar-left"]}></div>
        <div className={styles["navbar-center"]}>
          <Link to="/">Заказы</Link>
          <Link to="news">Новости</Link>
          <Link to="categories">Каталог</Link>
          <Link to="/">Пользователи</Link>
        </div>
        <div className={styles["navbar-right"]}>
          {!user && (
            <Link to="login">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  fill="#FFFFFF"
                  d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"
                />
              </svg>
            </Link>
          )}
          {user && (
            <div
              style={{
                color: "white",
              }}
            >
              {userInfo.username}
            </div>
          )}
          {user && (
            <a onClick={clickLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  fill="#FFFFFF"
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
                />
              </svg>
            </a>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
