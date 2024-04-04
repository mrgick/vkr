import { API_URL, resolve } from "./base";
import axios from "axios";

export const auth = async (username, password) =>
  await resolve(
    axios.post(
      `${API_URL}/token/`,
      { username: username, password: password },
      { withCredentials: true }
    )
  ).then((res) => res.data);

export const refresh = async () =>
  await resolve(
    axios.post(`${API_URL}/token/refresh/`, {}, { withCredentials: true })
  ).then((res) => res.data);

export const logout = async () =>
  await resolve(
    axios.post(`${API_URL}/token/delete/`, {}, { withCredentials: true })
  ).then((res) => res.data);
