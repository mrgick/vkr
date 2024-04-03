import { API_URL, resolve } from "./base";
import axios from "axios";

export const get_info = async () =>
  await resolve(axios.get(`${API_URL}/account/info/`)).then(
    (res) => res.data
  );
