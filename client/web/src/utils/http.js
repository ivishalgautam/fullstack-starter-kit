import axios from "axios";
const API_ROOT = "http://localhost:3001/v1";

const http = (headerType = "json", baseURL = API_ROOT) => {
  // Create the axios instance
  const client = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  client.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post("/api/refresh-token");
          if (response.statusText === "OK") {
            return http(originalRequest);
          } else {
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  function get(path) {
    return client.get(path).then((response) => response.data);
  }

  function post(path, payload, isFormData = false) {
    let config = {};
    if (isFormData) {
      config.headers = { "Content-Type": "multipart/form-data" };
    }
    return client.post(path, payload, config).then((response) => {
      return response.data;
    });
  }

  function put(path, payload, isFormData = false) {
    let config = {};
    if (isFormData) {
      config.headers = { "Content-Type": "multipart/form-data" };
    }
    return client.put(path, payload, config).then((response) => response.data);
  }

  function patch(path, payload) {
    return client.patch(path, payload).then((response) => response.data);
  }

  function _delete(path, data) {
    if (data) {
      return client
        .delete(path, { data: data })
        .then((response) => response?.data);
    }
    return client.delete(path).then((response) => response.data);
  }

  return {
    get,
    post,
    put,
    patch,
    delete: _delete,
  };
};

export default http;
