<template>
  <aside
    class="flex h-full w-[20.3125%] min-w-[79px] shrink-0 flex-col overflow-hidden bg-[#263238]"
  >
    <!-- Header -->
    <div class="shrink-0">
      <div
        class="flex h-[2.315vh] items-center justify-end bg-[#030303] pr-[14px] text-[1.481vh] font-[400] leading-none text-[#FEFEFE] tabular-nums"
      >
        {{ clock }}
      </div>
      <div
        class="flex h-[4.444vh] items-center justify-between px-[16px] text-[#FEFEFE]"
      >
        <div class="flex min-w-0 items-center">
          <IconGlyph
            code="e0c8"
            size="max(14px,min(1.25vw,2.222vh))"
            class="mr-[6px] text-[#FEFEFE]"
          />
          <span
            class="truncate text-[max(11px,min(1.042vw,1.852vh))] font-[400]"
            >{{ authStore.getDisplayName }}</span
          >
        </div>
        <div class="flex shrink-0 items-center">
          <span
            class="mr-[16px] text-[max(11px,min(1.042vw,1.852vh))] font-[400] tabular-nums"
            >{{ money(balance) }}</span
          >
          <button
            class="text-[#FEFEFE] transition-colors hover:text-white/80"
            @click="menuOpen = !menuOpen"
          >
            <IconGlyph code="e076" size="max(16px,min(1.354vw,2.407vh))" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex min-h-0 flex-1 flex-col px-[10px] pt-[1.389vh]">
      <!-- FASTBET -->
      <button
        class="relative flex h-[3.704vh] shrink-0 items-center overflow-hidden rounded-[2px] bg-[#E9B832] px-[15px] text-left"
        @click="betslipStore.toggleFastbetHelp()"
      >
        <span
          class="flex-1 truncate text-[max(11px,min(0.99vw,1.759vh))] font-[700] uppercase tracking-[2px] text-[#5c5a51]"
          >Fastbet Help</span
        >
        <svg
          class="h-[24px] w-[24px] shrink-0 text-[#3a3a3a]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M3 3h7v7H3V3zm2 2v3h3V5H5zm9-2h7v7h-7V3zm2 2v3h3V5h-3zM3 14h7v7H3v-7zm2 2v3h3v-3H5zm11-2h2v3h3v2h-3v3h-2v-3h-3v-2h3v-3z"
          />
        </svg>
      </button>

      <!-- Slip -->
      <div class="mt-[1.111vh] flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          class="flex h-[3.241vh] shrink-0 items-center bg-[#005AB5] px-[10px] text-[max(9px,min(0.781vw,1.389vh))] font-[700] uppercase leading-none text-[#FEFEFE]"
        >
          <span class="flex-1">Selection</span>
          <span class="w-[70px] text-center">Odds</span>
          <span class="w-[58px] text-right">Stake</span>
          <button
            class="ml-[4px] flex h-[2.5vh] w-[20px] shrink-0 items-center justify-center rounded-[2px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="
              betslipStore.pendingSelections.length === 0 &&
              !betslipStore.hasForecastSelections &&
              !betslipStore.hasQuinellaSelections &&
              !hasKenoPicks
            "
            title="Add selected odds"
            @click="addToSlip"
          >
            <IconGlyph code="e09e" size="max(11px,min(0.833vw,1.481vh))" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto bg-white">
          <div
            v-for="group in betslipGroups"
            :key="group.gameNumber"
            class="border-b border-[#0000001a]"
          >
            <div class="flex items-center px-[10px] pt-[0.556vh]">
              <span
                class="rounded-[2px] bg-[#618B31] px-[5px] text-[max(8px,min(0.573vw,1.019vh))] font-[700] leading-[1.3] text-[#FEFEFE] tabular-nums"
              >
                #{{ group.gameNumber }}
              </span>
            </div>
            <div
              v-for="bet in group.bets"
              :key="bet.id"
              class="flex items-center px-[10px] text-[#030303]"
            >
              <div class="flex min-w-0 flex-1 items-center gap-[4px]">
                <span
                  class="max-w-full truncate text-[max(10px,min(0.729vw,1.296vh))] text-[#030303]"
                  >{{ capitalize(bet.market) }}</span
                >
                <span
                  class="max-w-full truncate text-[max(10px,min(0.729vw,1.296vh))] text-[#030303]"
                  >{{ betNumbers(bet) }}</span
                >
              </div>
              <div class="flex w-[70px] items-center justify-center">
                <input
                  type="number"
                  :value="bet.pay"
                  step="0.01"
                  min="0"
                  class="w-[60px] rounded-[2px] bg-white px-1 text-center text-[max(11px,min(0.833vw,1.481vh))] text-black outline-none"
                  @change="updateOdd($event, bet)"
                />
              </div>
              <div class="flex w-[58px] items-center justify-end">
                <input
                  type="number"
                  :value="bet.stake"
                  min="10"
                  class="w-[42px] rounded-[2px] bg-white px-1 text-right text-[max(10px,min(0.729vw,1.296vh))] text-black outline-none"
                  @change="updateStake($event, bet)"
                />
                <button
                  class="ml-1 text-[#E02B2B] hover:text-[#b81f1f]"
                  @click="betslipStore.removePick(bet.id)"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="betslipStore.fastbetHelpOpen"
            class="px-[10px] py-[0.741vh] text-[max(9px,min(0.625vw,1.111vh))] text-black/40"
          >
            Select a participant from the grid, set your stake, then press the
            green button to place your bet.
          </div>
        </div>
      </div>
    </div>

    <!-- Bet info -->
    <div class="mx-[10px] mt-[0.926vh] flex h-[9.444vh] shrink-0 items-center">
      <div
        class="flex h-[5.25vh] w-[50px] shrink-0 items-center justify-center rounded-[3px] bg-[#ECEFF1]"
      >
        <IconGlyph
          code="e004"
          size="max(17px,min(1.7vw,3.02vh))"
          class="text-[#4b4f52]"
        />
      </div>
      <div
        class="ml-[12px] flex h-[7.222vh] min-w-0 flex-1 flex-col justify-center rounded-[3px] bg-[#005AB5] px-[13px]"
      >
        <div class="flex items-center justify-between whitespace-nowrap">
          <span
            class="text-[max(11px,min(1.042vw,1.852vh))] font-[400] text-[#FEFEFE]"
            >Total Bet</span
          >
          <span
            class="text-[max(13px,min(1.354vw,2.407vh))] font-[400] text-[#FEFEFE] tabular-nums"
            >{{ money(betslipStore.totalStake) }}</span
          >
        </div>
        <div
          class="flex items-center justify-between whitespace-nowrap opacity-60"
        >
          <span
            class="text-[max(11px,min(1.042vw,1.852vh))] font-[400] text-[#FEFEFE]"
            >Max. Winning</span
          >
          <span
            class="text-[max(11px,min(1.042vw,1.852vh))] font-[400] text-[#FEFEFE] tabular-nums"
            >{{ money(betslipStore.maxWinning) }}</span
          >
        </div>
      </div>
    </div>

    <!-- Stake -->
    <div class="mx-[10px] mt-[1.111vh] flex h-[4.815vh] shrink-0 items-center">
      <span
        class="mr-[10px] shrink-0 whitespace-nowrap text-[max(11px,min(0.9375vw,1.667vh))] font-[400] text-[#9aa1a6]"
        >Stake:</span
      >
      <div
        class="flex h-[4.815vh] min-w-0 flex-1 items-center justify-end gap-[0.4ch] rounded-[1px] bg-[#FEFEFE] px-[10px]"
        style="border: 2px inset #767676"
      >
        <span
          class="shrink-0 text-[max(16px,min(1.667vw,2.963vh))] font-[700] text-[#030303]"
          >Br</span
        >
        <input
          type="number"
          v-model.number="stakeInput"
          min="10"
          step="10"
          class="min-w-0 text-right text-[max(16px,min(1.667vw,2.963vh))] font-[700] text-[#030303] focus:outline-none"
          :style="{ width: stakeWidth }"
          @change="onStakeInputChange"
        />
      </div>
    </div>

    <!-- Chips -->
    <div
      class="mx-[10px] mt-[0.556vh] flex h-[3.704vh] shrink-0 items-center gap-[3px]"
    >
      <button
        v-for="preset in STAKE_PRESETS"
        :key="preset"
        class="h-[3.704vh] min-w-0 flex-1 rounded-[3px] bg-[#ECEFF1] text-[max(11px,min(1.042vw,1.852vh))] font-[700] text-[#030303] transition-colors hover:bg-[#e2e6e8]"
        @click="betslipStore.setStake(preset)"
      >
        +{{ preset }}
      </button>
      <button
        class="h-[3.704vh] w-[44px] shrink-0 rounded-[3px] bg-[#ECEFF1] text-[max(11px,min(1.042vw,1.852vh))] font-[700] text-[#E02B2B] transition-colors hover:bg-[#e2e6e8]"
        @click="betslipStore.clearPicks()"
      >
        ✕
      </button>
    </div>

    <!-- Actions -->
    <div
      class="bet-actions mx-[10px] mt-[2.6vh] mb-[0.926vh] flex shrink-0 items-stretch gap-[8px]"
    >
      <button
        class="flex h-[7.593vh] flex-1 items-center justify-center rounded-[3px] bg-[#ECEFF1] transition-colors hover:bg-[#e2e6e8] disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="
          !betslipStore.hasForecastSelections &&
          !betslipStore.hasQuinellaSelections &&
          betslipStore.pendingSelections.length === 0 &&
          !hasKenoPicks
        "
        @click="addToSlip"
        title="Add to slip"
      >
        <IconGlyph
          code="e026"
          size="max(20px,min(1.875vw,3.333vh))"
          class="text-[#618B31]"
        />
      </button>

      <button
        class="flex h-[7.593vh] flex-1 items-center justify-center rounded-[3px] bg-[#ECEFF1] transition-colors hover:bg-[#e2e6e8] disabled:cursor-not-allowed disabled:opacity-60"
        @click="betslipStore.clearPicks()"
        title="Cancel"
      >
        <IconGlyph
          code="e032"
          size="max(20px,min(1.875vw,3.333vh))"
          class="text-[#D43548]"
        />
      </button>

      <button
        class="flex h-[7.593vh] flex-1 items-center justify-center rounded-[3px] bg-[#ECEFF1] transition-colors hover:bg-[#e2e6e8]"
        @click="$refs.ticketCheckModal.show()"
        title="Scan ticket"
      >
        <IconGlyph
          code="e014"
          size="max(20px,min(1.875vw,3.333vh))"
          class="text-[#030303]"
        />
      </button>

      <button
        class="flex h-[7.593vh] flex-1 items-center justify-center rounded-[3px] bg-[#618B31] transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canUsePrinter || betslipStore.loadingPlaceBet"
        :title="printerTitle"
        @click="placeBet"
      >
        <IconGlyph
          code="e095"
          size="max(20px,min(1.875vw,3.333vh))"
          class="text-[#FEFEFE]"
        />
      </button>
    </div>

    <TicketCheckModal ref="ticketCheckModal" />
    <ChangePasswordModal ref="changePasswordModal" />

    <teleport to="body">
      <transition name="betslip-menu">
        <div
          v-if="menuOpen"
          class="betslip-menu-overlay"
          @click="menuOpen = false"
        >
          <aside class="betslip-menu-panel" @click.stop>
            <button
              type="button"
              class="betslip-menu-action"
              @click="openAdminFromMenu"
            >
              <IconGlyph code="e004" size="max(18px,min(1.35vw,2.4vh))" />
              <span class="betslip-menu-label">Admin</span>
            </button>

            <button
              type="button"
              class="betslip-menu-action betslip-menu-action--muted"
            >
              <IconGlyph code="e091" size="max(18px,min(1.35vw,2.4vh))" />
              <span class="betslip-menu-label">Print Last Ticket</span>
            </button>

            <button type="button" class="betslip-menu-action">
              <IconGlyph code="e092" size="max(18px,min(1.35vw,2.4vh))" />
              <span class="betslip-menu-label">Reprint A Ticket</span>
            </button>

            <button
              type="button"
              class="betslip-menu-action betslip-menu-action--text"
            >
              <span class="betslip-menu-label">Fastbet Help</span>
            </button>

            <button type="button" class="betslip-menu-action">
              <IconGlyph code="e0a5" size="max(18px,min(1.35vw,2.4vh))" />
              <span class="betslip-menu-label">Shortcuts Help</span>
            </button>

            <button type="button" class="betslip-menu-action">
              <IconGlyph code="e05a" size="max(18px,min(1.35vw,2.4vh))" />
              <span class="betslip-menu-label">Full Screen</span>
            </button>

            <button
              type="button"
              class="betslip-menu-action betslip-menu-action--muted betslip-menu-action--text"
            >
              <span class="betslip-menu-label">Units &amp; Printer</span>
            </button>

            <button
              type="button"
              class="betslip-menu-action betslip-menu-action--logout"
              @click="logout"
            >
              <IconGlyph code="e08f" size="max(18px,min(1.35vw,2.4vh))" />
              <span class="betslip-menu-label">Log Out</span>
            </button>
          </aside>
        </div>
      </transition>
    </teleport>
  </aside>
</template>

<style scoped>
.bet-actions > button {
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.14),
    0 2px 2px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

.betslip-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
}

