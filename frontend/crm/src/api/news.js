import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_news = async (page = 1, search = "") =>
  await resolve(
    axios.get(`${API_URL}/news/?page=${page}&search=${search}`)
  ).then((res) => res.data);

export const create_news = async (formData) =>
  await resolve(
    axios.post(`${API_URL}/news/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

export const get_news_item = async (id) =>
  await resolve(axios.get(`${API_URL}/news/${id}/`)).then((res) => res.data);

export const edit_news = async (id, formData) =>
  await resolve(
    axios.patch(`${API_URL}/news/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

export const delete_news = async (id) =>
  await resolve(axios.delete(`${API_URL}/news/${id}`));
