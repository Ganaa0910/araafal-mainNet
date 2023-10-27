import SERVER_SETTINGS from "./serverSettings";
import { User } from "./types/dbTypes";

type TokenType = {
  accessToken: string;
  refreshToken: string;
};

const BACKEND_URL = SERVER_SETTINGS.BACKEND_URL;

export function saveToken(tokenData: TokenType) {
  setAccessToken(tokenData.accessToken);
  setRefreshToken(tokenData.refreshToken);
}

export function saveUserId(id: string) {
  localStorage.setItem("id", id);
}

export function getUserIdIfLogged() {
  if (!isUserLoggedIn()) return { data: undefined };
  else {
    const token = getUserId();
    return token;
  }
}

export function getUserId() {
  return localStorage.getItem("id");
}

export function isUserLoggedId() {
  const token = getUserId();

  return token !== null;
}

export function isUserLoggedIn() {
  const token = getAccessToken();

  return token !== null;
}

export function setUserData(user: User) {
  localStorage.setItem("user_profile", JSON.stringify(user));
}

export function getUserData() {
  const userData = localStorage.getItem("user_profile");
  return userData ? JSON.parse(userData) : undefined;
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function setRefreshToken(token: string) {
  localStorage.setItem("refreshToken", token);
}

export function getAccessToken() {
  if (!window) return null;

  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function clearToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("id");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userProfile");
}

export async function signInManual(data: any) {
  return fetch(`${BACKEND_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data }),
  }).then(async (res) => {
    if (res.status == 200) return await res.json();
    return await res;
  });
}
