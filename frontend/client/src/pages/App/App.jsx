import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<Contacts />} />
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          {/* <Route path="*" element={<NoMatch />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
