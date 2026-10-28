import api from "./base-api";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export default {
  async create(createSlipDto) {
    return api.post(`${baseUrl}/slip`, createSlipDto);
  },

  async getShiftReport(params) {
    return api.post(`${baseUrl}/slip/shift-report`, params);
  },

  async fetchSlip(id) {
    return api.get(`${baseUrl}/slip/ticket/?ticketNumber=${id}`);
  },

  async cancelBet(id) {
    return api.post(`${baseUrl}/slip/revoke?slipId=${id}`);
  },

  async redeemBet(id) {
    return api.post(`${baseUrl}/slip/pay?slipId=${id}`);
  },

  async recallBets() {
    return api.get(`${baseUrl}/slip/recent`);
  },
};
