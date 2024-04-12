import styles from "./OrderEdit.module.css";
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
import { apiShop, toErrorsList } from "../../api";

const OrderEdit = (props) => {
  let { id } = useParams();
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiShop.get_order(id);
      let status = response.data.status;
      let c = [
        { value: 0, text: "В обработке" },
        { value: 1, text: "Ожидает выдачи" },
        { value: 2, text: "Завершён" },
      ];
      c.find((e) => e.text === status).active = true;
      setStatus(c);
    };

    fetchData();
  }, [id]);

  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const editOrder = async (e) => {
    e.preventDefault();
    setError([]);
    const data = new FormData(e.target);
    let res = await apiShop.edit_order(id, data);
    if (res?.data) {
      navigate(`/order/${id}`);
    } else {
      setError(toErrorsList(res?.error?.request?.response));
    }
  };

  return (
    <Layout>
      <Title text={`Редактирование заказа #${id}`} />
      {status.length > 0 && (
        <Form onSubmit={editOrder} encType="multipart/form-data">
          <FormGroup>
            <Label htmlFor="id_status" title="Статус">
              Статус
            </Label>
            <Select name="status" id="id_status" elements={status} />
          </FormGroup>

          {error.length > 0 && (
            <FormGroup>
              <FormError elements={error} />
            </FormGroup>
          )}

          <FormGroup>
            <Button type="submit" style={{ width: "100%" }}>
              Сохранить
            </Button>
          </FormGroup>
        </Form>
      )}
      <FormLink to={`/order/${id}`} text="Назад к заказу" />
    </Layout>
  );
};

export default OrderEdit;
