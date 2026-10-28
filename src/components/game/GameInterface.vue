<template>
  <div
    v-if="isKeno"
    class="min-h-0 flex-1 overflow-hidden pt-[1.39vh] pb-[1.39vh]"
  >
    <KenoGame />
  </div>
  <div
    v-else
    class="min-h-0 flex-1"
    :class="
      hasEntries
        ? 'overflow-auto pt-[1.39vh] pb-[1.39vh] pr-[15px]'
        : 'overflow-hidden'
    "
  >
    <div
      v-if="hasEntries"
      class="game-board min-h-full bg-[#FAFAFA]"
      :style="{ '--pcol': pcolValue }"
    >
      <!-- ============ WIN / EXACTA / TRIFECTA ============ -->
      <div class="px-[8.854vw] pt-[2.78vh] pb-[0.93vh]">
        <div class="relative mx-auto w-fit">
          <div
            class="relative z-[2] flex h-[4.17vh] items-start gap-[2px] pl-[25px]"
          >
            <button
              type="button"
              class="flex h-[4.17vh] shrink-0 items-center rounded-t-[12px] border border-b-0 border-[#AEB6BD] bg-[#E4EAEE] px-[20px] text-[max(13px,min(1.146vw,2.037vh))] font-[700] uppercase leading-none text-[#030303]"
            >
              Win / Exacta / Trifecta
            </button>
          </div>

          <div class="relative rounded-b-[2px] bg-[#E4EAEE]">
            <!-- 1st row (win, selectable) -->
            <div class="relative p-[0.37vh]">
              <span class="ordinal">1st</span>
              <button
                type="button"
                class="left-check"
                aria-label="Select all in 1st row"
                @click="toggleRow(1)"
              >
                <svg class="h-[19px] w-[12px]" viewBox="0 0 12 19">
                  <path
                    d="M0 9.5 L12 0 L12 19 Z"
                    fill="#A7AAB1"
                    stroke="#9498A0"
                    stroke-width="0.75"
                  />
                </svg>
              </button>
              <div class="flex justify-center">
                <div
                  v-for="entry in entries"
                  :key="entry.id + '-win'"
                  class="w-[var(--pcol)] min-w-0 shrink-0 px-[7px] pt-[0.46vh] pb-[0.37vh]"
                >
                  <ParticipantCard
                    :entry="entry"
                    :value="entry.winOdd"
                    :selected="isForecastSelected(entry.participantNumber, 1)"
                    :hat-folder="hatFolder"
                    @select="toggleForecast(entry, 1)"
                  />
                </div>
              </div>
            </div>

            <!-- 2nd row (disabled) -->
            <div class="relative p-[0.37vh]">
              <span class="ordinal">2nd</span>
              <button
                type="button"
                class="left-check"
                aria-label="Select all in 2nd row"
                @click="toggleRow(2)"
              >
                <svg class="h-[19px] w-[12px]" viewBox="0 0 12 19">
                  <path
                    d="M0 9.5 L12 0 L12 19 Z"
                    fill="#D3D6DA"
                    stroke="#C7CACE"
                    stroke-width="0.75"
                  />
                </svg>
              </button>
              <div class="flex justify-center">
                <div
                  v-for="entry in entries"
                  :key="entry.id + '-second'"
                  class="w-[var(--pcol)] min-w-0 shrink-0 px-[7px] pt-[0.46vh] pb-[0.37vh]"
                >
                  <ParticipantCard
                    :entry="entry"
                    :disabled="!forecastRowActive(2)"
                    :selected="isForecastSelected(entry.participantNumber, 2)"
                    :hat-folder="hatFolder"
                    @select="toggleForecast(entry, 2)"
                  />
                </div>
              </div>
            </div>

            <!-- 3rd row -->
            <div class="relative p-[0.37vh]">
              <span class="ordinal">3rd</span>
              <button
                type="button"
                class="left-check"
                aria-label="Select all in 3rd row"
                @click="toggleRow(3)"
              >
                <svg class="h-[19px] w-[12px]" viewBox="0 0 12 19">
                  <path
                    d="M0 9.5 L12 0 L12 19 Z"
                    fill="#D3D6DA"
                    stroke="#C7CACE"
                    stroke-width="0.75"
                  />
                </svg>
              </button>
              <div class="flex justify-center">
                <div
                  v-for="entry in entries"
                  :key="entry.id + '-third'"
                  class="w-[var(--pcol)] min-w-0 shrink-0 px-[7px] pt-[0.46vh] pb-[0.37vh]"
                >
                  <ParticipantCard
                    :entry="entry"
                    :disabled="!forecastRowActive(3)"
                    :selected="isForecastSelected(entry.participantNumber, 3)"
                    :hat-folder="hatFolder"
                    @select="toggleForecast(entry, 3)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- up triangles -->
      <div class="flex justify-center px-[8.854vw] pt-[0.93vh]">
        <div
          v-for="entry in entries"
          :key="entry.id + '-up'"
          class="flex w-[var(--pcol)] min-w-0 shrink-0 justify-center"
        >
          <button
            type="button"
            class="flex w-full cursor-pointer appearance-none justify-center border-0 bg-transparent p-0"
            :aria-label="`Select participant ${entry.participantNumber} in all rows`"
            @click="toggleColumn(entry.participantNumber)"
          >
            <TriangleControl direction="up" />
          </button>
        </div>
      </div>

      <!-- ============ PLACE / SHOW ============ -->
      <div class="px-[8.854vw] pt-[2.78vh] pb-[0.93vh]">
        <div class="relative mx-auto w-fit">
          <span class="place-show">Place</span>
          <div class="flex justify-center">
            <div
              v-for="entry in entries"
              :key="entry.id + '-place'"
              class="w-[var(--pcol)] min-w-0 shrink-0 px-[7px] pt-[0.46vh] pb-[0.37vh]"
            >
              <ParticipantCard
                :entry="entry"
                :value="entry.placeOdd"
                :selected="isSelected(entry, 'PLACE')"
                :hat-folder="hatFolder"
                @select="togglePick(entry, 'PLACE')"
              />
            </div>
          </div>
        </div>

        <div class="relative mx-auto w-fit">
          <span class="place-show">Show</span>
          <div class="flex justify-center">
            <div
              v-for="entry in entries"
              :key="entry.id + '-show'"
              class="w-[var(--pcol)] min-w-0 shrink-0 px-[7px] pt-[0.46vh] pb-[0.37vh]"
            >
              <ParticipantCard
                :entry="entry"
                :value="entry.showOdd"
                :selected="isSelected(entry, 'SHOW')"
                :hat-folder="hatFolder"
                @select="togglePick(entry, 'SHOW')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ============ COMBO ============ -->
      <div class="px-[8.854vw] pt-[2.78vh] pb-[0.93vh]">
        <div class="relative mx-auto w-fit">
          <div class="relative z-[2] flex h-[4.17vh] items-start pl-[25px]">
            <BettingModeTabs v-model="activeComboTab" :tabs="comboTabs" />
          </div>
          <div class="relative rounded-b-[2px] bg-[#E4EAEE]">
            <div class="p-[4px]">
              <div class="flex justify-center">
                <div
                  v-for="entry in entries"
                  :key="entry.id + '-combo'"
                  class="w-[var(--pcol)] min-w-0 shrink-0 px-[7px] pt-[0.46vh] pb-[0.37vh]"
                >
                  <ParticipantCard
                    :entry="entry"
                    :selected="isComboSelected(entry)"
                    :hat-folder="hatFolder"
                    @select="toggleCombo(entry)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex h-full w-full flex-col items-center justify-center bg-[rgba(0,45,140,0.9)] text-[#FEFEFE]"
    >
      <IconGlyph code="e0b0" size="max(36px,min(4.5vw,8vh))" />
      <p
        class="mt-[1.6vh] text-[max(18px,min(1.875vw,3.333vh))] font-[700] uppercase leading-none tracking-wide"
      >
        Racing data unavailable
      </p>
    </div>
  </div>
