import styles from "./RegistrationConfirmation.module.css";
import Layout from "../../components/Layout/Layout";
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Title,
  FormGroup,
  Button,
  FormHelp,
  FormError,
} from "../../components/uiKit";
import { apiAuth } from "../../api";
import { Loader } from "../../components/uiKit";

const RegistrationConfirmation = (props) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [load, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (success || error || !load) {
        return;
      }
      if (!token) {
        setError(true);
        return;
      }

      try {
        await apiAuth.registration_confirmation(token);
        setSuccess(true);
      } catch (e) {
        setError(true);
      }
      setLoader(false);
    };

    fetchData();
  }, [token]);

  return (
    <Layout className={styles.layout}>
      <Title text="Подтверждение регистрации" />
      {!!load && (
        <FormGroup>
          <Loader />
        </FormGroup>
      )}
      {!!success && (
        <FormGroup>
          <FormHelp>
            Подтверждение регистрации прошло успешно. Теперь вы можете войти в
            свой аккаунт.
          </FormHelp>
        </FormGroup>
      )}
      {!!error && (
        <FormGroup>
          <FormError
            elements={[
              "Ссылка недействительна (попробуйте зарегистрироваться заново).",
            ]}
          />
        </FormGroup>
      )}
      <Link to="/login">
        <Button style={{ width: "100%", backgroundColor: "#69B6FA" }}>
          Войти
        </Button>
      </Link>
    </Layout>
  );
};

export default RegistrationConfirmation;
