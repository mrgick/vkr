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

export const get_reviews = async (product_id, page = 1) =>
  await resolve(
    axios.get(`${API_URL}/shop/reviews/${product_id}/?page=${page}`),
  ).then((res) => res.data);

export const get_review = async (product_id) =>
  await resolve(axios.get(`${API_URL}/shop/review/${product_id}/`)).then(
    (res) => res.data,
  );
export const delete_review = async (product_id) =>
  await resolve(axios.delete(`${API_URL}/shop/review/${product_id}/`)).then(
    (res) => res.data,
  );
export const create_review = async (formData) =>
  await resolve(
    axios.post(`${API_URL}/shop/review/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  ).then((res) => res.data);

export const update_review = async (product_id, formData) =>
  await resolve(
    axios.put(`${API_URL}/shop/review/${product_id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  ).then((res) => res.data);
