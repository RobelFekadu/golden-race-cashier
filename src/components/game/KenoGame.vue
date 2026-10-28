<template>
  <div class="keno">
    <div class="keno__col keno__col--left">
      <div class="keno__bet-table">
        <div class="bet-table-odd">
          <div class="bet-table-odd__head">
            <div class="bet-table-odd__title">Pick numbers</div>
            <div class="bet-table-odd__buttons">
              <button
                v-for="t in modeTabs"
                :key="t.key"
                type="button"
                class="bet-table-odd__button"
                :class="{ 'bet-table-odd__button--selected': mode === t.key }"
                @click="mode = t.key"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <div class="bet-table-odd__grid">
            <div class="bet-table-odd__vertical-column">
              <div
                v-for="row in 8"
                :key="'v' + row"
                class="bet-table-odd__vcell"
              >
                <button
                  type="button"
                  class="keno-odd keno-odd--icon keno-odd--rotate"
                  :title="`Select row ${row}`"
                  @click="toggleRow(row)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 15l6-6 6 6" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="bet-table-odd__horizontal-column">
              <div v-for="n in 80" :key="n" class="bet-table-odd__hcell">
                <div
                  class="keno-odd"
                  :class="{ 'keno-odd--selected': isSelected(n) }"
                  @click="toggleNumber(n)"
                >
                  {{ n }}
                </div>
              </div>
              <div v-for="c in 10" :key="'b' + c" class="bet-table-odd__hcell">
                <button
                  type="button"
                  class="keno-odd keno-odd--icon"
                  :title="`Select column ${c}`"
                  @click="toggleColumn(c)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 15l6-6 6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-set">
          <div class="tab-set__headers">
            <button
              type="button"
              class="tab-header tab-header--quick-pick"
              :class="{ 'tab-header--active': tab === 'quick' }"
              @click="tab = 'quick'"
            >
              Quick picks
            </button>
            <button
              type="button"
              class="tab-header tab-header--multiplier"
              :class="{ 'tab-header--active': tab === 'multiplier' }"
              @click="tab = 'multiplier'"
            >
              Multiplier x{{ multiplier }}
            </button>
          </div>
          <div class="tab-set__contents">
            <div v-if="tab === 'quick'" class="quick-pick">
              <button
                v-for="n in 10"
                :key="n"
                type="button"
                class="quick-pick__button"
                @click="quickPick(n)"
              >
                {{ n }}
              </button>
            </div>
            <div v-else class="multiplier__grid">
              <button
                v-for="m in multipliers"
                :key="m"
                type="button"
                class="multiplier__button"
                :class="{ 'multiplier__button--active': multiplier === m }"
                @click="multiplier = m"
              >
                X{{ m }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="keno__col keno__col--right">
      <div class="keno__markets">
        <div class="keno-markets__title">Number bets</div>
        <div class="keno-markets__grid">
          <div
            v-for="b in numberBets"
            :key="b"
            class="keno-markets__odds-container"
          >
            <div class="keno-markets__odd" @click="addSpecialBet(b)">
              {{ b }}
            </div>
          </div>
        </div>
      </div>
      <div class="keno__more-markets">
        <div class="keno-markets__title">Sum bets</div>
        <div class="keno-markets__grid">
          <div
            v-for="b in sumBets"
            :key="b"
            class="keno-markets__odds-container"
          >
            <div class="keno-markets__odd" @click="addSpecialBet(b)">
              {{ b }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useGamesStore, useBetslipStore } from "@/stores";

export default {
  name: "KenoGame",
  setup() {
    const gamesStore = useGamesStore();
    const betslipStore = useBetslipStore();
    return { gamesStore, betslipStore };
  },
  data() {
    return {
      mode: "numbers",
      modeTabs: [
        { key: "numbers", label: "Numbers" },
        { key: "all-in", label: "All-in" },
        { key: "no-draw", label: "No draw" },
      ],
      tab: "quick",
      multiplier: 1,
      multipliers: [1, 2, 4, 5, 10, 15, 20],
      numberBets: [
        "First Single YES",
        "First Single NO",
        "Last Single YES",
        "Last Single NO",
        "First EVEN",
        "First ODD",
        "Last EVEN",
        "Last ODD",
        "First < 40.5",
        "First > 40.5",
        "Last < 40.5",
        "Last > 40.5",
      ],
      sumBets: ["< 810.5", "> 810.5", "5 First < 202.5", "5 First > 202.5"],
    };
  },
  methods: {
    isSelected(n) {
      return this.betslipStore.selectedNumbers.includes(n);
    },
    toggleNumber(n) {
      this.betslipStore.toggleButton(n);
    },
    toggleRow(row) {
      const numbers = [];
      for (let i = 1; i <= 10; i++) numbers.push((row - 1) * 10 + i);
      this.toggleGroup(numbers);
    },
    toggleColumn(col) {
      const numbers = [];
      for (let i = 0; i < 8; i++) numbers.push(col + i * 10);
      this.toggleGroup(numbers);
    },
    toggleGroup(numbers) {
      const current = this.betslipStore.selectedNumbers;
      const same =
        current.length === numbers.length &&
        numbers.every((n) => current.includes(n));
      this.betslipStore.setSelectedNumbers(same ? [] : numbers);
    },
    quickPick(count) {
      this.betslipStore.clearSelected();
      const available = [];
      for (let i = 1; i <= 80; i++) available.push(i);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * available.length);
        this.betslipStore.toggleButton(available[idx]);
        available.splice(idx, 1);
      }
    },
    addSpecialBet(market) {
      const open = this.gamesStore.openGame;
      if (!open) return;
      this.betslipStore.addKeno(
        open.gameNumber,
        open.endTime,
        open.id,
        true,
        0,
        market,
      );
    },
  },
};
</script>

