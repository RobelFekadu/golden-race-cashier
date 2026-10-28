<template>
  <div class="px-[50px] py-[28px]">
    <div class="grid grid-cols-3 gap-5">
      <div
        v-for="tf in timeframes"
        :key="tf.key"
        class="rounded-md overflow-hidden bg-white shadow-sm"
      >
        <!-- Card header -->
        <div
          class="flex items-center justify-between px-4 py-2.5 bg-gray-100 border border-gray-200"
        >
          <div class="flex items-center gap-2">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="text-[13px] font-bold text-gray-900">{{
              tf.label
            }}</span>
          </div>
          <span class="text-[11px] text-gray-500">{{
            dateLabels[tf.key]
          }}</span>
        </div>

        <!-- Card body -->
        <div class="p-4 space-y-1 border border-t-0 border-gray-200">
          <div class="flex justify-between text-[13px]">
            <span class="font-semibold text-gray-800">Confirmed stake</span>
            <span class="font-medium text-gray-900 tabular-nums">{{
              metric(tf.key).confirmedStake ?? 0
            }}</span>
          </div>
          <div class="flex justify-between text-[13px]">
            <span class="text-gray-500">Cancelled</span>
            <span class="text-gray-700 tabular-nums">{{
              metric(tf.key).cancelled ?? 0
            }}</span>
          </div>
          <div class="flex justify-between text-[13px]">
            <span class="font-semibold text-gray-800">Payments</span>
            <span class="font-medium text-gray-900 tabular-nums">{{
              metric(tf.key).payments ?? 0
            }}</span>
          </div>
          <div class="flex justify-between text-[13px]">
            <span class="text-gray-500">Promo&amp;MegaJackpot Paid</span>
            <span class="text-gray-700 tabular-nums">{{
              metric(tf.key).promoMegaJackpot ?? 0
            }}</span>
          </div>
          <div class="flex justify-between text-[13px]">
            <span class="text-gray-500">Promo &amp; Jackpot Paid</span>
            <span class="text-gray-700 tabular-nums">{{
              metric(tf.key).promoJackpot ?? 0
            }}</span>
          </div>
          <div
            class="flex justify-between text-[13px] border-t border-gray-200 pt-1.5 mt-1.5"
          >
            <span class="font-bold text-gray-900">Total Balance</span>
            <span class="font-bold text-gray-900 tabular-nums">{{
              metric(tf.key).totalBalance ?? 0
            }}</span>
          </div>
          <div class="flex justify-between text-[13px]">
            <span class="text-gray-500">Open Win</span>
            <span class="text-gray-700 tabular-nums">{{
              metric(tf.key).openWin ?? 0
            }}</span>
          </div>
          <div class="flex justify-between text-[13px]">
            <span class="text-gray-500">Tickets</span>
            <span class="text-gray-700 tabular-nums">{{
              metric(tf.key).tickets ?? 0
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from "@/stores";
import moment from "moment";

export default {
  name: "QuickReportTab",
  setup() {
    const adminStore = useAdminStore();
    return { adminStore };
  },
  data() {
    return {
      timeframes: [
        { key: "today", label: "TODAY" },
        { key: "thisWeek", label: "THIS WEEK" },
        { key: "thisMonth", label: "THIS MONTH" },
        { key: "yesterday", label: "YESTERDAY" },
        { key: "lastWeek", label: "LAST WEEK" },
        { key: "lastMonth", label: "LAST MONTH" },
      ],
    };
  },
  computed: {
    dateLabels() {
      const now = moment();
      const tz = "(UTC+3)";
      return {
        today: `${now.format("YYYY-MM-DD")} ${tz}`,
        thisWeek: `From ${now.startOf("week").format("YYYY-MM-DD")} To ${now.format("YYYY-MM-DD")} ${tz}`,
        thisMonth: `From ${now.startOf("month").format("YYYY-MM-DD")} To ${now.endOf("month").format("YYYY-MM-DD")} ${tz}`,
        yesterday: `${now.subtract(1, "day").format("YYYY-MM-DD")} ${tz}`,
        lastWeek: `From ${now.startOf("week").subtract(1, "week").format("YYYY-MM-DD")} To ${now.startOf("week").subtract(1, "day").format("YYYY-MM-DD")} ${tz}`,
        lastMonth: `From ${now.startOf("month").subtract(1, "month").format("YYYY-MM-DD")} To ${now.startOf("month").subtract(1, "day").format("YYYY-MM-DD")} ${tz}`,
      };
    },
  },
  methods: {
    metric(key) {
      return this.adminStore.quickReport[key] || {};
    },
  },
};
</script>
