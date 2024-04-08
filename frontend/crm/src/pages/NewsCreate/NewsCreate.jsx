import styles from "./NewsCreate.module.css";
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
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiNews } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

const NewsCreate = (props) => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const createNews = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    data.set("author", userInfo.id);
    console.log(data);
    let res = await apiNews.create_news(data);
    if (res?.data) {
      navigate("/news");
    } else {
      console.log(res);
      let a = ["Неправильно заполненная форма"];
      if (res?.error?.request?.response) {
        try {
          let d = [];
          let e = JSON.parse(res?.error?.request?.response);
          for (var key in e) {
            d.push(`${key} - ${e[key]}`);
          }
          a = d;
        } catch {}
      }
      setError(a);
    }
  };

  return (
    <Layout>
      <Title text="Создание новости" />
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
      <Link to="/news">
        <Button style={{ width: "100%", backgroundColor: "#69B6FA" }}>
          Назад к новостям
        </Button>
      </Link>
    </Layout>
  );
};

export default NewsCreate;