<style scoped>
.keno {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  min-height: 0;
  background: #fafafa;
  overflow: hidden;
  font-weight: 700;
}

.keno__col {
  display: flex;
  flex-flow: column;
  flex: 1 1 0%;
  min-width: 0;
  padding: max(10px, min(0.781vw, 1.389vh)) max(14px, min(1.042vw, 1.852vh));
}

.keno__col--left {
  padding-right: max(28px, min(2.083vw, 3.704vh));
}

.keno__col--right {
  padding-left: max(28px, min(2.083vw, 3.704vh));
}

.keno__bet-table {
  display: flex;
  flex-flow: column;
  flex: 1 1 0%;
  min-height: 0;
  margin-bottom: max(20px, min(1.563vw, 2.778vh));
}

.bet-table-odd {
  display: flex;
  flex-flow: column;
  flex: 1 1 0%;
  min-height: 0;
  color: #030303;
}

.bet-table-odd__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.bet-table-odd__title {
  font-size: max(24px, min(1.875vw, 3.333vh));
  font-weight: 700;
  text-transform: capitalize;
  margin-bottom: max(17px, min(1.302vw, 2.315vh));
}

.bet-table-odd__buttons {
  display: flex;
  justify-content: space-around;
  font-size: max(11px, min(0.833vw, 1.481vh));
  text-transform: uppercase;
  border-radius: 1px;
  margin-bottom: max(12px, min(0.938vw, 1.667vh));
}

.bet-table-odd__button {
  padding: max(8px, min(0.625vw, 1.111vh)) max(8px, min(0.573vw, 1.019vh));
  margin-bottom: max(12px, min(0.938vw, 1.667vh));
  color: rgba(0, 90, 181, 0.5);
  background: transparent;
  border: 1px solid rgba(0, 90, 181, 0.4);
  border-radius: 1px;
  font-size: max(11px, min(0.833vw, 1.481vh));
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}

.bet-table-odd__button--selected {
  color: #fefefe;
  background: #005ab5;
}

.bet-table-odd__grid {
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  padding: 6px;
  margin: -2px;
}

.bet-table-odd__vertical-column {
  flex: 0 0 8.33333%;
  max-width: 8.33333%;
  display: flex;
  flex-flow: column;
  height: calc(100% - max(40px, min(3.125vw, 5.556vh)));
  margin: 0;
}

.bet-table-odd__vcell {
  flex: 1 1 0%;
  padding: 0 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bet-table-odd__horizontal-column {
  flex: 1 1 0%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: 0 -2px;
}

.bet-table-odd__hcell {
  flex: 0 0 10%;
  max-width: 10%;
  align-self: flex-start;
  box-sizing: border-box;
  padding: 0 2px 3px;
}

.keno-odd {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1.22;
  font-size: max(18px, min(1.354vw, 2.407vh));
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #030303;
  background: #fafafa;
  border-radius: 5px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.14),
    0 3px 4px rgba(0, 0, 0, 0.12),
    0 1px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;
  border: 0;
  padding: 0;
  font-family: inherit;
}

