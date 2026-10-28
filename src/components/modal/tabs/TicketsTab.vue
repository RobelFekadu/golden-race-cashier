<template>
  <div class="px-[50px] py-[28px]">
    <div class="flex items-center gap-3 mb-2">
      <h3 class="text-lg font-bold text-gray-900">TICKETS</h3>
      <button
        class="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors"
        @click="applyFilters"
      >
        REFRESH
      </button>
    </div>
    <p
      v-if="normalizedTickets.length === 0"
      class="text-[13px] text-gray-500 mb-5"
    >
      There are no tickets at this time
    </p>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-5 flex-wrap">
      <span class="text-[13px] text-gray-700">Show results from</span>
      <select
        v-model="adminStore.ticketsFilter.range"
        class="border border-gray-300 rounded-md px-3 py-1.5 text-[13px] text-gray-800 bg-white focus:outline-none"
      >
        <option>Today</option>
        <option>Yesterday</option>
        <option>This Week</option>
        <option>This Month</option>
      </select>

      <span class="text-[13px] text-gray-700 ml-4">Filter between dates</span>
      <span class="text-[13px] text-gray-700">From</span>
      <input
        type="text"
        v-model="fromDate"
        placeholder="DD/MM/YYYY"
        class="border border-gray-300 rounded-md px-3 py-1.5 text-[13px] text-gray-800 bg-white focus:outline-none w-32"
      />
      <input
        type="text"
        v-model="fromTime"
        placeholder="00:00"
        class="border border-gray-300 rounded-md px-3 py-1.5 text-[13px] text-gray-800 bg-white focus:outline-none w-20"
      />
      <span class="text-[13px] text-gray-700">To</span>
      <input
        type="text"
        v-model="toDate"
        placeholder="DD/MM/YYYY"
        class="border border-gray-300 rounded-md px-3 py-1.5 text-[13px] text-gray-800 bg-white focus:outline-none w-32"
      />
      <input
        type="text"
        v-model="toTime"
        placeholder="23:59"
        class="border border-gray-300 rounded-md px-3 py-1.5 text-[13px] text-gray-800 bg-white focus:outline-none w-20"
      />
      <button
        class="px-5 py-1.5 bg-black text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors"
        @click="applyFilters"
      >
        APPLY
      </button>
    </div>

    <!-- Tickets table -->
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Ticket ID
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Date / Time
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Issued by
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Event ID
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Game
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Type
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Stake
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Status
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Paid out by
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Promo &amp; JP Win.
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Total Won
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in normalizedTickets"
          :key="t.ticketId"
          class="hover:bg-gray-50"
        >
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-mono text-gray-600"
          >
            {{ t.ticketId }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ formatDateTime(t.createdAt) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.issuedBy }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.eventId }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.game }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.type }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ money(t.stake) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.status }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.paidOutBy }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ money(t.promoWinnings) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-semibold text-gray-800"
          >
            {{ money(t.totalWon) }}
          </td>
        </tr>
        <tr v-if="normalizedTickets.length === 0">
          <td
            colspan="11"
            class="border border-gray-200 px-3 py-10 text-center text-gray-400 text-[13px]"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useAdminStore } from "@/stores";

export default {
  name: "TicketsTab",
  setup() {
    const adminStore = useAdminStore();
    return { adminStore };
  },
  computed: {
    fromDate: {
      get() {
        const v = this.adminStore.ticketsFilter.from;
        return v
          ? this.$moment(v).format("DD/MM/YYYY")
          : this.$moment().format("DD/MM/YYYY");
      },
      set(v) {
        const d = this.$moment(v, "DD/MM/YYYY", true);
        if (d.isValid()) {
          this.adminStore.ticketsFilter.from =
            d.format("YYYY-MM-DD") + "T" + this.fromTime;
        }
      },
    },
    fromTime: {
      get() {
        const v = this.adminStore.ticketsFilter.from;
        return v ? this.$moment(v).format("HH:mm") : "00:00";
      },
      set(v) {
        this.adminStore.ticketsFilter.from = this.fromDate + "T" + v;
      },
    },
    toDate: {
      get() {
        const v = this.adminStore.ticketsFilter.to;
        return v
          ? this.$moment(v).format("DD/MM/YYYY")
          : this.$moment().format("DD/MM/YYYY");
      },
      set(v) {
        const d = this.$moment(v, "DD/MM/YYYY", true);
        if (d.isValid()) {
          this.adminStore.ticketsFilter.to =
            d.format("YYYY-MM-DD") + "T" + this.toTime;
        }
      },
    },
    toTime: {
      get() {
        const v = this.adminStore.ticketsFilter.to;
        return v ? this.$moment(v).format("HH:mm") : "23:59";
      },
      set(v) {
        this.adminStore.ticketsFilter.to = this.toDate + "T" + v;
      },
    },
    normalizedTickets() {
      return (this.adminStore.tickets || []).map((t) => {
        const bets = t.bets || [];
        const status = t.status || bets[0]?.status || "OPEN";
        const totalWon = bets.reduce(
          (s, b) => s + Number(b.netWinning || b.grossWinning || 0),
          0,
        );
        const stake =
          t.netStake ??
          bets.reduce((s, b) => s + (b.stake || b.netStake || 0), 0);

        return {
          ticketId: t.ticketNumber ?? t.id,
          createdAt: bets[0]?.createdAt ?? t.createdAt,
          issuedBy: t.cashierUsername ?? t.issuedBy ?? "—",
          eventId: bets[0]?.gameNumber ?? t.gameNumber ?? "—",
          game: bets[0]?.gameType ?? t.gameType ?? "—",
          type:
            bets
              .map((b) => b.betType || b.slipType)
              .filter(Boolean)
              .join(", ") || "—",
          stake,
          status,
          paidOutBy: t.paidOutBy ?? t.paidByUsername ?? "—",
          promoWinnings: t.promoWinnings ?? t.promoJackpotPaid ?? 0,
          totalWon: t.netWinning ?? totalWon,
        };
      });
    },
  },
  methods: {
    formatDateTime(dt) {
      return dt ? this.$moment(dt).format("DD/MM/YYYY HH:mm:ss") : "--";
    },
    money(value) {
      return this.$filters.currency(value || 0);
    },
    applyFilters() {
      this.adminStore.fetchTickets();
    },
  },
};
</script>
