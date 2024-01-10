import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_categories = async () =>
  await resolve(axios.get(`${API_URL}/shop/categories/`)).then((res) => res.data);

export const get_products = async (category) =>
  await resolve(
    axios.get(`${API_URL}/shop/products/${category ? category + "/" : ""}`)
  ).then((res) => res.data);

export const get_product = async (id) =>
  await resolve(axios.get(`${API_URL}/shop/product/${id}/`)).then((res) => res.data);
