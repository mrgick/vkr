import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_categories = async () =>
  await resolve(axios.get(`${API_URL}/shop/categories/`)).then(
    (res) => res.data,
  );

export const get_products = async (category, search = "") =>
  await resolve(
    axios.get(
      `${API_URL}/shop/products/${category ? category + "/" : ""}?search=${search}`,
    ),
  ).then((res) => res.data);

export const get_product = async (id) =>
  await resolve(axios.get(`${API_URL}/shop/product/${id}/`)).then(
    (res) => res.data,
  );

export const get_cart = async () =>
  await resolve(axios.get(`${API_URL}/shop/cart/`)).then((res) => res.data);

export const get_cart_products = async () =>
  await resolve(axios.get(`${API_URL}/shop/cart-products/`)).then(
    (res) => res.data,
  );

export const create_update_cart_item = async (product, quantity) =>
  await resolve(
    axios.post(`${API_URL}/shop/cart-item/${product}/`, {
      quantity: quantity,
    }),
  ).then((res) => res.data);

export const delete_cart_item = async (product) =>
  await resolve(axios.delete(`${API_URL}/shop/cart-item/${product}/`)).then(
    (res) => res.data,
  );

export const create_order = async () =>
  await resolve(axios.post(`${API_URL}/shop/orders/`)).then((res) => res.data);

export const get_orders = async (page = 1) =>
  await resolve(axios.get(`${API_URL}/shop/orders/?page=${page}`)).then(
    (res) => res.data,
  );
