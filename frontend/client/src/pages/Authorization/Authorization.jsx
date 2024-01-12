import styles from "./Authorization.module.css";
import Layout from "../../components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "../../components/uiKit";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Authorization = (props) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const authorize = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    await login(value.username, value.password);
    navigate("/");
  };
  return (
    <Layout className={styles.layout}>
      <Title text="Авторизация" />
      <Form onSubmit={authorize}>
        <FormGroup>
          <Label htmlFor="id_username" title="Имя пользователя">
            Имя пользователя
          </Label>
          <Input
            type="text"
            name="username"
            autoFocus=""
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
        <FormGroup>
          <Button type="submit" style={{ marginLeft: "auto", marginRight: 0 }}>
            Войти
          </Button>
        </FormGroup>
      </Form>
    </Layout>
  );
};

export default Authorization;
