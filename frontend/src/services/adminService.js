import api from "./api";

export async function getAdminDashboard() {
  return api.get("/admin/dashboard");
}

export async function getAdminUsers() {
  return api.get("/admin/users");
}

export async function getAdminStores() {
  return api.get("/admin/stores");
}

export async function createOwner({ name, email, address, password, store_name }) {
  return api.post("/admin/create-owner", {
    name,
    email,
    address,
    password,
    store_name,
  });
}

export async function createStore({ store_name, owner_id, address }) {
  return api.post("/admin/create-store", {
    store_name,
    owner_id,
    address,
  });
}