</template>

<script>
import { useGamesStore, useBetslipStore } from "@/stores";
import ParticipantCard from "@/components/game/ParticipantCard.vue";
import TriangleControl from "@/components/game/TriangleControl.vue";
import BettingModeTabs from "@/components/game/BettingModeTabs.vue";
import IconGlyph from "@/components/IconGlyph.vue";
import KenoGame from "@/components/game/KenoGame.vue";

export default {
  name: "GameInterface",
  components: {
    ParticipantCard,
    TriangleControl,
    BettingModeTabs,
    IconGlyph,
    KenoGame,
  },
  setup() {
    const gamesStore = useGamesStore();
    const betslipStore = useBetslipStore();
    return { gamesStore, betslipStore };
  },
  data() {
    return {
      activeComboTab: "quinella",
      comboTabs: [
        { key: "quinella", label: "Quinella", betType: "QUINELLA" },
        { key: "threeAny", label: "3 Any Order", betType: "TRIO" },
        { key: "system2", label: "System 2", betType: "SYSTEM2" },
        { key: "system3", label: "System 3", betType: "SYSTEM3" },
        { key: "extra", label: "Extra Bets", betType: "EXTRA" },
      ],
    };
  },
  computed: {
    isKeno() {
      return this.gamesStore.activeGameType === "KENO";
    },
    comboBetType() {
      const tab = this.comboTabs.find((t) => t.key === this.activeComboTab);
      return tab ? tab.betType : "QUINELLA";
    },
    entries() {
      const games = this.gamesStore.activeGames;
      const open = this.gamesStore.openGame;
      if (open && Array.isArray(open.entries)) {
        return [...open.entries].sort(
          (a, b) => a.participantNumber - b.participantNumber,
        );
      }
      return games
        .flatMap((g) => g.entries || [])
        .sort((a, b) => a.participantNumber - b.participantNumber);
    },
    hasEntries() {
      return this.entries.length > 0;
    },
    hatFolder() {
      const icon = this.gamesStore.activeGameMeta?.icon;
      if (icon === "greyhound") return "greyhound";
      if (icon === "horse") return "horse-racing";
      if (icon === "car" || icon === "motorbike") return "motor-racing";
      return "";
    },
    colCount() {
      const n = this.entries.length || 1;
      return n < 8 ? n + 1 : n;
    },
    pcolValue() {
      return `calc((61.9795vw - 16px) / ${this.colCount})`;
    },
  },
  methods: {
    getOdd(entry, betType) {
      if (betType === "WIN") return entry.winOdd;
      if (betType === "PLACE") return entry.placeOdd;
      if (betType === "SHOW") return entry.showOdd;
      return entry.winOdd;
    },
    isSelected(entry, betType) {
      return (
        this.betslipStore.isPendingSelection(entry.id, betType) ||
        this.betslipStore.betslip.bets.some(
          (b) => b.entryId === entry.id && b.slipType === betType,
        )
      );
    },
    isComboSelected(entry) {
      if (this.comboBetType === "QUINELLA") {
        return this.betslipStore.isQuinellaSelected(entry.participantNumber);
      }
      return this.isSelected(entry, this.comboBetType);
    },
    toggleCombo(entry) {
      if (this.comboBetType === "QUINELLA") {
        this.betslipStore.toggleQuinellaPick(
          entry.participantNumber,
          this.buildForecastMeta(),
        );
        return;
      }
      this.togglePick(entry, this.comboBetType);
    },
    buildForecastMeta() {
      const open = this.gamesStore.openGame;
      return {
        apiType: this.gamesStore.activeApiType,
        gameNumber: open?.gameNumber,
        endTime: open?.endTime,
        gameId: open?.id,
        field: this.entries.map((e) => e.participantNumber),
        entries: this.entries.map((entry) => ({
          participantNumber: entry.participantNumber,
          winOdd: entry.winOdd,
          placeOdd: entry.placeOdd,
          showOdd: entry.showOdd,
        })),
        odds: this.gamesStore.openGameOdds,
      };
    },
    toggleRow(row) {
      const numbers = this.entries.map((e) => e.participantNumber);
      const selected = this.betslipStore.forecastSelections[row];
      const allSelected =
        numbers.length > 0 && numbers.every((n) => selected.includes(n));
      this.betslipStore.setForecastRow(
        row,
        allSelected ? [] : numbers,
        this.buildForecastMeta(),
      );
    },
    toggleColumn(number) {
      this.betslipStore.toggleForecastColumn(number, this.buildForecastMeta());
    },
    forecastRowActive(row) {
      if (row === 1) return true;
      return this.betslipStore.forecastSelections[row - 1].length > 0;
    },
    isForecastSelected(number, row) {
      return this.betslipStore.isForecastSelected(number, row);
    },
    toggleForecast(entry, row) {
      this.betslipStore.toggleForecastPick(
        entry.participantNumber,
        row,
        this.buildForecastMeta(),
      );
    },
    togglePick(entry, betType) {
      if (!entry) return;
      const existing = this.betslipStore.betslip.bets.find(
        (b) => b.entryId === entry.id && b.slipType === betType,
      );
      if (existing) {
        this.betslipStore.removePick(existing.id);
        return;
      }
      const odd = this.getOdd(entry, betType);
      const market =
        betType === "WIN"
          ? "Win"
          : betType === "PLACE"
            ? "Place"
            : betType === "SHOW"
              ? "Show"
              : "Combo";
      const pick = { participantNumber: entry.participantNumber, rank: 1 };
      const picks = [pick];
      const picksDisplay = `${entry.participantNumber}. ${entry.participantFirstName} ${entry.participantLastName}`;

      this.betslipStore.togglePendingSelection({
        entryId: entry.id,
        gameType: this.gamesStore.activeApiType,
        gameNumber: this.gamesStore.openGame?.gameNumber,
        endTime: this.gamesStore.openGame?.endTime,
        gameId: this.gamesStore.openGame?.id,
        pay: odd,
        market,
        slipType: betType,
        picks,
        picksDisplay,
      });
    },
  },
};
</script>

<style scoped>
.game-board {
  --pcol: calc(7.7474vw - 2px);
}
.ordinal {
  position: absolute;
  top: 2.6vh;
  right: calc(100% + 0.885vw);
  font-size: max(9px, 0.833vw);
  font-weight: 400;
  line-height: 1;
  color: rgba(12, 13, 13, 0.44);
  white-space: nowrap;
}
.left-check {
  position: absolute;
  top: 28px;
  left: calc(100% + 1.823vw);
  display: inline-flex;
  height: 22px;
  width: 23px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  appearance: none;
  cursor: pointer;
}
.place-show {
  position: absolute;
  top: 3.24vh;
  right: calc(100% + 2.656vw);
  font-size: max(9px, 0.833vw);
  font-weight: 400;
  line-height: 1;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}
</style>
