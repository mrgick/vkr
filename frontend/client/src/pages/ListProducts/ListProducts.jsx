import styles from "./ListProducts.module.css";
import { get_categories, get_products } from "../../api/products";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Title from "../../components/uiKit/Title/Title";
import Layout from "../../components/Layout/Layout";

const ListProducts = (props) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (categories.length === 0) {
        const response = await get_categories();
        setCategories(response.data);
      }
      const res = await get_products(active);
      setProducts(res.data);
    };

    fetchData();
  }, [active, categories]);

  const changeActive = (category_id) => {
    if (category_id === active) {
      setActive(null);
    } else {
      setActive(category_id);
    }
  };

  return (
    <Layout ContainerStyle={{ maxWidth: "100%" }}>
      <Title text="Каталог" />
      <div className={styles.shop}>
        <section className={styles.categories}>
          <div className={styles["category-wrapper"]}>
            <h2>Категории</h2>
            {categories.map((category) => (
              <article
                key={category.id}
                className={styles.category}
                onClick={() => changeActive(category.id)}
              >
                <p style={category.id === active ? { fontWeight: "bold" } : {}}>
                  {category.title}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.products}>
          {products.map((product) => (
            <Link
              to={`/shop/${product.id}`}
              key={product.id}
              className={styles.product}
            >
              <div className={styles["product-img"]}>
                <img src={product.image} alt="Изображение товара" />
              </div>
              <div className={styles.title}>
                <p>{product.title}</p>
              </div>
              <div className={styles["buy-wrapper"]}>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path
                      fill="#FFFFFF"
                      d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"
                    />
                  </svg>
                  <span>{product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default ListProducts;
