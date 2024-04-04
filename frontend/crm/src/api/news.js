import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_news = async (page = 1) =>
  await resolve(axios.get(`${API_URL}/news/?page=${page}`)).then(
    (res) => res.data
  );

// export const get_news = async (pk) =>
//   await resolve(axios.get(`${API_URL}/news/${pk}/`)).then((res) => res.data);
