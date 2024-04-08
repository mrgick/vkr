import styles from "./NewsDelete.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Title,
  Button,
  Form,
  FormGroup,
  FormError,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiNews } from "../../api";

const NewsDelete = (props) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const [error, setError] = useState([]);
  const editNews = async (e) => {
    e.preventDefault();
    setError([]);
    let res = await apiNews.delete_news(id);
    if (res?.data) {
      navigate("/news");
    } else {
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
      <Title text={`Удаление новости с id=${id}`} />
      <Form onSubmit={editNews} encType="multipart/form-data">
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
      <Link to="/news">
        <Button style={{ width: "100%", backgroundColor: "#69B6FA", marginBottom: "30px" }}>
          Назад к новостям
        </Button>
      </Link>
    </Layout>
  );
};

export default NewsDelete;
