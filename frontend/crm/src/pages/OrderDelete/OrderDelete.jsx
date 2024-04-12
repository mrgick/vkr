import styles from "./OrderDelete.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Title,
  Button,
  Form,
  FormGroup,
  FormError,
  FormLink,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop, toErrorsList } from "../../api";

const OrderDelete = (props) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const [error, setError] = useState([]);
  const categoryDelete = async (e) => {
    e.preventDefault();
    setError([]);
    let res = await apiShop.delete_order(id);
    if (res?.data) {
      navigate("/orders");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Удаление заказа #${id}`} />
      <Form onSubmit={categoryDelete} encType="multipart/form-data">
        {error.length > 0 && (
          <FormGroup>
            <FormError elements={error} />
          </FormGroup>
        )}
        <FormGroup>
          <Button type="submit" style={{ width: "100%" }}>
            Удалить
          </Button>
        </FormGroup>
      </Form>
      <FormLink to={`/order/${id}`} text="Назад к заказу" />
    </Layout>
  );
};

export default OrderDelete;
