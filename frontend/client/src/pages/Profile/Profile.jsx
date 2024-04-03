import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Title } from "../../components/uiKit";
import Layout from "../../components/Layout/Layout";
import { apiShop } from "../../api";
import { useAuth } from "../../providers/AuthProvider";
import { TitleLinks } from "../../components/uiKit";
const Profile = (props) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // const res = await apiShop.get_orders();
      // setInfo(res?.data);
    };

    fetchData();
  }, [props.id]);

  return (
    <Layout>
      <TitleLinks
        links={[
          { to: "/orders", text: "Заказы" },
          { to: "/profile", text: "Профиль", active: true},
        ]}
      />
    </Layout>
  );
};

export default Profile;
