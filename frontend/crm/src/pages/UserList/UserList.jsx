import styles from "./UserList.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pagination, Search, Button, Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiUsers, CLIENT_URL } from "../../api";

const UserList = (props) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiUsers.get_users(page, search);
      if (response) {
        setData(response.data.data);
        setMaxPage(response.data.max_page);
      }
    };

    fetchData();
  }, [page, search]);

  return (
    <Layout>
      <Title text="Пользователи" />
      <Search onClick={(text) => setSearch(text)} />
      {data.map((item) => (
        <div key={item.id} className={styles.card_wrapper}>
          <Link to={`/user/${item.id}`} className={styles.card}>
            <p className={styles.title}>
              #{item.id}. {item.username}
            </p>
            <p>
              ({item.first_name} {item.last_name})
            </p>
            <p>{item.email}</p>
          </Link>
        </div>
      ))}
      <Pagination
        current={page}
        maxPage={maxPage}
        changePage={(page) => setPage(page)}
      />
    </Layout>
  );
};

export default UserList;
