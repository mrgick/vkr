import axios from "axios";

export const API_URL = "https://api.dice-harmony.ru";

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
