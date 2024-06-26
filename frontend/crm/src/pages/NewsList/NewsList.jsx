import styles from "./NewsList.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title, Pagination, Search, Button } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiNews, CLIENT_URL } from "../../api";

const NewsList = (props) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiNews.get_news(page, search);
      if (response) {
        setData(response.data.data);
        setMaxPage(response.data.max_page);
      }
    };

    fetchData();
  }, [page, search]);

  return (
    <Layout>
      <Title text="Новости" />
      <Link to="/news-create" style={{ marginTop: "30px" }}>
        <Button
          style={{
            width: "100%",
            margin: "0px",
            padding: "20px",
            fontSize: "20px",
          }}
        >
          Создать новость
        </Button>
      </Link>
      <Search onClick={(text) => setSearch(text)} />
      {data.map((news) => (
        <article key={news.id} className={styles.card}>
          <div className={styles.description}>
            <p className={styles.title}>
              <Link target="_blank" to={CLIENT_URL + "/news/" + news.id}>
                #{news.id}. {news.title}
              </Link>
            </p>
            <p>от {new Date(news.date).toLocaleDateString("ru-RU")}</p>
          </div>
          <div className={styles.activity}>
            <Link to={`/news-edit/${news.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                viewBox="0 -960 960 960"
                width="40"
              >
                <path
                  fill="#6AB8C6"
                  d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                />
              </svg>
            </Link>
            <Link to={`/news-delete/${news.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                viewBox="0 -960 960 960"
                width="40"
              >
                <path
                  fill="brown"
                  d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                />
              </svg>
            </Link>
          </div>
        </article>
      ))}
      <Pagination
        current={page}
        maxPage={maxPage}
        changePage={(page) => setPage(page)}
      />
    </Layout>
  );
};

export default NewsList;
