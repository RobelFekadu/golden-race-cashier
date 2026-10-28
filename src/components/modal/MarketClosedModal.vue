<template>
  <div
    v-if="visible"
    class="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[rgba(0,45,140,0.9)] text-[#FEFEFE]"
  >
    <div class="flex translate-y-[2vh] flex-col items-center">
      <IconGlyph code="e0b0" size="max(36px,min(4.5vw,8vh))" />
      <p
        class="mt-[1.6vh] text-[max(18px,min(1.875vw,3.333vh))] font-[700] uppercase leading-none tracking-wide"
      >
        Markets Closed
      </p>
    </div>
  </div>
</template>

<script>
import IconGlyph from "@/components/IconGlyph.vue";
import { useGamesStore } from "@/stores";

export default {
  name: "MarketClosedModal",
  components: { IconGlyph },
  setup() {
    const gamesStore = useGamesStore();
    return { gamesStore };
  },
  computed: {
    visible() {
      const t = this.gamesStore.totalCountdown;
      return !!this.gamesStore.openGame && t > 0 && t <= 5;
    },
  },
};
</script>
