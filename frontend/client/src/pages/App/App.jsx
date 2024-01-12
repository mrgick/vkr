import { Routes, Route } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import ListNews from "../ListNews/ListNews";
import ItemNews from "../ItemNews/ItemNews";
import ItemProduct from "../ItemProduct/ItemProduct";
import ListProducts from "../ListProducts/ListProducts";
import Authorization from "../Authorization/Authorization";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { refresh } from "../../api/auth";
import { useAuth } from "../../providers/AuthProvider";
import axios from "axios";
import { ProtectedRoute } from "../../components/ProtectedRoute/ProtectedRoute";
import Cart from "../Cart/Cart";

const App = (props) => {
  const { firstLoad } = useAuth();
  const [load, setLoad] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await firstLoad();
      setLoad(true);
    };

    fetchData();
  }, [props.id]);
  if (!load) {
    return <></>;
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
          <Route element={<ProtectedRoute />}>
            <Route path="cart" element={<Cart />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
