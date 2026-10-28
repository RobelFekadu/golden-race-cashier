<template>
  <div class="flex flex-col h-screen w-full overflow-hidden">
    <router-view />
    <notifications position="top right" />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores";

export default {
  name: "App",
  setup() {
    const authStore = useAuthStore();
    authStore.refreshState();
    return { authStore };
  },
};
</script>