.betslip-menu-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: max(280px, 24vw);
  gap: clamp(10px, 1.4vh, 18px);
  overflow-y: auto;
  padding: clamp(24px, 5vh, 56px) 6% clamp(16px, 3vh, 32px);
  background: #263238;
}

.betslip-menu-action {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 0.6vh, 10px);
  width: 100%;
  height: clamp(72px, 9.8vh, 112px);
  padding: 0 8px;
  border: 0;
  border-radius: 0;
  background: #eceff1;
  color: #263238;
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.14),
    0 2px 2px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.betslip-menu-action--muted {
  background: #78909c;
}

.betslip-menu-action--text {
  flex-direction: row;
}

.betslip-menu-action--logout {
  flex-direction: row;
  gap: 0.8vh;
  border: 1px solid #fefefe;
  background: transparent;
  color: #fefefe;
  box-shadow: none;
}

.betslip-menu-label {
  font-size: clamp(14px, min(1.2vw, 2.15vh), 23px);
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
}

.betslip-menu-enter-active .betslip-menu-panel,
.betslip-menu-leave-active .betslip-menu-panel {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.betslip-menu-enter-from .betslip-menu-panel,
.betslip-menu-leave-to .betslip-menu-panel {
  transform: translateX(100%);
}
</style>

<script>
import {
  useBetslipStore,
  useAuthStore,
  useGamesStore,
  useAdminStore,
  STAKE_PRESETS,
} from "@/stores";
import TicketCheckModal from "@/components/modal/TicketCheckModal.vue";
import ChangePasswordModal from "@/components/modal/ChangePasswordModal.vue";
import IconGlyph from "@/components/IconGlyph.vue";
import printerApi from "@/api/printer";
import slipApi from "@/api/slip";

export default {
  name: "BetSlipSidebar",
  components: { TicketCheckModal, ChangePasswordModal, IconGlyph },
  setup() {
    const betslipStore = useBetslipStore();
    const authStore = useAuthStore();
    const gamesStore = useGamesStore();
    const adminStore = useAdminStore();
    return {
      betslipStore,
      authStore,
      gamesStore,
      adminStore,
      STAKE_PRESETS,
    };
  },
  data() {
    return {
      stakeInput: 10,
      balance: 0,
      menuOpen: false,
      clock: "",
      timerHandle: null,
      balanceTimer: null,
      hasLastTicket: false,
    };
  },
  computed: {
    isKeno() {
      return this.gamesStore.activeGameType === "KENO";
    },
    hasKenoPicks() {
      return this.isKeno && this.betslipStore.selectedNumbers.length > 0;
    },
    stakeWidth() {
      const len = String(this.stakeInput ?? "").length;
      return `${Math.max(2, len)}ch`;
    },
    betslipGroups() {
      const groups = [];
      const byNumber = new Map();
      for (const bet of this.betslipStore.betslip.bets) {
        const key = bet.gameNumber;
        if (!byNumber.has(key)) {
          byNumber.set(key, []);
          groups.push({ gameNumber: key, bets: byNumber.get(key) });
        }
        byNumber.get(key).push(bet);
      }
      return groups;
    },
    hasPlaceableSelections() {
      return (
        this.betslipStore.betslip.bets.length > 0 ||
        this.betslipStore.pendingSelections.length > 0 ||
        this.betslipStore.hasForecastSelections ||
        this.betslipStore.hasQuinellaSelections
      );
    },
    canUsePrinter() {
      return this.betslipStore.betslip.bets.length > 0;
    },
    printerTitle() {
      return "Place bet and print";
    },
  },
  watch: {
    "betslipStore.stake"(val) {
      this.stakeInput = val;
    },
  },
  mounted() {
    const tick = () => {
      const now = new Date();
      this.clock =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");
    };
    tick();
    this.timerHandle = setInterval(tick, 1000);
    this.fetchBalance();
    this.balanceTimer = setInterval(() => this.fetchBalance(), 30000);
    try {
      this.hasLastTicket = !!localStorage.getItem("lastTicket");
    } catch (e) {
      this.hasLastTicket = false;
    }
  },
  beforeUnmount() {
    if (this.timerHandle) clearInterval(this.timerHandle);
    if (this.balanceTimer) clearInterval(this.balanceTimer);
  },
  methods: {
    capitalize(value) {
      if (!value) return "";
      return (
        String(value).charAt(0).toUpperCase() +
        String(value).slice(1).toLowerCase()
      );
    },
    betNumbers(bet) {
      if (bet.picksDisplay) return bet.picksDisplay;
      if (Array.isArray(bet.picks)) {
        return bet.picks
          .map((p) => (typeof p === "number" ? p : p.participantNumber))
          .join(",");
      }
      return "";
    },
    money(value) {
      const num = Number(value) || 0;
      const text = Number.isInteger(num) ? String(num) : num.toFixed(2);
      return "Br " + text;
    },
    openChangePassword() {
      this.menuOpen = false;
      this.$refs.changePasswordModal.show();
    },
    openAdminFromMenu() {
      this.menuOpen = false;
      this.adminStore.open("openTickets");
    },
    logout() {
      this.menuOpen = false;
      this.authStore.logout();
      this.$router.push({ name: "login" });
    },
    formattedPicks(bet) {
      if (Array.isArray(bet.picks)) {
        if (bet.picks.every((p) => typeof p === "object" && p !== null)) {
          return bet.picks.map((p) => p.participantNumber).join(", ");
        }
        return bet.picks.join(", ");
      }
      return bet.picks || "";
    },
    onStakeInputChange() {
      const val = parseFloat(this.stakeInput);
      if (!isNaN(val) && val >= 10) {
        this.betslipStore.setStake(val);
      }
    },
    updateStake(event, bet) {
      const val = parseFloat(event.target.value);
      if (!isNaN(val)) {
        this.betslipStore.setBetStakeFromInput(val, bet.id);
      }
    },
    updateOdd(event, bet) {
      this.betslipStore.setBetOddFromInput(event.target.value, bet.id);
    },
    addToSlip() {
      if (this.hasKenoPicks) {
        const open = this.gamesStore.openGame;
        if (open) {
          this.betslipStore.addKeno(open.gameNumber, open.endTime, open.id);
          this.betslipStore.clearSelected();
          return true;
        }
        return false;
      }
      if (this.betslipStore.hasForecastSelections) {
        this.betslipStore.commitForecast();
      }
      if (this.betslipStore.hasQuinellaSelections) {
        this.betslipStore.commitQuinella();
      }
      if (this.betslipStore.pendingSelections.length > 0) {
        return this.betslipStore.commitPendingSelections();
      }
      return false;
    },
    async fetchBalance() {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const res = await slipApi.getShiftReport({
        from: from.toISOString(),
        to: now.toISOString(),
      });
      if (res.status === 200 || res.status === 201) {
        const reports = Array.isArray(res.data)
          ? res.data
          : res.data
            ? [res.data]
            : [];
        this.balance = reports.reduce(
          (total, report) => total + Number(report.net || 0),
          0,
        );
      }
    },
    async placeBet() {
      if (this.betslipStore.hasForecastSelections) {
        this.betslipStore.commitForecast();
      }
      if (this.betslipStore.hasQuinellaSelections) {
        this.betslipStore.commitQuinella();
      }
      if (this.betslipStore.pendingSelections.length > 0) {
        this.betslipStore.commitPendingSelections();
      }
      if (this.betslipStore.betslip.bets.length === 0) {
        return this.printLastTicket();
      }
      const res = await this.betslipStore.placeBet();
      if (res && res.status === 201) {
        try {
          localStorage.setItem("lastTicket", JSON.stringify(res.data));
          this.hasLastTicket = true;
        } catch (e) {
          /* ignore storage errors */
        }
        this.$notify({
          title: "Bet placed successfully",
          text: `Ticket ${res.data?.ticketNumber || ""}`,
          type: "success",
        });
        this.betslipStore.clearPicks();
        this.fetchBalance();
      } else {
        this.$notify({
          title: "Failed to place bet",
          text: res?.data?.message || "Something went wrong",
          type: "error",
        });
      }
    },
    async printLastTicket() {
      const lastTicket = localStorage.getItem("lastTicket");
      if (!lastTicket) {
        this.$notify({
          title: "No ticket to print",
          text: "Place a bet first",
          type: "warn",
        });
        return;
      }
      const res = await printerApi.printTicket(JSON.parse(lastTicket));
      if (res.status === 200 || res.status === 201) {
        this.$notify({ title: "Ticket sent to printer", type: "success" });
      } else {
        this.$notify({ title: "Print failed", type: "error" });
      }
    },
  },
};
</script>
