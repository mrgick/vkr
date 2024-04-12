import styles from "./ProductCreate.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Select,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop, toErrorsList } from "../../api";

const ProductCreate = (props) => {
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let res = await apiShop.get_category_list();
      let c = res.data.map(function (item) {
        return {
          value: item.id,
          text: item.title,
        };
      });
      c.push({ value: "", text: "---------", active: true });
      setCategories(c);
    };

    fetchData();
  }, [props.id]);

  const createProduct = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    let res = await apiShop.create_product(data);
    if (res?.data) {
      navigate("/products");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text="Создание товара" />
      <Form onSubmit={createProduct} encType="multipart/form-data">
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

        <FormGroup column={true}>
          <Label htmlFor="id_description" title="Описание">
            Описание
          </Label>
          <TextArea
            name="description"
            cols="40"
            rows="10"
            required
            id="id_description"
          ></TextArea>
        </FormGroup>

        <FormGroup column={true}>
          <Label htmlFor="id_image" title="Изображение">
            Изображение
          </Label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            required
            id="id_image"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="id_category" title="Категория">
            Категория
          </Label>
          <Select name="category" id="id_category" elements={categories} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="id_stock" title="В наличии">
            В наличии
          </Label>
          <Input type="checkbox" name="stock" id="id_stock" />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="id_price" title="Цена">
            Цена
          </Label>
          <Input
            type="number"
            name="price"
            step="0.01"
            min="0.01"
            defaultValue="0.01"
            required
            id="id_price"
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
      <FormLink to="/products" text="Назад к товарам" />
    </Layout>
  );
};

export default ProductCreate;
