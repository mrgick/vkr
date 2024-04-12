import styles from "./ChangePassword.module.css";
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
import { apiAccount } from "../../api";

const ChangePassword = (props) => {
  const [error, setError] = useState(null);
  const [changed, setChanged] = useState(false);

  const change_password = async (e) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    let res = await apiAccount.change_password(
      value.password,
      value.password1,
      value.password2,
    );
    console.log(res);
    if (!res.error) {
      setChanged(true);
    } else {
      let a = { error: "Неправильно заполнена форма" };
      if (res.error?.request?.response) {
        try {
          a = JSON.parse(res.error?.request?.response);
        } catch {}
      }
      setError(Object.values(a));
    }
  };
  return (
    <Layout className={styles.layout}>
      <Title text="Изменение пароля" />
      {changed && (
        <FormGroup>
          <FormHelp>Пароль успешно изменён!</FormHelp>
        </FormGroup>
      )}
      {!changed && (
        <Form onSubmit={change_password}>
          <FormGroup>
            <Label htmlFor="id_password" title="Текущий пароль">
              Текущий пароль
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
            <Label htmlFor="id_password1" title="Новый пароль">
              Новый пароль
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
            <Label htmlFor="id_password2" title="Подтверждение нового пароля">
              Подтверждение нового пароля
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
              Изменить пароль
            </Button>
          </FormGroup>
        </Form>
      )}
      <Link to="/profile">
        <Button
          style={{
            width: "100%",
            backgroundColor: "#69B6FA",
            marginBottom: "30px",
          }}
        >
          Обратно в профиль
        </Button>
      </Link>
    </Layout>
  );
};

export default ChangePassword;
