import styles from "./NewsEdit.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Image,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiNews, toErrorsList } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

const NewsEdit = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiNews.get_news_item(id);
      setObject(response?.data);
    };

    fetchData();
  }, [id]);

  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const createNews = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    data.set("author", userInfo.id);
    data.set("date", new Date().toISOString());
    if (data.get("image").size === 0) {
      data.delete("image");
    }
    let res = await apiNews.edit_news(id, data);
    if (res?.data) {
      navigate("/news");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Редактирование новости с id=${id}`} />
      {!!object && (
        <Form onSubmit={createNews} encType="multipart/form-data">
          <FormGroup>
            <Label htmlFor="id_title" title="Заголовок">
              Заголовок
            </Label>
            <Input
              type="text"
              name="title"
              maxLength="100"
              required
              id="id_title"
              defaultValue={object?.title}
            />
          </FormGroup>

          <FormGroup column={true}>
            <Label htmlFor="id_description" title="Краткое содержание">
              Краткое содержание
            </Label>
            <TextArea
              name="description"
              cols="40"
              rows="10"
              required
              id="id_description"
              defaultValue={object?.description}
            ></TextArea>
          </FormGroup>

          <FormGroup column={true}>
            <Label htmlFor="id_content" title="Полное содержание">
              Полное содержание
            </Label>
            <TextArea
              name="content"
              cols="40"
              rows="10"
              required
              id="id_content"
              defaultValue={object.content}
            ></TextArea>
          </FormGroup>

          <FormGroup column={true}>
            <Label htmlFor="id_image" title="Изображение">
              Изображение
            </Label>
            <Input type="file" name="image" accept="image/*" id="id_image" />
            <Image src={object.image}></Image>
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
      <Link to="/news">
        <Button
          style={{
            width: "100%",
            backgroundColor: "#69B6FA",
            marginBottom: "30px",
          }}
        >
          Назад к новостям
        </Button>
      </Link>
    </Layout>
  );
};

export default NewsEdit;
