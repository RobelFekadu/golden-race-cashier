<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div
            class="flex items-center justify-between px-5 py-3 bg-primary text-white"
          >
            <h2 class="text-lg font-bold">Change Password</h2>
            <button
              class="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              @click="close"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
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

          <form class="p-6 space-y-4" @submit.prevent="changePassword">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >Current Password</label
              >
              <input
                v-model="currentPassword"
                type="password"
                autocomplete="current-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >New Password</label
              >
              <input
                v-model="newPassword"
                type="password"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >Confirm Password</label
              >
              <input
                v-model="rePassword"
                type="password"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="flex gap-2 pt-2">
              <button type="button" class="flex-1 btn-secondary" @click="close">
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 btn-primary"
                :disabled="loading"
              >
                <span v-if="!loading">Change Password</span>
                <span v-else class="inline-flex items-center gap-2">
                  <svg
                    class="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  Saving...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import cashierApi from "@/api/cashier";
import { useAuthStore } from "@/stores";

export default {
  name: "ChangePasswordModal",
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      visible: false,
      currentPassword: "",
      newPassword: "",
      rePassword: "",
      loading: false,
    };
  },
  methods: {
    show() {
      this.visible = true;
      this.currentPassword = "";
      this.newPassword = "";
      this.rePassword = "";
    },
    close() {
      if (this.loading) return;
      this.visible = false;
    },
    async changePassword() {
      if (!this.currentPassword || !this.newPassword || !this.rePassword) {
        this.$notify({ title: "Invalid form!", type: "error" });
        return;
      }
      if (this.newPassword !== this.rePassword) {
        this.$notify({ title: "The passwords do not match!", type: "error" });
        return;
      }

      this.loading = true;
      const obj = {
        userId: this.authStore.userId,
        oldPassword: this.currentPassword,
        newPassword: this.newPassword,
      };

      const res = await cashierApi.changePassword(obj);

      if (res.status === 200) {
        this.$notify({ title: "Password Changed!", type: "success" });
        this.loading = false;
        this.visible = false;
        this.authStore.logout();
        this.$router.push({ name: "login" });
      } else {
        this.loading = false;
        this.$notify({
          title: res.data?.message || "Something went wrong!",
          type: "error",
        });
      }
    },
  },
};
</script>
