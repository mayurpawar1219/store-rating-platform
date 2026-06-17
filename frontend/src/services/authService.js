import api from "./api";

export async function login({ email, password }) {
  return api.post("/auth/login", { email, password });
}

export async function register({ name, email, address, password }) {
  return api.post("/auth/register", { name, email, address, password });
}

export async function getProfile() {
  return api.get("/auth/profile");
}

