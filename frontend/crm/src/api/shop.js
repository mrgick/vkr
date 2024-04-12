import { BASE_API_URL, API_URL, resolve } from "./base";
import axios from "axios";

export const get_category_list = async () =>
  await resolve(axios.get(`${BASE_API_URL}/shop/categories/`)).then(
    (res) => res.data,
  );

export const get_categories = async (page = 1, search = "") =>
  await resolve(
    axios.get(`${API_URL}/categories/?page=${page}&search=${search}`),
  ).then((res) => res.data);

export const create_category = async (formData) =>
  await resolve(
    axios.post(`${API_URL}/categories/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );

export const get_category_item = async (id) =>
  await resolve(axios.get(`${API_URL}/category/${id}/`)).then(
    (res) => res.data,
  );

export const edit_category = async (id, formData) =>
  await resolve(
    axios.patch(`${API_URL}/category/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );

export const delete_category = async (id) =>
  await resolve(axios.delete(`${API_URL}/category/${id}/`));

export const get_products = async (page = 1, search = "") =>
  await resolve(
    axios.get(`${API_URL}/products/?page=${page}&search=${search}`),
  ).then((res) => res.data);

export const create_product = async (formData) =>
  await resolve(
    axios.post(`${API_URL}/products/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );

export const get_product_item = async (id) =>
  await resolve(axios.get(`${API_URL}/product/${id}/`)).then((res) => res.data);

export const edit_product = async (id, formData) =>
  await resolve(
    axios.patch(`${API_URL}/product/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );

export const delete_product = async (id) =>
  await resolve(axios.delete(`${API_URL}/product/${id}/`));

export const get_orders = async (page = 1, search = "") =>
  await resolve(
    axios.get(`${API_URL}/orders/?page=${page}&search=${search}`),
  ).then((res) => res.data);

export const get_order = async (id) =>
  await resolve(axios.get(`${API_URL}/order/${id}/`)).then((res) => res.data);

export const edit_order = async (id, formData) =>
  await resolve(
    axios.patch(`${API_URL}/order-update/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );

export const delete_order = async (id) =>
  await resolve(axios.delete(`${API_URL}/order/${id}/`));
