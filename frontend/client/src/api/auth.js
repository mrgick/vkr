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

export const is_auth = async () =>
  await resolve(axios.get(`${API_URL}/is-auth/`, {})).then((res) => res.data);

export const registration = async (
  username,
  email,
  first_name,
  last_name,
  password1,
  password2
) =>
  await axios.post(`${API_URL}/registration/`, {
    username: username,
    email: email,
    first_name: first_name,
    last_name: last_name,
    password1: password1,
    password2: password2,
  });
