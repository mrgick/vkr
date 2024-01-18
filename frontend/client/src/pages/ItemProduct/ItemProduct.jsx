import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ItemProduct.module.css";
import Layout from "../../components/Layout/Layout";
import { Title } from "../../components/uiKit";
import { apiShop } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

const ItemProduct = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);
  const [inCart, setInCart] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_product(id);
      setObject(response.data);
      if (user) {
        const r = await apiShop.get_cart_products();
        setInCart(r.data.includes(response.data.id));
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const addToCartClick = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const resp = await apiShop.create_update_cart_item(object.id, 1);
    if (resp) {
      setInCart(true);
    }
    setLoading(false);
  };

  const deleteFromCartClick = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const resp = await apiShop.delete_cart_item(object.id);
    if (resp) {
      setInCart(false);
    }
    setLoading(false);
  };

  return (
    <Layout>
      {object && (
        <>
          <Title text={object.title} />
          <section className={styles["product-top"]}>
            <div className={styles["wrapper-img"]}>
              <img src={object.image} alt="Изображение товара" />
            </div>
            <aside className={styles["product-top-middle"]}>
              <div className={styles["wrapper-buy"]}>
                <div className={styles["buy-price"]}>{object.price} ₽</div>
                <div className={styles["buy-description"]}>
                  <div>В наличии - {object.stock ? "Есть" : "Нет"}</div>
                  <div>Категория - {object.category}</div>
                </div>
                {!object.stock && (
                  <button
                    className={`${styles["buy-button"]} ${styles["buy-button-stock"]}`}
                    disabled={true}
                  >
                    Нет в наличии
                  </button>
                )}
                {object.stock && (
                  <button
                    className={styles["buy-button"]}
                    disabled={!user ? true : false}
                    style={inCart ? { backgroundColor: "#55909b" } : {}}
                    onClick={
                      inCart
                        ? () => deleteFromCartClick()
                        : () => addToCartClick()
                    }
                  >
                    {inCart ? "В корзине" : "Купить"}
                  </button>
                )}
              </div>
              <div className={styles["wrapper-link"]}>
                <Link to="/shop">Назад</Link>
              </div>
            </aside>
            <aside className={styles["product-top-right"]}></aside>
          </section>
          <section className={styles["product-bottom"]}>
            <h2>Описание</h2>
            <p>
              {object.description.replace("\r", "\n").replace("\n\n", "\n")}
            </p>
          </section>
        </>
      )}
    </Layout>
  );
};
export default ItemProduct;
