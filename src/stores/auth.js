import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    username: "",
    shopName: "",
    company: "Emerald",
    userId: "",
    isLoggedIn: false,
    hardwareId: "",
    domain: "",
    rememberMe: false,
    virtualKeyboardEnabled: false,
    virtualKeyboardLayout: "Backoffice",
  }),
  getters: {
    getToken(state) {
      return state.token;
    },
    getDisplayName(state) {
      return state.username || "Cashier";
    },
    getBalance() {
      return 0; // This would come from the API
    },
  },
  actions: {
    refreshState() {
      let token = localStorage.getItem("token");
      let username = localStorage.getItem("username");
      let userId = localStorage.getItem("userId");
      let shopName = localStorage.getItem("shopName");
      let company = localStorage.getItem("company");
      let hardwareId = localStorage.getItem("hardwareId");
      let domain = localStorage.getItem("domain");
      let rememberMe = localStorage.getItem("rememberMe") === "true";

      if (token != null && token !== "null") {
        this.setToken(token);
        this.setUsername(username);
        this.setUserId(userId);
        this.setShopName(shopName);
        this.setCompanyName(company);
        this.setHardwareId(hardwareId);
        this.setDomain(domain);
        this.setRememberMe(rememberMe);

        this.isLoggedIn = true;

        return true;
      } else {
        this.isLoggedIn = false;

        return false;
      }
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    setUsername(username) {
      this.username = username;
      localStorage.setItem("username", username);
    },
    setUserId(userId) {
      this.userId = userId;
      localStorage.setItem("userId", userId);
    },
    setShopName(shopName) {
      this.shopName = shopName;
      localStorage.setItem("shopName", shopName);
    },
    setCompanyName(company) {
      this.company = company;
      localStorage.setItem("company", company);
    },
    setHardwareId(hardwareId) {
      this.hardwareId = hardwareId;
      localStorage.setItem("hardwareId", hardwareId);
    },
    setDomain(domain) {
      this.domain = domain;
      localStorage.setItem("domain", domain);
    },
    setRememberMe(rememberMe) {
      this.rememberMe = rememberMe;
      localStorage.setItem("rememberMe", rememberMe.toString());
    },
    setVirtualKeyboardEnabled(enabled) {
      this.virtualKeyboardEnabled = enabled;
      localStorage.setItem("virtualKeyboardEnabled", enabled.toString());
    },
    setVirtualKeyboardLayout(layout) {
      this.virtualKeyboardLayout = layout;
      localStorage.setItem("virtualKeyboardLayout", layout);
    },
    logout() {
      this.token = "";
      this.username = "";
      this.userId = "";
      this.shopName = "";
      this.company = "Emerald";
      this.hardwareId = "";
      this.domain = "";
      this.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("shopName");
      localStorage.removeItem("company");
      localStorage.removeItem("hardwareId");
      localStorage.removeItem("domain");
    },
  },
});
