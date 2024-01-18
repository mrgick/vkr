import styles from "./ListOrders.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

const ListOrders = (props) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiShop.get_orders();
      setOrders(res?.data);
    };

    fetchData();
  }, [props.id]);

  return (
    <Layout>
      <Title text="Заказы" />
      {orders.map((order, id) => (
        <section key={order.id} className={styles["section"]}>
          <input
            type="checkbox"
            className={styles["card-checkbox"]}
            id={`card-${order.id}`}
          />
          <label htmlFor={`card-${order.id}`} className={styles["card"]}>
            <p>
              <strong>Заказ #{order.id}</strong> от{" "}
              {new Date(order.date).toLocaleDateString("ru-RU")}
            </p>
            <div className={styles["status"]}>{order.status}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
            >
              <path
                fill="#6AB8C6"
                d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"
              />
            </svg>
          </label>
          <div className={styles["items"]}>
            <table className={styles["table"]}>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Количество</th>
                  <th>Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/shop/${item.product.id}`}>
                        {item.product.title}
                      </Link>
                    </td>
                    <td>{item.quantity} шт.</td>
                    <td>{item.total} ₽</td>
                  </tr>
                ))}
                <tr>
                  <td>Итого</td>
                  <td>{order.count} шт</td>
                  <td>{order.total} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </Layout>
  );
};

export default ListOrders;
