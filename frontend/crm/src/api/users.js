import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_users = async (page = 1, search = "") =>
  await resolve(
    axios.get(`${API_URL}/users/?page=${page}&search=${search}`)
  ).then((res) => res.data);

export const get_user = async (id) =>
  await resolve(axios.get(`${API_URL}/user/${id}/`)).then((res) => res.data);

export const edit_user = async (id, formData) =>
  await resolve(
    axios.patch(`${API_URL}/user/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

export const delete_user = async (id) =>
  await resolve(axios.delete(`${API_URL}/user/${id}/`));
