import styles from "./ProductEdit.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Title,
  Button,
  Form,
  Input,
  FormGroup,
  FormError,
  Label,
  FormLink,
  TextArea,
  Select,
  Image,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop, toErrorsList } from "../../api";

const ProductEdit = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let res = await apiShop.get_category_list();
      const response = await apiShop.get_product_item(id);
      let c = res.data.map(function (item) {
        return {
          value: item.id,
          text: item.title,
        };
      });
      if (response?.data?.category === null) {
        c.push({ value: "", text: "---------", active: true });
      } else {
        c.forEach((item) => {
          if (item.text === response?.data?.category) {
            item.active = true;
          }
        });
        c.push({ value: "", text: "---------" });
      }
      setCategories(c);
      setObject(response?.data);
    };

    fetchData();
  }, [id]);

  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const editProduct = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    if (data.get("image").size === 0) {
      data.delete("image");
    }
    if (data.get("stock") === null) {
      data.set("stock", false);
    }
    let res = await apiShop.edit_product(id, data);
    if (res?.data) {
      navigate("/products");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Редактирование товара с id=${id}`} />
      {!!object && (
        <Form onSubmit={editProduct} encType="multipart/form-data">
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
              defaultValue={object.title}
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
              defaultValue={object.description}
            ></TextArea>
          </FormGroup>

          <FormGroup column={true}>
            <Label htmlFor="id_image" title="Изображение">
              Изображение
            </Label>
            <Input type="file" name="image" accept="image/*" id="id_image" />
            <Image src={object.image}></Image>
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
            <Input
              type="checkbox"
              name="stock"
              id="id_stock"
              defaultChecked={object.stock}
            />
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
              required
              id="id_price"
              defaultValue={object.price}
            />
          </FormGroup>

          {error.length > 0 && (
            <FormGroup>
              <FormError elements={error} />
            </FormGroup>
          )}

          <FormGroup>
            <Button type="submit" style={{ width: "100%" }}>
              Сохранить
            </Button>
          </FormGroup>
        </Form>
      )}
      <FormLink to="/products" text="Назад к товарам" />
    </Layout>
  );
};

export default ProductEdit;
