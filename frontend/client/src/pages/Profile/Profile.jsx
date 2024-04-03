import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiAccount } from "../../api";
import { useAuth } from "../../providers/AuthProvider";
import {
  TitleLinks,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormHelp,
  FormError,
} from "../../components/uiKit";
const Profile = (props) => {
  const [info, setInfo] = useState(null);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiAccount.profile();
      setInfo(res?.data);
    };

    fetchData();
  }, [props.id]);

  const profileSave = async (e) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    const res = await apiAccount.update(
      value.first_name,
      value.last_name,
      value.email
    );
    if (res) {
      setInfo(res?.data);
      setEdit(false);
    } else {
      setError(true);
    }
  };

  return (
    <Layout>
      <TitleLinks
        links={[
          { to: "/orders", text: "Заказы" },
          { to: "/profile", text: "Профиль", active: true },
        ]}
      />
      {info && (
        <Form onSubmit={profileSave}>
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
              disabled={true}
              value={info.username}
            />
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
              disabled={!edit}
              defaultValue={info.first_name}
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
              disabled={!edit}
              defaultValue={info.last_name}
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
              disabled={!edit}
              defaultValue={info.email}
            />
          </FormGroup>

          {!!error && (
            <FormGroup>
              {" "}
              <FormError
                elements={[
                  "Произошла ошибка при сохранении формы. Попробуйте снова попозже.",
                ]}
              />
            </FormGroup>
          )}
          <FormGroup>
            {!edit && (
              <Button
                onClick={() => {
                  setEdit(true);
                }}
                style={{ width: "100%", marginLeft: "auto", marginRight: 0 }}
              >
                Редактировать данные
              </Button>
            )}
            {edit && (
              <Button
                type="submit"
                style={{ width: "100%", marginLeft: "auto", marginRight: 0 }}
              >
                Сохранить
              </Button>
            )}
          </FormGroup>
        </Form>
      )}
      <Link to="/change-password">
        <Button style={{ width: "100%", marginBottom: "30px", backgroundColor: "#69B6FA" }}>
          Изменить пароль
        </Button>
      </Link>
    </Layout>
  );
};

export default Profile;
