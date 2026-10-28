<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div
            class="flex items-center justify-between px-5 py-3 bg-primary text-white"
          >
            <h2 class="text-lg font-bold">Ticket Check</h2>
            <button
              class="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              @click="close"
            >
              <svg
                class="w-5 h-5"
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

          <!-- Search bar -->
          <div class="shrink-0 p-4 border-b border-gray-200">
            <div class="flex gap-2">
              <input
                v-model="ticketNumber"
                type="text"
                placeholder="Enter ticket number..."
                class="input-field text-gray-800 bg-white border-gray-300 font-mono"
                @keyup.enter="checkTicket"
                ref="ticketInput"
              />
              <button
                class="btn-primary shrink-0"
                :disabled="loading"
                @click="checkTicket"
              >
                <span v-if="loading" class="inline-flex items-center gap-2">
                  <svg
                    class="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </span>
                <span v-else>Check</span>
              </button>
            </div>
          </div>

          <!-- Ticket details -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="!ticket" class="text-center py-16 text-gray-400">
              <p class="font-medium">Enter a ticket number or scan a barcode</p>
            </div>

            <div v-else>
              <!-- Ticket header -->
              <div
                class="flex items-center justify-between mb-3 p-3 bg-surface-light rounded-lg"
              >
                <div>
                  <p class="font-mono font-bold text-gray-800">
                    {{ ticket.ticketNumber }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(ticket.createdAt) }}
                  </p>
                </div>
                <span
                  class="badge"
                  :class="statusClass(ticket.status || overallStatus)"
                  >{{ ticket.status || overallStatus }}</span
                >
              </div>

              <!-- Bets -->
              <div class="overflow-x-auto rounded-lg border border-gray-200">
                <table class="w-full text-sm">
                  <thead>
                    <tr
                      class="bg-surface-light text-left text-gray-500 text-xs uppercase"
                    >
                      <th class="py-2 px-3">Game</th>
                      <th class="py-2 px-3">Event</th>
                      <th class="py-2 px-3">Type</th>
                      <th class="py-2 px-3">Picks</th>
                      <th class="py-2 px-3">Stake</th>
                      <th class="py-2 px-3">Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(b, i) in ticket.bets"
                      :key="i"
                      class="border-t border-gray-100"
                    >
                      <td class="py-2 px-3">{{ b.gameType }}</td>
                      <td class="py-2 px-3">#{{ b.gameNumber }}</td>
                      <td class="py-2 px-3">{{ b.betType }}</td>
                      <td class="py-2 px-3">{{ formatPicks(b.picks) }}</td>
                      <td class="py-2 px-3">
                        {{ money(b.netStake ?? b.grossStake) }}
                      </td>
                      <td class="py-2 px-3 font-semibold">
                        {{ money(b.payoutAmount || 0) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Totals -->
              <div class="grid grid-cols-2 gap-3 mt-3">
                <div class="p-3 bg-surface-light rounded-lg">
                  <p class="text-xs text-gray-500">Total Stake</p>
                  <p class="text-lg font-bold text-gray-800">
                    {{ money(ticket.grossStake ?? ticket.netStake) }}
                  </p>
                </div>
                <div class="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p class="text-xs text-green-600">Net Winnings</p>
                  <p class="text-lg font-bold text-green-700">
                    {{ money(ticket.netWinning || 0) }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 mt-4">
                <button
                  class="flex-1 btn-accent"
                  :disabled="!canRedeem || loading"
                  @click="redeem"
                >
                  <span class="inline-flex items-center gap-2">
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Redeem
                  </span>
                </button>
                <button
                  class="flex-1 btn-secondary"
                  :disabled="!canCancel || loading"
                  @click="cancel"
                >
                  <span class="inline-flex items-center gap-2">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Cancel Bet
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import slipApi from "@/api/slip";
import printerApi from "@/api/printer";
import { useAuthStore } from "@/stores";

export default {
  name: "TicketCheckModal",
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      visible: false,
      ticketNumber: "",
      ticket: null,
      loading: false,
    };
  },
  computed: {
    overallStatus() {
      if (!this.ticket || !this.ticket.bets || this.ticket.bets.length === 0)
        return "OPEN";
      const statuses = this.ticket.bets.map((b) =>
        (b.status || "OPEN").toUpperCase(),
      );
      if (statuses.every((s) => s === "WON" || s === "PAID")) return "WON";
      if (statuses.some((s) => s === "WON" || s === "PAID")) return "PARTIAL";
      return "OPEN";
    },
    canRedeem() {
      return (
        this.ticket &&
        this.overallStatus !== "LOST" &&
        this.overallStatus !== "REVOKED"
      );
    },
    canCancel() {
      return this.ticket && this.overallStatus === "OPEN";
    },
  },
  methods: {
    show(ticketNumber = "") {
      this.visible = true;
      this.ticketNumber = ticketNumber || "";
      this.ticket = null;
      this.$nextTick(() => {
        if (this.$refs.ticketInput) this.$refs.ticketInput.focus();
      });
      if (ticketNumber) this.checkTicket();
    },
    close() {
      if (this.loading) return;
      this.visible = false;
    },
    formatDate(dt) {
      return dt ? this.$moment(dt).format("DD/MM/YYYY HH:mm:ss") : "--";
    },
    formatPicks(picks) {
      if (!picks) return "—";
      if (Array.isArray(picks)) {
        if (picks.every((p) => typeof p === "object")) {
          return picks.map((p) => p.participantNumber).join(", ");
        }
        return picks.join(", ");
      }
      return picks;
    },
    money(value) {
      return this.$filters.currency(value || 0);
    },
    statusClass(status) {
      const s = (status || "").toUpperCase();
      if (s === "WON" || s === "PAID") return "badge badge-active";
      if (s === "OPEN") return "badge badge-warning";
      if (s === "PARTIAL") return "badge badge-info";
      return "badge bg-gray-200 text-gray-600";
    },
    async checkTicket() {
      if (!this.ticketNumber || this.loading) return;
      this.loading = true;
      const res = await slipApi.fetchSlip(this.ticketNumber);
      if (res.status === 200 || res.status === 304) {
        this.ticket = res.data;
        this.ticketNumber = "";
      } else {
        this.ticket = null;
        this.$notify({
          title: "Ticket not found",
          text: "No ticket matches that number",
          type: "error",
        });
      }
      this.loading = false;
    },
    async redeem() {
      if (!this.ticket || this.loading) return;
      this.loading = true;
      const res = await slipApi.redeemBet(this.ticket.id);
      if (res.status === 201) {
        await printerApi.printRedeem({
          ...this.ticket,
          shopName: this.authStore.shopName,
          username: this.authStore.username,
        });
        this.$notify({
          title: "Ticket redeemed",
          text: `${this.$filters.currency(this.ticket.netWinning || 0)} paid out`,
          type: "success",
        });
        this.ticket = null;
      } else {
        this.$notify({
          title: "Redeem failed",
          text: res.data?.message || "Something went wrong",
          type: "error",
        });
      }
      this.loading = false;
    },
    async cancel() {
      if (!this.ticket || this.loading) return;
      this.loading = true;
      const res = await slipApi.cancelBet(this.ticket.id);
      if (res.status === 201) {
        await printerApi.printCancel({
          ...this.ticket,
          shopName: this.authStore.shopName,
          username: this.authStore.username,
        });
        this.$notify({
          title: "Bet cancelled",
          text: `Stake of ${this.$filters.currency(this.ticket.netStake)} returned`,
          type: "success",
        });
        this.ticket = null;
      } else {
        this.$notify({
          title: "Cancel failed",
          text: res.data?.message || "Something went wrong",
          type: "error",
        });
      }
      this.loading = false;
    },
  },
};
</script>
