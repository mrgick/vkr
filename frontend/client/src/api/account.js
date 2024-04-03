import { API_URL, resolve } from "./base";
import axios from "axios";

export const profile = async () =>
  await resolve(axios.get(`${API_URL}/profile/`)).then((res) => res.data);

export const update = async (first_name, last_name, email) =>
  await resolve(
    axios.put(`${API_URL}/profile/`, {
      first_name: first_name,
      last_name: last_name,
      email: email,
    })
  ).then((res) => res.data);

export const change_password = async (password, password1, password2) =>
  await resolve(
    axios.put(`${API_URL}/change-password/`, {
      password: password,
      password1: password1,
      password2: password2,
    }));
