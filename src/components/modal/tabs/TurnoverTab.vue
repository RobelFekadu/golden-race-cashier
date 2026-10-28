<template>
  <div class="px-[50px] py-[28px]">
    <div class="flex gap-6">
      <!-- Left: Financial breakdown -->
      <div class="flex-1">
        <!-- Toolbar -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">TURNOVER</h3>
          <div class="flex items-center gap-2">
            <button
              class="w-9 h-9 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
              @click="refresh"
              title="Refresh"
            >
              <svg
                class="w-4 h-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              class="w-9 h-9 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
              title="Print"
            >
              <svg
                class="w-4 h-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-xs font-bold text-gray-700 transition-colors"
            >
              SETTLEMENTS
            </button>
          </div>
        </div>

        <p class="text-[13px] text-gray-500 mb-4">
          Cash Balance:
          <span class="font-semibold text-gray-800">{{
            money(turnover.cashBalance.netBalance)
          }}</span>
        </p>

        <!-- Income section -->
        <div class="mb-5">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[13px] font-semibold text-green-700">Income</span>
            <span class="text-[11px] text-gray-400">Total</span>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Total Income</span>
              <span class="font-semibold text-gray-800 tabular-nums">{{
                money(turnover.income.totalIncome)
              }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Stake Taxes</span>
              <span class="text-red-500 tabular-nums">{{
                money(turnover.income.stakeTaxes)
              }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Net Income (Stake)</span>
              <span class="tabular-nums text-gray-700">{{
                money(turnover.income.netIncome)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Outcome section -->
        <div class="mb-5">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[13px] font-semibold text-red-700">Outcome</span>
            <span class="text-[11px] text-gray-400">Total</span>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Paid</span>
              <span class="tabular-nums text-gray-700">{{
                money(turnover.outcome.paid)
              }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Promo &amp; Jackpot Paid</span>
              <span class="tabular-nums text-gray-700">{{
                money(turnover.outcome.promoJackpotPaid)
              }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Promo&amp;MegaJackpot Paid</span>
              <span class="tabular-nums text-gray-700">{{
                money(turnover.outcome.promoMegaJackpotPaid)
              }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Payout Taxes</span>
              <span class="text-red-500 tabular-nums">{{
                money(turnover.outcome.payoutTaxes)
              }}</span>
            </div>
            <div
              class="flex justify-between text-[13px] font-semibold border-t border-gray-200 pt-1.5 mt-1.5"
            >
              <span class="text-gray-800">Total Outcome</span>
              <span class="tabular-nums">{{ money(totalOutcome) }}</span>
            </div>
          </div>
        </div>

        <!-- Cash Balance section -->
        <div class="mb-5">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[13px] font-semibold text-blue-700"
              >Cash Balance</span
            >
            <span class="text-[11px] text-gray-400">Total</span>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Stake Taxes</span>
              <span class="text-red-500 tabular-nums">{{
                money(turnover.income.stakeTaxes)
              }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-gray-600">Payout Taxes</span>
              <span class="text-red-500 tabular-nums">{{
                money(turnover.outcome.payoutTaxes)
              }}</span>
            </div>
            <div
              class="flex justify-between text-[13px] font-semibold border-t border-gray-200 pt-1.5 mt-1.5"
            >
              <span class="text-gray-800">Net Balance</span>
              <span class="tabular-nums">{{
                money(turnover.cashBalance.netBalance)
              }}</span>
            </div>
          </div>
        </div>

        <p class="text-[13px] text-gray-500">Information</p>
      </div>

      <!-- Right: Latest settlements -->
      <div class="w-72 shrink-0">
        <div class="border border-gray-200 rounded-md h-full bg-white">
          <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h4 class="text-[13px] font-bold text-gray-900">
              LATEST SETTLEMENTS
            </h4>
          </div>
          <div class="p-4">
            <div
              v-if="turnover.settlements.length === 0"
              class="flex items-center justify-center py-12 text-gray-500 text-[13px]"
            >
              No data
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="s in turnover.settlements"
                :key="s.id"
                class="flex justify-between text-[13px] py-2 border-b border-gray-100"
              >
                <span class="text-gray-600">{{ s.cashierUsername }}</span>
                <span class="tabular-nums font-semibold">{{
                  money(s.amount)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from "@/stores";

export default {
  name: "TurnoverTab",
  setup() {
    const adminStore = useAdminStore();
    return { adminStore };
  },
  computed: {
    turnover() {
      return this.adminStore.turnover;
    },
    totalOutcome() {
      return (
        this.turnover.outcome.paid +
        this.turnover.outcome.promoJackpotPaid +
        (this.turnover.outcome.promoMegaJackpotPaid || 0)
      );
    },
  },
  methods: {
    money(value) {
      return this.$filters.currency(value || 0);
    },
    refresh() {
      this.adminStore.fetchTurnover();
    },
  },
};
</script>
