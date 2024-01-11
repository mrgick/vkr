import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get_product } from "../../api/products";
import styles from "./ItemProduct.module.css";
import Layout from "../../components/Layout/Layout";
import { Title } from "../../components/uiKit";

const ItemProduct = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get_product(id);
      setObject(response.data);
    };

    fetchData();
  }, [id]);

  return (
    <Layout>
      {object && (
        <>
          <Title text={object.title} />
          <section className={styles["product-top"]}>
            <div className={styles["wrapper-img"]}>
              <img src={object.image} alt="Изображение товара"/>
            </div>
            <aside className={styles["product-top-middle"]}>
              <div className={styles["wrapper-buy"]}>
                <div className={styles["buy-price"]}>{object.price} ₽</div>
                <div className={styles["buy-description"]}>
                  <div>В наличии - {object.stock ? "Есть" : "Нет"}</div>
                  <div>Категория - {object.category}</div>
                </div>
                {/* {object.stock > 0 ?
            <button >Купить</button>
            <button >В корзине</button>
            :
            <button className={styles["buy-button"]} disabled>Нет в наличии</button>
            } */}
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
