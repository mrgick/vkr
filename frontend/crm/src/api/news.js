import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_last_news = async () =>
  await resolve(axios.get(`${API_URL}/news/last/`)).then((res) => res.data);

export const get_list_news = async () =>
  await resolve(axios.get(`${API_URL}/news/`)).then((res) => res.data);

export const get_news = async (pk) =>
  await resolve(axios.get(`${API_URL}/news/${pk}/`)).then((res) => res.data);
