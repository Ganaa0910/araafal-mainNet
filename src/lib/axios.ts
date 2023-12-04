import SERVER_SETTINGS from "./serverSettings";
import axios from "axios";
import { configure } from "axios-hooks";
// import LRU from "lru-cache";
import { LRUCache } from "lru-cache";
import { clearToken, getAccessToken, getRefreshToken, saveToken } from "./auth";

const BACKEND_URL = SERVER_SETTINGS.BACKEND_URL;
const instance = axios.create({
  baseURL: BACKEND_URL,
  // withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios
        .post(`${BACKEND_URL}/api/users/auth/refreshToken`, {
          refreshToken: getRefreshToken(),
        })
        .then(async (res) => {
          if (res.status === 200) {
            saveToken(res.data);
            return instance(originalRequest);
          } else {
            clearToken();
          }
        })
        .catch((error) => {});
    }

    // return Promise.reject(error);
    return error.response;
  },
);

const cache = new LRUCache({ max: 10 });

configure({ axios: instance, cache });
export default instance;
