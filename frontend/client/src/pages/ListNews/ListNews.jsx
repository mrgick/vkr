import styles from "./ListNews.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiNews } from "../../api";

const ListNews = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiNews.get_list_news();
      setData(response.data);
    };

    fetchData();
  }, [props.id]);

  return (
    <Layout>
      <Title text="Новости" />
      {data.map((news) => (
        <Link to={`/news/${news.id}`} key={news.id} className={styles.news}>
          <h6>{news.title}</h6>
          <p>{news.description}</p>
          <div>
            <p>Подробнеe</p>
            <p>{new Date(news.date).toLocaleDateString("ru-RU")}</p>
          </div>
        </Link>
      ))}
    </Layout>
  );
};

export default ListNews;
