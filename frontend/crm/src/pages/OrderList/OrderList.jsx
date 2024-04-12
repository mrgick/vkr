import styles from "./OrderList.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pagination, Search, Button, Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop } from "../../api";

const OrderList = (props) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_orders(page, search);
      if (response) {
        setData(response.data.data);
        setMaxPage(response.data.max_page);
      }
    };

    fetchData();
  }, [page, search]);

  const get_status_color = (status) => {
    switch (status) {
      case "В обработке":
        return "rgb(242, 180, 63)";
      case "Ожидает выдачи":
        return "#6AB8C6";
      case "Завершён":
        return "#B4DEE6";
      default:
        return "#6AB8C6";
    }
  };

  return (
    <Layout>
      <Title text="Заказы" />
      <Search onClick={(text) => setSearch(text)} />
      {data.map((item) => (
        <div key={item.id} className={styles.card_wrapper}>
          <Link to={`/order/${item.id}`} className={styles.card}>
            <p className={styles.title}>Заказ #{item.id}</p>
            <p>{item.total}₽</p>
            <p>от {new Date(item.date).toLocaleDateString("ru-RU")}</p>
            <p>{item?.client?.username}</p>
            <p
              className={styles.status}
              style={{ backgroundColor: get_status_color(item.status) }}
            >
              {item.status}
            </p>
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

export default OrderList;
