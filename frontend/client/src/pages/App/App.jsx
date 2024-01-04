import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import ListNews from "../ListNews/ListNews"
import ItemNews from "../ItemNews/ItemNews";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<Contacts />} />
          <Route path="news" element={<ListNews />} />
          <Route path="news/:id" element={<ItemNews />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
