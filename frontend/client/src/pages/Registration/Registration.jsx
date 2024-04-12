import styles from "./Registration.module.css";
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

const Registration = (props) => {
  const [send, setSend] = useState(null);
  const [error, setError] = useState([]);

  const registrate = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    try {
      await apiAuth.registration(
        value.username,
        value.email,
        value.first_name,
        value.last_name,
        value.password1,
        value.password2,
      );
      setSend(true);
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
      <Title text="Регистрация" />
      {send && (
        <FormGroup>
          <FormHelp>
            Письмо с ссылкой подтверждения регистрации отправлено на почту!
          </FormHelp>
        </FormGroup>
      )}
      {!send && (
        <Form onSubmit={registrate}>
          <FormGroup>
            <Label htmlFor="id_username" title="Имя пользователя">
              Имя пользователя
            </Label>
            <Input
              type="text"
              name="username"
              autoFocus
              autoComplete="username"
              autoCapitalize="none"
              maxLength="150"
              required
              id="id_username"
            />
          </FormGroup>
          <FormGroup>
            <FormHelp>
              Обязательное поле. Не более 150 символов. Только буквы, цифры и
              символы @/./+/-/_.
            </FormHelp>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="id_first_name" title="Имя">
              Имя
            </Label>
            <Input
              type="text"
              name="first_name"
              maxLength="150"
              required
              id="id_first_name"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="id_last_name" title="Фамилия">
              Фамилия
            </Label>
            <Input
              type="text"
              name="last_name"
              maxLength="150"
              required
              id="id_last_name"
            />
          </FormGroup>

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
                <li>
                  Пароль не должен быть слишком простым и распространенным.
                </li>
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
          <FormGroup>{!!error && <FormError elements={error} />}</FormGroup>
          <FormGroup>
            <Button
              type="submit"
              style={{ width: "100%", marginLeft: "auto", marginRight: 0 }}
            >
              Зарегистрироваться
            </Button>
          </FormGroup>
        </Form>
      )}
      <Link to="/login">
        <Button style={{ width: "100%", backgroundColor: "#69B6FA" }}>
          Уже есть аккаунт?
        </Button>
      </Link>
    </Layout>
  );
};

export default Registration;
