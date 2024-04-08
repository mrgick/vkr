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
