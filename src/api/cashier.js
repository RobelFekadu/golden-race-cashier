import api from "./base-api";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default {
  async login(username, password) {
    return api.post(`${baseUrl}/cashier/login`, { username, password });
  },
  async changePassword(params) {
    return api.put(`${baseUrl}/cashier/change-password`, params);
  },
};
