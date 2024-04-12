import axios from "axios";

export const BASE_API_URL = "http://127.0.0.1:8000";
export const API_URL = BASE_API_URL + "/crm";
export const CLIENT_URL = "http://127.0.0.1:3001";

export const resolve = async (promise) => {
  const resolved = {
    data: null,
    error: null,
  };

  try {
    resolved.data = await promise;
  } catch (e) {
    resolved.error = e;
    console.log(e);
    if (
      e?.response?.status === 401 &&
      axios.defaults.headers.common["Authorization"]
    ) {
      try {
        const response = await axios.post(
          `${API_URL}/token/refresh/`,
          {},
          { withCredentials: true },
        );
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.access;
      } catch (e) {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.setItem("user", null);
      }
      try {
        resolved.data = await promise;
      } catch (e) {
        resolved.error = e;
        console.log(e);
      }
    }
  }

  return resolved;
};

export const toErrorsList = (error) => {
  let a = ["Неправильно заполненная форма"];
  if (error) {
    try {
      let d = [];
      let e = JSON.parse(error);
      for (var key in e) {
        d.push(`${key} - ${e[key]}`);
      }
      a = d;
    } catch {}
  }
  return a;
};
