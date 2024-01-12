import styles from "./Cart.module.css";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiShop } from "../../api";

const Cart = (props) => {
  const [object, setObject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_cart();
      if (response) {
        setObject(response.data)
    }
    };

    fetchData();
  }, [props.id]);
  return (
    <Layout>
      <Title text="Корзина" />
      <div className={styles["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>Товар</th>
              <th className={styles["cost"]}>Цена за штуку</th>
              <th>Количество</th>
              <th>Стоимость</th>
            </tr>
          </thead>
          {object && (
            <tbody>
              {object?.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`shop/${item.product.id}`}>{item.product.title}</Link>
                  </td>
                  <td className={styles["cost"]}>{item.product.price} ₽</td>
                  <td>
                    <div className={styles["quantity"]}>
                      <form method="POST">
                        <button>-</button>
                      </form>

                      <span>{item.quantity}</span>

                      <form method="POST">
                        <button>+</button>
                      </form>
                    </div>
                  </td>
                  <td>{item.total}₽</td>
                </tr>
              ))}
              <tr>
                <td>Итого</td>
                <td className={styles["cost"]}></td>
                <td>{object.count} шт</td>
                <td>{object.total} ₽</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {object?.items && (
        <form action="." method="POST">
          <button className={styles["buy-btn"]}>Оформить</button>
        </form>
      )}
    </Layout>
  );
};

export default Cart;
