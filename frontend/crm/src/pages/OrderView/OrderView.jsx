import styles from "./OrderView.module.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Title,
  Form,
  Input,
  FormGroup,
  Label,
  FormLink,
  Select,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop } from "../../api";

const OrderView = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_order(id);
      setObject(response?.data);
    };

    fetchData();
  }, [id]);

  return (
    <Layout>
      <Title text={`Заказ с id=${id}`} />
      {object && (
        <Form>
          <FormGroup>
            <Label title="Пользователь">Пользователь</Label>
            <Input disabled={true} defaultValue={object.client.username} />
          </FormGroup>
          <FormGroup>
            <Label title="Дата">Дата</Label>
            <Input
              disabled={true}
              defaultValue={new Date(object.date).toLocaleDateString("ru-RU")}
            />
          </FormGroup>
          <FormGroup>
            <Label title="Статус">Статус</Label>
            <Select
              disabled={true}
              elements={[{ value: "", text: object.status, active: true }]}
            />
          </FormGroup>
          <FormGroup className={styles.table_wrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Количество</th>
                  <th>Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {object.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/product/${item.product.id}`}>
                        {item.product.title}
                      </Link>
                    </td>
                    <td>{item.quantity} шт.</td>
                    <td>{item.total} ₽</td>
                  </tr>
                ))}
                <tr>
                  <td>Итого</td>
                  <td>{object.count} шт</td>
                  <td>{object.total} ₽</td>
                </tr>
              </tbody>
            </table>
          </FormGroup>
        </Form>
      )}
      <FormLink to={`/order-edit/${id}`} text="Редактировать" color="#6ab8c6" />
      <FormLink to={`/order-delete/${id}`} text="Удалить" color="brown" />
      <FormGroup></FormGroup>
      <FormLink to="/orders" text="Назад к списку заказов" />
    </Layout>
  );
};

export default OrderView;
