import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import ListNews from "../ListNews/ListNews";
import ItemNews from "../ItemNews/ItemNews";
import ItemProduct from "../ItemProduct/ItemProduct";
import ListProducts from "../ListProducts/ListProducts";
import Authorization from "../Authorization/Authorization";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<Contacts />} />
        <Route path="news" element={<ListNews />} />
        <Route path="news/:id" element={<ItemNews />} />
        <Route path="shop" element={<ListProducts />} />
        <Route path="shop/:id" element={<ItemProduct />} />
        <Route path="login" element={<Authorization />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
