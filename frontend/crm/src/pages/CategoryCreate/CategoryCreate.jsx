import styles from "./CategoryCreate.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Title,
  Button,
  Form,
  Input,
  FormGroup,
  FormError,
  Label,
  TextArea,
  FormLink,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop, toErrorsList } from "../../api";

const CategoryCreate = (props) => {
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const createCategory = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    let res = await apiShop.create_category(data);
    if (res?.data) {
      navigate("/categories");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text="Создание категории" />
      <Form onSubmit={createCategory} encType="multipart/form-data">
        <FormGroup>
          <Label htmlFor="id_title" title="Название">
            Название
          </Label>
          <Input
            type="text"
            name="title"
            maxLength="100"
            required
            id="id_title"
            autoFocus
          />
        </FormGroup>

        {error.length > 0 && (
          <FormGroup>
            <FormError elements={error} />
          </FormGroup>
        )}

        <FormGroup>
          <Button type="submit" style={{ width: "100%" }}>
            Создать
          </Button>
        </FormGroup>
      </Form>
      <FormLink to="/categories" text="Назад к категориям" />
    </Layout>
  );
};

export default CategoryCreate;
