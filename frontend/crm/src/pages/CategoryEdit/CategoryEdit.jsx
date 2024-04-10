import styles from "./CategoryEdit.module.css";
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
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop, toErrorsList } from "../../api";

const CategoryEdit = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_category_item(id);
      setObject(response?.data);
    };

    fetchData();
  }, [id]);

  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const editCategory = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    let res = await apiShop.edit_category(id, data);
    if (res?.data) {
      navigate("/categories");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Редактирование категории с id=${id}`} />
      {!!object && (
        <Form onSubmit={editCategory} encType="multipart/form-data">
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
              defaultValue={object?.title}
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
              Сохранить
            </Button>
          </FormGroup>
        </Form>
      )}
      <FormLink to="/categories" text="Назад к категориям" />
    </Layout>
  );
};

export default CategoryEdit;
