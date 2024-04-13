import styles from "./ListProducts.module.css";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title, Search } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

const ListProducts = (props) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(Number(searchParams.get("category")));
  const [cart, setCart] = useState(new Set());
  const [loading, setLoading] = useState(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (categories.length === 0) {
        const response = await apiShop.get_categories();
        setCategories(response.data);
      }
      console.log(active);
      const res = await apiShop.get_products(active, search);
      setProducts(res.data);
      if (user) {
        const r = await apiShop.get_cart_products();
        setCart(new Set(r.data));
      }
    };

    fetchData();
  }, [active, categories, user, search]);

  const changeActive = (category_id) => {
    if (category_id === active) {
      setActive(null);
      setSearchParams({});
    } else {
      setActive(category_id);
      setSearchParams({ category: category_id });
    }
    console.log(searchParams);
  };

  const addToCartClick = async (product) => {
    if (loading.has(product)) {
      return;
    }
    setLoading((prev) => new Set(prev).add(product));
    const resp = await apiShop.create_update_cart_item(product, 1);
    if (resp) {
      setCart((prev) => new Set(prev).add(product));
    }
    setLoading((prev) => {
      let c = new Set(prev);
      c.delete(product);
      return c;
    });
  };

  const deleteFromCartClick = async (product) => {
    if (loading.has(product)) {
      return;
    }
    setLoading((prev) => new Set(prev).add(product));
    const resp = await apiShop.delete_cart_item(product);
    if (resp) {
      setCart((prev) => {
        let c = new Set(prev);
        c.delete(product);
        return c;
      });
    }
    setLoading((prev) => {
      let c = new Set(prev);
      c.delete(product);
      return c;
    });
  };

  return (
    <Layout ContainerStyle={{ maxWidth: "100%" }}>
      <Title text="Каталог" />
      <Search
        style={{
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "750px",
        }}
        onClick={(text) => setSearch(text)}
      />
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
            <article key={product.id} className={styles.product}>
              <Link
                to={`/shop/${product.id}`}
                className={styles["product-img"]}
              >
                <img src={product.image} alt="Изображение товара" />
              </Link>
              <Link to={`/shop/${product.id}`} className={styles.title}>
                <p>{product.title}</p>
              </Link>
              <div className={styles["buy-wrapper"]}>
                <div
                  className={styles["buy"]}
                  style={cart.has(product.id) ? { background: "#388997" } : {}}
                  disabled={!user}
                  onClick={
                    cart.has(product.id)
                      ? () => deleteFromCartClick(product.id)
                      : () => addToCartClick(product.id)
                  }
                >
                  {!cart.has(product.id) ? (
                    <>
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
                    </>
                  ) : (
                    <span>В корзине</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default ListProducts;
