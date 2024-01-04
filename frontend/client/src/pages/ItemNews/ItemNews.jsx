import styles from "./ItemNews.module.css";
import { get_news } from "../../api/news";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Title from "../../components/uiKit/Title/Title";
import Layout from "../../components/Layout/Layout";
import { useParams } from "react-router-dom";

const ItemNews = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get_news(id);
      console.log(response);
      setObject(response.data);
    };

    fetchData();
  }, [id]);

  return (
    <Layout>
      {object && (
        <>
          <Title text={object?.title} />
          <div className={styles.description}>
            <div className={styles["img-wrapper"]}>
              <img src={object?.image} alt="Картинка новости" />
            </div>
            <p className={styles.content}>
              {object.content.replace("\r", "\n").replace("\n\n", "\n")}
            </p>
            <div className={styles["date-wrapper"]}>
              <span className={styles["date"]}>
                Опубликовано:{" "}
                {new Date(object.date).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
          <div className={styles["wrapper-link"]}>
            <Link to="/news">Назад к новостям</Link>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ItemNews;
