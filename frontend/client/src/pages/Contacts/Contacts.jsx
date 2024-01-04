import styles from "./Contacts.module.css";
import Layout from "../../components/Layout/Layout";
import Title from "../../components/uiKit/Title/Title";

const Contacts = (props) => {
  return (
    <Layout>
      <Title text="Наши контакты" />
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>E-mail</td>
            <td>
              <a
                href="mailto:dharmony@yandex.ru"
                target="_blank"
                rel="noopener noreferrer"
              >
                dharmony@yandex.ru
              </a>
            </td>
          </tr>
          <tr>
            <td>Телефон</td>
            <td>
              <a href="tel:7-000-000-0000">+7 (000) 000-0000</a>
            </td>
          </tr>
          <tr>
            <td>Разработчик</td>
            <td>
              <a href="https://github.com/mrgick/">mrgick</a>
            </td>
          </tr>
          <tr>
            <td>Адрес</td>
            <td>
              <address>улица Труда, 54, Псков, 180019</address>
            </td>
          </tr>
          <tr>
            <td style={{ visibility: "hidden" }}></td>
            <td>
              <iframe
                title="map"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A48140d0e383cb52ffa7aae99a4faafa080d7bd254cd7862483256d2207f804cd&amp;source=constructor"
                frameBorder="0"
              ></iframe>
            </td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
};

export default Contacts;
