import styles from "./Authorization.module.css";
import Layout from "../../components/Layout/Layout";
import React, { useState } from "react";
import {
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormError,
} from "../../components/uiKit";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

const Authorization = (props) => {
  const { login } = useAuth();
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const authorize = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    let user = await login(value.username, value.password);
    console.log(user);
    if (!!user) {
      navigate("/");
    } else {
      setError(["Неправильно введено имя пользователя или пароль"]);
    }
  };
  return (
    <Layout className={styles.layout}>
      <Title text="Авторизация в CRM" />
      <Form onSubmit={authorize}>
        <FormGroup>
          <Label htmlFor="id_username" title="Имя пользователя">
            Имя пользователя
          </Label>
          <Input
            type="text"
            name="username"
            autoFocus
            autoCapitalize="none"
            autoComplete="username"
            maxLength="150"
            required
            id="id_username"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="id_password" title="Пароль">
            Пароль
          </Label>
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            id="id_password"
          />
        </FormGroup>
        {!!error && (
          <FormGroup>
            <FormError elements={error} />
          </FormGroup>
        )}
        <FormGroup>
          <Button
            type="submit"
            style={{ width: "100%", marginLeft: "auto", marginRight: 0 }}
          >
            Войти
          </Button>
        </FormGroup>
      </Form>
    </Layout>
  );
};

export default Authorization;
