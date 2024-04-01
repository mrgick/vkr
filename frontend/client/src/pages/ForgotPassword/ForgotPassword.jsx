import styles from "./ForgotPassword.module.css";
import Layout from "../../components/Layout/Layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormHelp,
  FormError,
} from "../../components/uiKit";
import { apiAuth } from "../../api";

const ForgotPassword = (props) => {
  const [error, setError] = useState([]);
  const [send, setSend] = useState(null);

  const registrate = async (e) => {
    e.preventDefault();
    setError(null);
    setSend(null);
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    try {
      await apiAuth.reset_password(value.email);
      setSend(true);
    } catch (e) {
      setError(["Email не найден"]);
    }
  };
  return (
    <Layout className={styles.layout}>
      <Title text="Восстановление пароля" />
      <Form onSubmit={registrate}>
        <FormGroup>
          <Label htmlFor="id_email" title="Email">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            maxLength="320"
            required
            id="id_email"
          />
        </FormGroup>
        {!!send && (
          <FormGroup>
            <FormHelp>
              Письмо с ссылкой на восстановление пароля отправлено на почту!
            </FormHelp>
          </FormGroup>
        )}
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
            Отправить письмо
          </Button>
        </FormGroup>
      </Form>
      <Link to="/login">
        <Button style={{ width: "100%", backgroundColor: "#69B6FA" }}>
          Вспомнили пароль?
        </Button>
      </Link>
    </Layout>
  );
};

export default ForgotPassword;
