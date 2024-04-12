import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiAuth } from "../api";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    localStorage.setItem("user", user);
  }, [user]);

  const firstLoad = async () => {
    const response = await apiAuth.refresh();
    if (!!response) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.access;
      setUser(true);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(false);
    }
    return user;
  };

  const login = async (username, password) => {
    let response = await apiAuth.auth(username, password);
    if (!!response) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.access;
      setUser(true);
      return true;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(false);
      return false;
    }
  };

  const logout = async () => {
    await apiAuth.logout();
    delete axios.defaults.headers.common["Authorization"];
    setUser(false);
  };

  const value = useMemo(
    () => ({
      user,
      firstLoad,
      login,
      logout,
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthProvider;
