<template>
  <div
    class="min-h-screen flex items-center justify-center relative overflow-hidden"
    style="
      background-color: #1e1e1e;
      background-image:
        url(&quot;/assets/login-background.svg&quot;),
        linear-gradient(0deg, #1e1e1e 0%, #3b3b3b 100%);
      background-size: 100% 100%;
      background-repeat: no-repeat;
    "
  >
    <div class="w-[460px] bg-white rounded-lg shadow-2xl overflow-hidden">
      <!-- Header tabs -->
      <div class="flex border-b border-gray-200">
        <button
          class="flex-1 py-3 text-sm font-bold tracking-wide transition-colors"
          :class="
            loginMode === 'manual'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          "
          @click="loginMode = 'manual'"
        >
          MANUAL LOGIN
        </button>
        <button
          class="flex-1 py-3 text-sm font-bold tracking-wide transition-colors"
          :class="
            loginMode === 'quick'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          "
          @click="loginMode = 'quick'"
        >
          QUICK ACCESS
        </button>
      </div>

      <!-- Form -->
      <div class="px-12 py-9">
        <form @submit.prevent="login">
          <!-- Hardware ID -->
          <div class="flex items-center gap-4 mb-1">
            <label
              class="w-28 shrink-0 text-right text-sm font-medium text-gray-800"
              >Hardware ID</label
            >
            <div class="relative flex-1">
              <input
                v-model="hardwareId"
                type="text"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
              <button
                v-if="hardwareId"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="hardwareId = ''"
                aria-label="Clear hardware ID"
              >
                <svg
                  class="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-center text-[11px] text-gray-400 mb-4">
            Single User Account
          </p>

          <div class="border-t border-gray-200 my-5"></div>

          <!-- Domain -->
          <div class="flex items-center gap-4 mb-3.5">
            <label
              class="w-28 shrink-0 text-right text-sm font-medium text-gray-800"
              >Domain<span class="text-red-500">*</span></label
            >
            <input
              v-model="domain"
              type="text"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <!-- User -->
          <div class="flex items-center gap-4 mb-3.5">
            <label
              class="w-28 shrink-0 text-right text-sm font-medium text-gray-800"
              >User<span class="text-red-500">*</span></label
            >
            <input
              v-model="username"
              type="text"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <!-- Password -->
          <div class="flex items-center gap-4 mb-5">
            <label
              class="w-28 shrink-0 text-right text-sm font-medium text-gray-800"
              >Password<span class="text-red-500">*</span></label
            >
            <input
              v-model="password"
              type="password"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <!-- Remember me -->
          <div class="flex items-center gap-2 mb-7 pl-[8.5rem]">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-400"
            />
            <span class="text-sm text-gray-800">Remember Me</span>
          </div>

          <!-- OK button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-md text-white text-lg font-bold tracking-wide transition-opacity disabled:opacity-60"
            style="background-color: #7a8c2e"
          >
            <span v-if="!loading">OK</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </span>
          </button>

          <!-- Keyboard settings -->
          <div class="flex items-center justify-between mt-7">
            <div class="flex items-center gap-2.5">
              <span class="text-sm text-gray-800">Virtual Keyboard</span>
              <button
                type="button"
                @click="virtualKeyboardEnabled = !virtualKeyboardEnabled"
                class="relative w-11 h-6 rounded-full transition-colors"
                :class="virtualKeyboardEnabled ? 'bg-gray-800' : 'bg-gray-300'"
                role="switch"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  :class="
                    virtualKeyboardEnabled ? 'translate-x-5' : 'translate-x-0'
                  "
                ></span>
              </button>
              <span class="text-xs font-medium text-gray-500">
                {{ virtualKeyboardEnabled ? "ON" : "OFF" }}
              </span>
            </div>
            <select
              v-model="virtualKeyboardLayout"
              class="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option>[Backoffice]</option>
              <option>Standard</option>
            </select>
          </div>
        </form>
      </div>
    </div>

    <!-- Version -->
    <div
      class="absolute bottom-7 left-9 text-white text-sm font-bold tracking-wide"
    >
      CASHIER VERSION 1.145.0
    </div>
  </div>
</template>

<script>
import cashierApi from "@/api/cashier";
import { useAuthStore } from "@/stores";

export default {
  name: "LoginView",
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      loginMode: "manual",
      hardwareId: "",
      domain: "",
      username: "",
      password: "",
      rememberMe: true,
      virtualKeyboardEnabled: false,
      virtualKeyboardLayout: "Backoffice",
      loading: false,
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) return;

      this.loading = true;
      let response = null;

      if (this.loginMode === "quick") {
        response = await cashierApi.login(
          this.username || this.hardwareId,
          this.password,
        );
      } else {
        response = await cashierApi.login(this.username, this.password);
      }

      switch (response.status) {
        case 201:
          if (response.data.user?.status === "ACTIVE") {
            this.authStore.setToken(response.data.token);
            this.authStore.setUsername(response.data.user.username);
            this.authStore.setUserId(response.data.user.id);
            this.authStore.setShopName(response.data.data?.shop?.name);
            this.authStore.setCompanyName(response.data.data?.companyName);
            this.authStore.setHardwareId(this.hardwareId);
            this.authStore.setDomain(this.domain);
            this.authStore.setRememberMe(this.rememberMe);
            this.authStore.setVirtualKeyboardEnabled(
              this.virtualKeyboardEnabled,
            );
            this.authStore.setVirtualKeyboardLayout(this.virtualKeyboardLayout);
            this.authStore.isLoggedIn = true;

            this.$router.push({ name: "dashboard" });
          } else {
            this.$notify({ title: "Unauthorized account!", type: "error" });
          }
          break;
        case 401:
          this.$notify({
            title:
              response.data.exception === "UserAccountDisabledException"
                ? response.data.message
                : "Incorrect username or password",
            type: "error",
          });
          break;
        default:
          this.$notify({ title: "Login failed", type: "error" });
      }
      this.loading = false;
    },
  },
};
</script>
