import { Routes, Route } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import Home from "../Home/Home";
import Authorization from "../Authorization/Authorization";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ProtectedRoute } from "../../components/ProtectedRoute/ProtectedRoute";
import { Loader } from "../../components/uiKit";
import NewsList from "../NewsList/NewsList";
import NewsCreate from "../NewsCreate/NewsCreate";

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
          <Route path="login" element={<Authorization />} />
          <Route element={<ProtectedRoute />}>
            <Route path="news" element={<NewsList />} />
            <Route path="news-create" element={<NewsCreate />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
