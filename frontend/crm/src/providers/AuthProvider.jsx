import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiAuth } from "../api";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userInfo, setUserInfo] = useState(localStorage.getItem("userInfo"));

  useEffect(() => {
    localStorage.setItem("user", user);
  }, [user]);

  const firstLoad = async () => {
    const response = await apiAuth.refresh();
    if (!!response) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.access;
      const res = await apiAuth.userInfo();
      setUser(true);
      setUserInfo(res?.data);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(false);
      setUserInfo(null);
    }
    return user;
  };

  const login = async (username, password) => {
    let response = await apiAuth.auth(username, password);
    if (!!response) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.access;
      const res = await apiAuth.userInfo();
      setUser(true);
      setUserInfo(res?.data);
      return true;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(false);
      setUserInfo(null);
      return false;
    }
  };

  const logout = async () => {
    await apiAuth.logout();
    delete axios.defaults.headers.common["Authorization"];
    setUser(false);
    setUserInfo(null);
  };

  const value = useMemo(
    () => ({
      user,
      userInfo,
      firstLoad,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthProvider;