.keno-odd--selected {
  color: #fefefe;
  background: #005ab5;
}

.keno-odd--icon {
  background: #fefefe;
  opacity: 0.5;
  color: #030303;
}

.keno-odd--icon svg {
  width: max(15px, min(1.094vw, 1.944vh));
  height: max(15px, min(1.094vw, 1.944vh));
}

.keno-odd--rotate svg {
  transform: rotate(90deg);
}

.tab-set {
  display: flex;
  flex-flow: column;
  overflow: hidden;
  flex: 0 0 auto;
  margin-top: max(22px, min(1.563vw, 2.778vh));
}

.tab-set__headers {
  display: flex;
  flex-flow: nowrap;
  justify-content: flex-start;
  padding-left: max(20px, min(1.563vw, 2.778vh));
}

.tab-header {
  margin: 0 1px;
  padding: max(6px, min(0.417vw, 0.741vh)) max(14px, min(1.042vw, 1.852vh));
  font-size: max(15px, min(1.146vw, 2.037vh));
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 325px;
  border-width: 1px 1px 0;
  border-style: solid solid none;
  border-color: #d0d6e0 #d0d6e0 currentColor;
}

.tab-header--quick-pick {
  color: rgba(3, 3, 3, 0.8);
  background: #aeb6bd;
}

.tab-header--multiplier {
  color: rgba(3, 3, 3, 0.8);
  background: #aeb6bd;
}

.tab-header--active {
  color: #030303;
  background: #e4eaee;
}

.tab-set__contents {
  display: flex;
  flex-flow: nowrap;
  background: #e4eaee;
}

.quick-pick {
  display: flex;
  flex: 1;
  font-weight: 700;
  gap: 4px;
  padding: 6px;
}

.quick-pick__button {
  flex: 1 1 0%;
  background: #eef2f5;
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.14),
    0 2px 2px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.2);
  padding: max(14px, min(1.042vw, 1.852vh)) 0;
  font-size: max(15px, min(1.146vw, 2.037vh));
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  border: 0;
  color: #030303;
}

.multiplier__grid {
  display: flex;
  flex-wrap: nowrap;
  flex: 1;
  gap: 4px;
  padding: 6px;
}

.multiplier__button {
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  justify-content: center;
  padding: max(14px, min(1.042vw, 1.852vh)) 0;
  font-size: max(15px, min(1.146vw, 2.037vh));
  font-weight: 700;
  cursor: pointer;
  border-radius: 2px;
  text-transform: lowercase;
  background: #eef2f5;
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.14),
    0 2px 2px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.2);
  border: 0;
  color: #030303;
}

.multiplier__button--active {
  color: #fefefe;
  background: #005ab5;
}

.keno__markets {
  display: flex;
  flex-flow: column;
  flex: 0 0 auto;
  min-height: 0;
  margin-bottom: max(20px, min(1.563vw, 2.778vh));
  font-weight: 700;
}

.keno__more-markets {
  display: flex;
  flex-flow: column;
  flex: 1 1 0%;
  min-height: 0;
  margin-bottom: max(20px, min(1.563vw, 2.778vh));
  font-weight: 700;
}

.keno-markets__title {
  font-size: max(18px, min(1.354vw, 2.407vh));
  border-bottom: 1px solid #181a1c;
  margin-bottom: max(20px, min(1.563vw, 2.778vh));
}

.keno-markets__grid {
  display: flex;
  flex-wrap: wrap;
}

.keno-markets__odds-container {
  flex: 0 0 50%;
  max-width: 50%;
  box-sizing: border-box;
}

.keno-markets__odds-container:nth-child(2n) {
  padding-left: max(7px, min(0.521vw, 0.926vh));
}

.keno-markets__odds-container:nth-child(2n + 1) {
  padding-right: max(7px, min(0.521vw, 0.926vh));
}

.keno-markets__odd {
  padding: max(9px, min(0.625vw, 1.111vh)) 0;
  margin-bottom: max(12px, min(0.938vw, 1.667vh));
  font-size: max(14px, min(1.094vw, 1.944vh));
  text-align: center;
  color: #030303;
  background: #eef2f5;
  border-radius: 2px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.14),
    0 3px 4px rgba(0, 0, 0, 0.12),
    0 1px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;
}

.keno-markets__odd--selected {
  color: #fefefe;
  background: #005ab5;
}
</style>
