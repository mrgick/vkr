import { Routes, Route } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import ListNews from "../ListNews/ListNews";
import ItemNews from "../ItemNews/ItemNews";
import ItemProduct from "../ItemProduct/ItemProduct";
import ListProducts from "../ListProducts/ListProducts";
import Authorization from "../Authorization/Authorization";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ProtectedRoute } from "../../components/ProtectedRoute/ProtectedRoute";
import Cart from "../Cart/Cart";
import { Loader } from "../../components/uiKit";
import ListOrders from "../ListOrders/ListOrders";
import Registration from "../Registration/Registration";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ForgotPasswordConfirmation from "../ForgotPasswordConfirmation/ForgotPasswordConfirmation";

const App = (props) => {
  const { firstLoad } = useAuth();
  const [appLoad, setAppLoad] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await firstLoad();
      setAppLoad(true);
    };

    fetchData();
  }, [props.id]);
  if (!appLoad) {
    return <Loader />;
  }
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Contacts />} />
          <Route path="news" element={<ListNews />} />
          <Route path="news/:id" element={<ItemNews />} />
          <Route path="shop" element={<ListProducts />} />
          <Route path="shop/:id" element={<ItemProduct />} />
          <Route path="login" element={<Authorization />} />
          <Route path="registrate" element={<Registration />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="forgot-password-confirmation"
            element={<ForgotPasswordConfirmation />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<ListOrders />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
