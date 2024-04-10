import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_categories = async (page = 1, search = "") =>
  await resolve(
    axios.get(`${API_URL}/categories/?page=${page}&search=${search}`)
  ).then((res) => res.data);

export const create_category = async (formData) =>
  await resolve(
    axios.post(`${API_URL}/categories/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

export const get_category_item = async (id) =>
  await resolve(axios.get(`${API_URL}/category/${id}/`)).then(
    (res) => res.data
  );

export const edit_category = async (id, formData) =>
  await resolve(
    axios.patch(`${API_URL}/category/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

export const delete_category = async (id) =>
  await resolve(axios.delete(`${API_URL}/category/${id}`));
