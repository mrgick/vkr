import styles from "./ForgotPasswordConfirmation.module.css";
import Layout from "../../components/Layout/Layout";
import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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

const ForgotPasswordConfirmation = (props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  const [error, setError] = useState([]);

  const registrate = async (e) => {
    e.preventDefault();
    if (!id || !token) {
      setError(["Время ожидания смены пароля истекло"]);
      return;
    }

    setError(null);
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    try {
      let res = await apiAuth.reset_password_confirmation(
        id,
        token,
        value.password1,
        value.password2
      );
      console.log(res)
      navigate("/login")
    } catch (e) {
      let a = { error: "Неправильно заполненная форма" };
      if (e?.request?.response) {
        try {
          a = JSON.parse(e?.request?.response);
        } catch {}
      }
      setError(Object.values(a));
    }
  };
  return (
    <Layout className={styles.layout}>
      <Title text="Смена пароля" />
      <Form onSubmit={registrate}>
        <FormGroup>
          <Label htmlFor="id_password1" title="Пароль">
            Пароль
          </Label>
          <Input
            type="password"
            name="password1"
            autoComplete="new-password"
            required
            id="id_password1"
          />
        </FormGroup>
        <FormGroup>
          <FormHelp>
            <ul>
              <li>
                Пароль не должен быть слишком похож на другую вашу личную
                информацию.
              </li>
              <li>Ваш пароль должен содержать как минимум 8 символов.</li>
              <li>Пароль не должен быть слишком простым и распространенным.</li>
              <li>Пароль не может состоять только из цифр.</li>
            </ul>
          </FormHelp>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="id_password2" title="Подтверждение пароля">
            Подтверждение пароля
          </Label>
          <Input
            type="password"
            name="password2"
            autoComplete="new-password"
            required
            id="id_password2"
          />
        </FormGroup>
        <FormGroup>
          <FormHelp>
            Для подтверждения введите, пожалуйста, пароль ещё раз.
          </FormHelp>
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
            Сменить пароль
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

export default ForgotPasswordConfirmation;
