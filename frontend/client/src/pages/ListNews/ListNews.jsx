import styles from "./ListNews.module.css";
import { get_list_news } from "../../api/news";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";

const ListNews = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get_list_news();
      setData(response.data);
    };

    fetchData();
  }, []);

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
