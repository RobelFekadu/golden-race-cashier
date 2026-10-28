<template>
  <div
    class="flex h-[2.315vh] shrink-0 select-none items-center bg-[#030303] px-[30px] text-[1.481vh] font-[700] leading-none text-[#FEFEFE]"
  >
    <span class="flex items-center">
      <svg
        class="mr-0 h-[15px] w-[11px] text-[#FEFEFE]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.5 1.5 11h3v10h5v-6h5v6h5V11h3L12 2.5z" />
      </svg>
      <span class="mx-[8px]">{{ authStore.hardwareId || "39180914" }}</span>
      <span>.</span>
      <span class="mx-[8px]">{{ authStore.username || "Simba9" }}</span>
      <span class="ml-[20px]">Version: 1.145.0</span>
    </span>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores";

export default {
  name: "TopStrip",
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
};
</script>
