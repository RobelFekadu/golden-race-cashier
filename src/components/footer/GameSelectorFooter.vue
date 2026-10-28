<template>
  <footer
    class="flex shrink-0 flex-col"
    :class="expanded ? 'h-[16.66vh] min-h-[128px]' : 'h-[8.33vh] min-h-[64px]'"
  >
    <div class="flex min-h-0 flex-1 items-stretch">
      <button
        v-for="game in FOOTER_GAMES"
        :key="game.key"
        class="flex min-w-0 flex-1 items-center border-b border-r border-[#003469] pl-[10px] pr-[16px] text-left transition-colors duration-150"
        :class="
          gamesStore.activeGameType === game.key
            ? 'bg-[#FFC629]'
            : 'bg-[#005AB5] hover:bg-[#0a66c9]'
        "
        @click="selectGame(game)"
      >
        <span
          class="mr-[10px] flex w-[39px] shrink-0 items-center justify-center"
          :class="
            gamesStore.activeGameType === game.key
              ? 'text-[#030303]'
              : 'text-[#FEFEFE]'
          "
        >
          <IconGlyph
            family="game"
            :code="glyphCode(game.icon)"
            size="max(28px,min(2.29vw,4.07vh))"
          />
        </span>
        <div class="flex min-w-0 flex-1 flex-col justify-center">
          <span
            class="mb-[2px] truncate text-[max(11px,min(0.833vw,1.481vh))] capitalize leading-[1.2]"
            :style="{ fontWeight: 700 }"
            :class="
              gamesStore.activeGameType === game.key
                ? 'text-[#003EA1]'
                : 'text-[#FFC629]'
            "
          >
            {{ game.subtitle }}
          </span>
          <span
            class="truncate text-[max(13px,min(1.146vw,2.037vh))] uppercase leading-none"
            :style="{ fontWeight: 700 }"
            :class="
              gamesStore.activeGameType === game.key
                ? 'text-[#030303]'
                : 'text-[#FEFEFE]'
            "
          >
            {{ game.label }}
          </span>
        </div>
      </button>

      <button
        class="flex w-[77px] shrink-0 items-center justify-center border-b border-[#003469] bg-[#004D9C] transition-colors hover:brightness-110"
        @click="toggleExpanded"
      >
        <IconGlyph
          code="e0c6"
          size="max(16px,min(1.354vw,2.407vh))"
          class="text-[#FEFEFE] transition-transform"
          :class="expanded ? 'rotate-180' : ''"
        />
      </button>
    </div>

    <div
      v-if="expanded"
      class="flex min-h-0 flex-1 items-stretch border-b border-[#003469] bg-[#004D9C]"
    >
      <button
        v-for="game in extraGames"
        :key="game.key"
        class="flex min-w-0 items-center border-r border-[#003469] pl-[10px] pr-[16px] text-left transition-colors duration-150"
        :style="extraGameStyle"
        :class="
          gamesStore.activeGameType === game.key
            ? 'bg-[#FFC629]'
            : 'bg-[#005AB5] hover:bg-[#0a66c9]'
        "
        @click="selectGame(game)"
      >
        <span
          class="mr-[10px] flex w-[39px] shrink-0 items-center justify-center"
          :class="
            gamesStore.activeGameType === game.key
              ? 'text-[#030303]'
              : 'text-[#FEFEFE]'
          "
        >
          <IconGlyph
            family="game"
            :code="glyphCode(game.icon)"
            size="max(28px,min(2.29vw,4.07vh))"
          />
        </span>
        <div class="flex min-w-0 flex-1 flex-col justify-center">
          <span
            class="mb-[2px] truncate text-[max(11px,min(0.833vw,1.481vh))] capitalize leading-[1.2]"
            :style="{ fontWeight: 700 }"
            :class="
              gamesStore.activeGameType === game.key
                ? 'text-[#003EA1]'
                : 'text-[#FFC629]'
            "
          >
            {{ game.subtitle }}
          </span>
          <span
            class="truncate text-[max(13px,min(1.146vw,2.037vh))] uppercase leading-none"
            :style="{ fontWeight: 700 }"
            :class="
              gamesStore.activeGameType === game.key
                ? 'text-[#030303]'
                : 'text-[#FEFEFE]'
            "
          >
            {{ game.label }}
          </span>
        </div>
      </button>
    </div>
  </footer>
</template>

<script>
import {
  useGamesStore,
  useBetslipStore,
  FOOTER_GAMES,
  GAME_TYPES,
} from "@/stores";
import IconGlyph from "@/components/IconGlyph.vue";
import { gameGlyph } from "@/utils/gameGlyphs";

export default {
  name: "GameSelectorFooter",
  components: { IconGlyph },
  emits: ["collapse"],
  setup() {
    const gamesStore = useGamesStore();
    const betslipStore = useBetslipStore();
    return { gamesStore, betslipStore, FOOTER_GAMES };
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    extraGames() {
      return [GAME_TYPES.GREYHOUND_SANTA_MONICA_5];
    },
    extraGameStyle() {
      return {
        flex: `0 0 calc((100% - 77px) / ${FOOTER_GAMES.length})`,
      };
    },
  },
  methods: {
    glyphCode(icon) {
      return gameGlyph(icon);
    },
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    selectGame(game) {
      if (this.gamesStore.activeGameType === game.key) return;
      const previous = this.gamesStore.activeGameType;
      this.gamesStore.setActiveGame(game.key);
      this.gamesStore.stopPolling(previous);
      this.gamesStore.startPolling(game.key);
      this.gamesStore.fetchGames(game.key);
      this.betslipStore.clearPicks();
      this.betslipStore.clearSelected();
    },
  },
};
</script>
