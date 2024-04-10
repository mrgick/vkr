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
import NewsDelete from "../NewsDelete/NewsDelete";
import NewsEdit from "../NewsEdit/NewsEdit";
import CategoryList from "../CategoryList/CategoryList";
import CategoryCreate from "../CategoryCreate/CategoryCreate";
import CategoryEdit from "../CategoryEdit/CategoryEdit";
import CategoryDelete from "../CategoryDelete/CategoryDelete";

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
            <Route path="news-delete/:id" element={<NewsDelete />} />
            <Route path="news-edit/:id" element={<NewsEdit />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="category-create" element={<CategoryCreate />} />
            <Route path="category-edit/:id" element={<CategoryEdit />} />
            <Route path="category-delete/:id" element={<CategoryDelete />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
