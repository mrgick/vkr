import styles from "./Cart.module.css";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiShop } from "../../api";
import { Loader, Button } from "../../components/uiKit";
const Cart = (props) => {
  const [object, setObject] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_cart();
      if (response) {
        setObject(response.data);
        setLoad(false);
      }
    };

    fetchData();
  }, [props.id]);

  const changeClick = async (product_id, quantity) => {
    setLoad(true);
    if (quantity <= 0) {
      await apiShop.delete_cart_item(product_id);
    } else {
      await apiShop.create_update_cart_item(product_id, quantity);
    }
    const response = await apiShop.get_cart();
    if (response) {
      setObject(response.data);
    }
    setLoad(false);
  };

  return (
    <Layout>
      <Title text="Корзина" />
      {load && <Loader />}
      {!load && (
        <>
          <div className={styles["table-wrapper"]}>
            <table className={styles["table"]}>
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
                        <Link to={`shop/${item.product.id}`}>
                          {item.product.title}
                        </Link>
                      </td>
                      <td className={styles["cost"]}>{item.product.price} ₽</td>
                      <td>
                        <div className={styles["quantity"]}>
                          <button
                            onClick={() =>
                              changeClick(item.product.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              changeClick(item.product.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
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
            <Button className={styles["buy-btn"]}>Оформить</Button>
          )}
        </>
      )}
    </Layout>
  );
};

export default Cart;
