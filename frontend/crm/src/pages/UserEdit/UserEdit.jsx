import styles from "./UserEdit.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Title,
  Button,
  Form,
  Input,
  FormGroup,
  FormError,
  Label,
  FormLink,
  TextArea,
  Select,
  Image,
} from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiUsers, toErrorsList } from "../../api";

const UserEdit = (props) => {
  let { id } = useParams();
  const [object, setObject] = useState(null);
  const [edit, setEdit] = useState(false);
  const [role, setRole] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiUsers.get_user(id);
      setObject(response?.data);
      if (response.data.is_staff && response.data.is_superuser) {
        setRole([
          { value: "0", text: "Пользователь" },
          { value: "1", text: "Менеджер" },
          { value: "2", text: "Администратор", active: true },
        ]);
      } else if (response.data.is_staff) {
        setRole([
          { value: "0", text: "Пользователь" },
          { value: "1", text: "Менеджер", active: true },
          { value: "2", text: "Администратор" },
        ]);
      } else {
        setRole([
          { value: "0", text: "Пользователь", active: true },
          { value: "1", text: "Менеджер" },
          { value: "2", text: "Администратор" },
        ]);
      }
    };

    fetchData();
  }, [id]);

  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const editUser = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    let role_selected = Number(data.get("role"));
    data.delete("role");
    if (!role[role_selected]?.active) {
      if (role_selected === 0) {
        data.set("is_staff", false);
        data.set("is_superuser", false);
      } else if (role_selected === 1) {
        data.set("is_staff", true);
        data.set("is_superuser", false);
      } else if (role_selected === 2) {
        data.set("is_staff", true);
        data.set("is_superuser", true);
      }
    }
    let res = await apiUsers.edit_user(id, data);
    if (res?.data) {
      navigate("/users");
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Пользователь с id=${id}`} />
      {object && (
        <Form onSubmit={editUser}>
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
              disabled={!edit}
              defaultValue={object.username}
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
              defaultValue={object.first_name}
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
              defaultValue={object.last_name}
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
              defaultValue={object.email}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="id_role" title="Роль">
              Роль
            </Label>
            <Select name="role" id="id_role" elements={role} disabled={!edit} />
          </FormGroup>

          {error.length > 0 && (
            <FormGroup>
              <FormError elements={error} />
            </FormGroup>
          )}

          <FormGroup>
            {!edit && (
              <Button
                onClick={() => {
                  setEdit(true);
                }}
                style={{ width: "100%" }}
              >
                Редактировать
              </Button>
            )}
            {edit && (
              <Button type="submit" style={{ width: "100%" }}>
                Сохранить
              </Button>
            )}
          </FormGroup>
        </Form>
      )}
      <FormLink to={`/user-delete/${id}`} text="Удалить" color="brown" />
      <FormLink to="/users" text="Назад к списку пользователей" />
    </Layout>
  );
};

export default UserEdit;
