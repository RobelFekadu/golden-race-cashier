<template>
  <div class="px-[50px] py-[28px]">
    <div class="flex items-center gap-3 mb-2">
      <h3 class="text-lg font-bold text-gray-900">
        OPEN TICKETS ({{ adminStore.openTickets.length }})
      </h3>
      <button
        class="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors"
        @click="refresh"
      >
        REFRESH
      </button>
    </div>

    <p
      v-if="adminStore.openTickets.length === 0"
      class="text-[13px] text-gray-500 mb-5"
    >
      There are no open tickets at this time
    </p>

    <!-- Tickets list -->
    <table
      v-if="adminStore.openTickets.length > 0"
      class="w-full border-collapse"
    >
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
            Game
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
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in adminStore.openTickets"
          :key="t.ticketNumber || t.id"
          class="hover:bg-gray-50"
        >
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-mono text-gray-600"
          >
            {{ t.ticketNumber || t.id }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ formatDate(ticketCreatedAt(t)) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.gameType || betsGame(t) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ money(t.netStake ?? ticketStake(t)) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ t.status || "OPEN" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useAdminStore } from "@/stores";

export default {
  name: "OpenTicketsTab",
  setup() {
    const adminStore = useAdminStore();
    return { adminStore };
  },
  methods: {
    formatDate(dt) {
      return dt ? this.$moment(dt).format("DD/MM/YYYY HH:mm:ss") : "--";
    },
    money(value) {
      return this.$filters.currency(value || 0);
    },
    betsGame(t) {
      return t.bets && t.bets[0] ? t.bets[0].gameType : "—";
    },
    ticketCreatedAt(t) {
      return t.bets?.[0]?.createdAt ?? t.createdAt;
    },
    ticketStake(t) {
      return t.bets
        ? t.bets.reduce((s, b) => s + (b.netStake || b.stake || 0), 0)
        : 0;
    },
    refresh() {
      this.adminStore.fetchOpenTickets();
    },
  },
};
</script>
