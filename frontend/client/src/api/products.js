import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_categories = async () =>
  await resolve(axios.get(`${API_URL}/shop/categories/`)).then(
    (res) => res.data
  );

export const get_products = async (category) =>
  await resolve(
    axios.get(`${API_URL}/shop/products/${category ? category + "/" : ""}`)
  ).then((res) => res.data);

export const get_product = async (id) =>
  await resolve(axios.get(`${API_URL}/shop/product/${id}/`)).then(
    (res) => res.data
  );

export const get_cart = async () =>
  await resolve(axios.get(`${API_URL}/shop/cart/`)).then((res) => res.data);

export const update_cart_item = async (product, quantity) =>
  await resolve(
    axios.post(`${API_URL}/shop/cart-item/`, {
      product: product,
      quantity: quantity,
    })
  ).then((res) => res.data);
