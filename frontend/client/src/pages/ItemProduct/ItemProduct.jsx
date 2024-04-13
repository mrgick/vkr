import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ItemProduct.module.css";
import Layout from "../../components/Layout/Layout";
import {
  Button,
  Pagination,
  Title,
  Form,
  Label,
  TextArea,
  FormGroup,
  Select,
} from "../../components/uiKit";
import { apiShop } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

const ItemProduct = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [inCart, setInCart] = useState(false);
  const [rating, setRating] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiShop.get_reviews(id, page);
      if (res) {
        setReviews(res.data.data);
        setMaxPage(res.data.max_page);
      }
    };

    fetchData();
  }, [page]);

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
      {user && (
        <section className={styles.comments}>
          <h2>Ваш отзыв</h2>
          <Form>
            <FormGroup>
              <Label htmlFor="id_rating">Оценка</Label>
              <Select id="id_rating" elements={[{value:"1",text:"1"}]} disabled={true}/>
            </FormGroup>
            <FormGroup column={true}>
              <Label htmlFor="id_text">Комментарий</Label>
              <TextArea name="text" cols="40" rows="5" required id="id_text" disabled={true}/>
            </FormGroup>
            <Button>Сохранить</Button>
          </Form>
        </section>
      )}
      {reviews.length > 0 && (
        <>
          <section className={styles.comments}>
          <h2>Комментарии</h2>
            {reviews.map((item, i) => (
              <div key={i} className={styles.comment}>
                <div className={styles.comment_top}>
                  <p className={styles.comment_top_left}>
                    <span className={styles.comment_star}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                      >
                        <path
                          fill="#EBB765"
                          d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"
                        />
                      </svg>
                      <span>{item.rating}</span>
                    </span>
                    <span className={styles.comment_author}>
                      {item.author.username}
                    </span>
                  </p>
                  <p className={styles.comment_date}>
                    {new Date(item.date).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div>{item.text}</div>
              </div>
            ))}
          </section>
          <Pagination
            current={page}
            maxPage={maxPage}
            changePage={(page) => setPage(page)}
            className={styles.comment_pagination}
          />
        </>
      )}
    </Layout>
  );
};
export default ItemProduct;
