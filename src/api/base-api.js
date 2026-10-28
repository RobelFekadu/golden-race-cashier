import axios from "axios";

export default {
  async post(url, payload, config) {
    var status = null;
    var data = null;
    var token = localStorage.getItem("token");
    var headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await axios.post(url, payload, { headers, ...config });
      status = response.status;
      data = response.data;
    } catch (error) {
      status = error.response?.status || 500;
      data = error.response?.data || error.message;
    }
    return { status, data };
  },

  async put(url, payload, config) {
    var status = null;
    var data = null;
    var token = localStorage.getItem("token");
    var headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await axios.put(url, payload, { headers, ...config });
      status = response.status;
      data = response.data;
    } catch (error) {
      status = error.response?.status || 500;
      data = error.response?.data || error.message;
    }
    return { status, data };
  },

  async get(url, config) {
    var status = null;
    var data = null;
    var token = localStorage.getItem("token");
    var headers = token
      ? { Authorization: `Bearer ${token}`, "API-KEY": "qwerty12345" }
      : {};
    try {
      const response = await axios.get(url, { headers, ...config });
      status = response.status;
      data = response.data;
    } catch (error) {
      status = error.response?.status || 500;
      data = error.response?.data || error.message;
    }
    return { status, data };
  },

  async postBare(url, payload) {
    var status = null;
    var data = null;

    try {
      const response = await axios.post(url, payload);
      status = response.status;
      data = response.data;
    } catch (error) {
      if (error.response != null) {
        status = error.response.status;
        data = error.response.data;
      } else {
        status = 400;
        data = "";
      }
    }
    return { status, data };
  },

  async postForm(url, payload, config) {
    var status = null;
    var data = null;
    var headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    };
    try {
      const response = await axios.post(url, payload, { headers, ...config });
      status = response.status;
      data = response.data;
    } catch (error) {
      status = error.response?.status || 500;
      data = error.response?.data || error.message;
    }
    return { status, data };
  },
};
