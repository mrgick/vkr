import styles from "./ProductDelete.module.css";
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

const ProductDelete = (props) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const [error, setError] = useState([]);
  const categoryDelete = async (e) => {
    e.preventDefault();
    setError([]);
    let res = await apiShop.delete_product(id);
    if (res?.data) {
      navigate("/products");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Удаление товара с id=${id}`} />
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
      <FormLink to="/products" text="Назад к товарам" />
    </Layout>
  );
};

export default ProductDelete;
