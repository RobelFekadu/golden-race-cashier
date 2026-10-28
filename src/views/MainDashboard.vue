<template>
  <div class="flex h-screen w-screen overflow-hidden bg-[#030303] text-black">
    <div
      class="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-[#030303]"
    >
      <AppHeader />
      <div class="relative flex min-h-0 flex-1 flex-col">
        <GameInterface />
        <MarketClosedModal />
      </div>
      <GameSelectorFooter @collapse="onCollapse" />
    </div>
    <BetSlipSidebar />

    <ShopAdminModal />
  </div>
</template>

<script>
import AppHeader from "@/components/header/AppHeader.vue";
import GameInterface from "@/components/game/GameInterface.vue";
import BetSlipSidebar from "@/components/betslip/BetSlipSidebar.vue";
import GameSelectorFooter from "@/components/footer/GameSelectorFooter.vue";
import ShopAdminModal from "@/components/modal/ShopAdminModal.vue";
import MarketClosedModal from "@/components/modal/MarketClosedModal.vue";
import { useGamesStore } from "@/stores";

export default {
  name: "MainDashboard",
  components: {
    AppHeader,
    GameInterface,
    BetSlipSidebar,
    GameSelectorFooter,
    ShopAdminModal,
    MarketClosedModal,
  },
  setup() {
    const gamesStore = useGamesStore();
    return { gamesStore };
  },
  mounted() {
    this.gamesStore.startPolling(this.gamesStore.activeGameType);
    this.gamesStore.fetchGames();
    this.gamesStore.startCountdown();
  },
  beforeUnmount() {
    this.gamesStore.stopAllPolling();
    this.gamesStore.stopCountdown();
  },
  methods: {
    onCollapse() {
      /* presentational collapse control */
    },
  },
};
</script>
