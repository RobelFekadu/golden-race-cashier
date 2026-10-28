<template>
  <teleport to="body">
    <transition name="flip" appear>
      <div
        v-if="adminStore.isOpen"
        class="fixed inset-0 z-50 flex items-stretch justify-center bg-[#00488F]/85 px-[110px] py-[60px]"
        @click.self="adminStore.close()"
      >
        <div
          class="relative flex w-full max-w-[1700px] flex-col overflow-hidden bg-white shadow-2xl"
        >
          <!-- Top strip with close -->
          <div
            class="relative flex h-[40px] shrink-0 items-center justify-end bg-[#E6E6E6] pr-[22px]"
          >
            <button
              class="text-gray-600 transition-colors hover:text-gray-900"
              @click="adminStore.close()"
              aria-label="Close"
            >
              <svg
                class="h-5 w-5"
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

          <!-- Header row -->
          <div
            class="relative flex shrink-0 items-stretch border-b border-[#D6D6D6]"
          >
            <div class="flex min-w-0 flex-1 items-stretch pl-[50px]">
              <div
                class="flex shrink-0 flex-col justify-center pr-[60px] leading-none"
              >
                <span class="text-[22px] font-bold text-[#030303]"
                  >SHOP ADMIN</span
                >
                <span class="mt-[3px] text-[11px] text-gray-400">1.94.0</span>
              </div>
              <nav class="flex min-w-0 items-stretch overflow-x-auto">
                <button
                  v-for="tab in ADMIN_TABS"
                  :key="tab.key"
                  class="relative flex shrink-0 items-center whitespace-nowrap px-[18px] text-[14px] font-semibold uppercase tracking-[0.4px] transition-colors"
                  :class="
                    adminStore.activeTab === tab.key
                      ? 'text-[#030303]'
                      : 'text-[#9AA0A6] hover:text-gray-700'
                  "
                  @click="adminStore.setActiveTab(tab.key)"
                >
                  {{ tab.label }}
                  <span
                    v-if="adminStore.activeTab === tab.key"
                    class="absolute bottom-0 left-1/2 h-[3px] w-[58%] -translate-x-1/2 bg-[#1c1c1c]"
                  ></span>
                </button>
              </nav>
            </div>
            <div
              class="flex h-[62px] w-[163px] shrink-0 items-center justify-center gap-2 bg-[#E6E6E6]"
            >
              <svg
                class="h-4 w-4 text-[#4b4f52]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-[14px] text-[#030303]">{{
                authStore.getDisplayName
              }}</span>
            </div>
          </div>

          <!-- Tab content -->
          <div class="flex-1 overflow-y-auto bg-white">
            <OpenTicketsTab v-if="adminStore.activeTab === 'openTickets'" />
            <TicketsTab v-else-if="adminStore.activeTab === 'tickets'" />
            <TurnoverTab v-else-if="adminStore.activeTab === 'turnover'" />
            <QuickReportTab
              v-else-if="adminStore.activeTab === 'quickReport'"
            />
            <CreditLogTab v-else-if="adminStore.activeTab === 'creditLog'" />
            <ResultsTab v-else-if="adminStore.activeTab === 'results'" />
            <PromotionsTab v-else-if="adminStore.activeTab === 'promotions'" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useAdminStore, useAuthStore, ADMIN_TABS } from "@/stores";
import OpenTicketsTab from "./tabs/OpenTicketsTab.vue";
import TicketsTab from "./tabs/TicketsTab.vue";
import TurnoverTab from "./tabs/TurnoverTab.vue";
import QuickReportTab from "./tabs/QuickReportTab.vue";
import CreditLogTab from "./tabs/CreditLogTab.vue";
import ResultsTab from "./tabs/ResultsTab.vue";
import PromotionsTab from "./tabs/PromotionsTab.vue";

export default {
  name: "ShopAdminModal",
  components: {
    OpenTicketsTab,
    TicketsTab,
    TurnoverTab,
    QuickReportTab,
    CreditLogTab,
    ResultsTab,
    PromotionsTab,
  },
  setup() {
    const adminStore = useAdminStore();
    const authStore = useAuthStore();
    return { adminStore, authStore, ADMIN_TABS };
  },
};
</script>

<style scoped>
.flip-enter-active {
  transition:
    transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.7s ease;
  transform-origin: center;
  backface-visibility: hidden;
}
.flip-enter-from {
  transform: perspective(1600px) rotateY(-90deg);
  opacity: 0;
}
.flip-leave-active {
  transition:
    transform 0.6s ease-in,
    opacity 0.6s ease-in;
  transform-origin: center;
  backface-visibility: hidden;
}
.flip-leave-to {
  transform: perspective(1600px) rotateY(-90deg);
  opacity: 0;
}
</style>
