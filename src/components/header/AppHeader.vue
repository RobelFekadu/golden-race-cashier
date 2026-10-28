<template>
  <header class="flex h-[10.65vh] min-h-[90px] shrink-0 flex-col">
    <TopStrip />
    <div class="flex min-h-0 flex-1 items-center bg-[#005AB5] text-[#FEFEFE]">
      <img
        src="/assets/logo.svg"
        alt="Logo"
        class="mx-[max(8px,1.146vw)] h-full w-[max(28px,4.167vw)] shrink-0 object-contain"
      />
      <div
        class="h-[max(30px,6.67vh)] max-h-[84%] w-[2px] shrink-0 bg-[#FEFEFE]"
      ></div>

      <div class="flex min-w-0 flex-1 items-center">
        <span
          class="shrink-0 pl-[max(10px,2.083vw)] pr-[max(4px,0.52vw)] text-[max(12px,min(1.875vw,3.333vh))] font-[400] leading-none tabular-nums"
          :class="
            gamesStore.totalCountdown <= 60
              ? 'animate-pulse text-[#FFC629]'
              : ''
          "
        >
          {{ gamesStore.remainingMinutes }}:{{ gamesStore.remainingSeconds }}
        </span>

        <span
          class="mx-[2px] flex h-[max(18px,2.083vw)] w-[max(16px,1.875vw)] shrink-0 items-center justify-center text-[#FEFEFE]"
        >
          <IconGlyph
            family="game"
            :code="gameGlyph(gamesStore.activeGameMeta.icon)"
            size="max(16px,min(1.875vw,3.333vh))"
          />
        </span>

        <span
          class="min-w-0 max-w-[600px] truncate px-[10px] text-[max(12px,min(1.875vw,3.333vh))] font-[700] capitalize leading-none"
        >
          {{ titleText }}
        </span>

        <div class="min-w-0 flex-1"></div>

        <div class="flex shrink-0 items-center">
          <button
            class="mr-[max(4px,0.52vw)] flex h-[max(16px,min(1.98vw,3.519vh))] min-w-[max(84px,min(6.2vw,11vh))] items-center justify-center rounded-[50px] bg-[#369AFF] pl-[max(4px,0.42vw)] pr-[max(8px,0.94vw)] text-[max(7px,min(0.833vw,1.481vh))] font-[900] uppercase leading-none text-[#FEFEFE] transition-colors hover:brightness-105"
            title="Viewer"
            @click="openViewer"
          >
            <IconGlyph
              code="e06b"
              size="max(14px,min(1.667vw,2.963vh))"
              class="mr-[max(8px,0.83vw)] -translate-y-[0.22em]"
            />
            Viewer
          </button>

          <button
            class="mr-[max(6px,0.78vw)] flex h-[max(16px,min(1.98vw,3.519vh))] min-w-[max(120px,min(8.75vw,15.56vh))] max-w-[210px] items-center justify-center gap-[6px] truncate rounded-[50px] bg-[#369AFF] pl-[max(6px,0.625vw)] pr-[max(10px,1.1vw)] text-[max(7px,min(0.833vw,1.481vh))] font-[900] uppercase leading-none text-[#FEFEFE] transition-colors hover:brightness-105"
            @click="$refs.ticketCheckModal.show()"
          >
            <svg
              class="h-[max(14px,1.25vw)] w-[max(14px,1.25vw)] shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="5" y="5" width="3" height="3" fill="#369AFF" />
              <rect x="16" y="5" width="3" height="3" fill="#369AFF" />
              <rect x="5" y="16" width="3" height="3" fill="#369AFF" />
              <rect x="14" y="14" width="2" height="2" />
              <rect x="17" y="14" width="2" height="2" />
              <rect x="14" y="17" width="2" height="2" />
              <rect x="17" y="17" width="2" height="2" />
              <rect x="14" y="20" width="2" height="2" />
              <rect x="20" y="14" width="2" height="2" />
              <rect x="20" y="20" width="2" height="2" />
            </svg>
            Ticket Check
          </button>

          <button
            class="mr-[max(4px,0.52vw)] flex h-[max(20px,min(2.083vw,3.704vh))] w-[max(20px,min(2.083vw,3.704vh))] shrink-0 items-center justify-center rounded-full bg-[#FEFEFE] text-[#FFC629] transition-colors hover:bg-white"
            title="Shop Admin"
            @click="openAdmin"
          >
            <IconGlyph
              code="e09d"
              size="max(15px,min(1.35vw,2.41vh))"
              class="-translate-y-[0.1em]"
            />
          </button>

          <span
            class="ml-[5px] mr-[max(8px,1.15vw)] shrink-0 bg-[#FFC629] px-[max(12px,1.82vw)] py-[max(4px,0.42vw)] text-[max(10px,min(0.9375vw,1.667vh))] font-[700] uppercase leading-none text-[#006DC3]"
          >
            #{{ eventNumber }}
          </span>
        </div>
      </div>

      <TicketCheckModal ref="ticketCheckModal" />
    </div>
  </header>
</template>

<script>
import { useGamesStore, useAdminStore } from "@/stores";
import IconGlyph from "@/components/IconGlyph.vue";
import TicketCheckModal from "@/components/modal/TicketCheckModal.vue";
import TopStrip from "@/components/header/TopStrip.vue";
import { gameGlyph } from "@/utils/gameGlyphs";

export default {
  name: "AppHeader",
  components: { IconGlyph, TicketCheckModal, TopStrip },
  setup() {
    const gamesStore = useGamesStore();
    const adminStore = useAdminStore();
    return { gamesStore, adminStore };
  },
  computed: {
    titleText() {
      return this.gamesStore.activeGameMeta?.subtitle || "";
    },
    eventNumber() {
      const open = this.gamesStore.openGame;
      return open ? open.gameNumber : "";
    },
  },
  methods: {
    gameGlyph,
    openAdmin() {
      this.adminStore.open("results");
    },
    openViewer() {
      const url = import.meta.env.VITE_DISPLAY_URL;
      if (!url) {
        this.$notify({
          title: "Viewer URL not configured",
          type: "error",
        });
        return;
      }

      const launcher = window.open(
        "about:blank",
        `launcher_${Date.now()}`,
        [
          "popup=yes",
          `width=${window.screen.availWidth}`,
          `height=${window.screen.availHeight}`,
          "left=0",
          "top=0",
          "menubar=no",
          "toolbar=no",
          "location=no",
          "status=no",
          "resizable=yes",
          "scrollbars=no",
        ].join(","),
      );

      if (!launcher) {
        this.$notify({
          title: "Unable to open viewer",
          text: "Allow popups for this site",
          type: "error",
        });
        return;
      }

      const safeUrl = String(url)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      launcher.document.open();
      launcher.document.write(
        `<!doctype html><html><head><meta charset="utf-8"><title>Launcher</title><style>html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe src="${safeUrl}" allow="autoplay; fullscreen" allowfullscreen></iframe></body></html>`,
      );
      launcher.document.close();

      try {
        launcher.moveTo(0, 0);
        launcher.resizeTo(window.screen.availWidth, window.screen.availHeight);
      } catch {
        /* ignore */
      }
      launcher.focus();
    },
  },
};
</script>
