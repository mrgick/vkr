export const API_URL = "http://127.0.0.1:8000";

export const resolve = async (promise) => {
  const resolved = {
    data: null,
    error: null,
  };

  try {
    resolved.data = await promise;
  } catch (e) {
    console.log(e)
  }

  return resolved;
};
