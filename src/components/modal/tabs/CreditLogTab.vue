<template>
  <div class="px-[50px] py-[28px]">
    <h3 class="text-lg font-bold text-gray-900 mb-4">
      CREDIT LOG ({{ adminStore.creditLog.length }})
    </h3>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-4">
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

    <!-- Timezone subtext -->
    <p class="text-xs text-gray-500 mb-1">
      Last results: {{ lastResultsLine }}
    </p>
    <p class="text-xs text-gray-500 mb-4">
      (Timezone {{ adminStore.timezone }})
    </p>

    <!-- Credit log table -->
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Transaction ID
          </th>
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
            Previous Credit
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Next Credit
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Change
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in adminStore.creditLog"
          :key="c.transactionId"
          class="hover:bg-gray-50"
        >
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-mono text-gray-600"
          >
            {{ c.transactionId }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-mono text-gray-600"
          >
            {{ c.ticketId }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ formatDateTime(c.createdAt) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] tabular-nums text-gray-700"
          >
            {{ money(c.previousCredit) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] tabular-nums text-gray-700"
          >
            {{ money(c.nextCredit) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] tabular-nums font-semibold text-gray-800"
          >
            {{ money(c.change) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ c.description }}
          </td>
        </tr>
        <tr v-if="adminStore.creditLog.length === 0">
          <td
            colspan="7"
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
  name: "CreditLogTab",
  setup() {
    const adminStore = useAdminStore();
    return { adminStore };
  },
  computed: {
    fromDate: {
      get() {
        const v = this.adminStore.creditLogFilter.from;
        return v
          ? this.$moment(v).format("DD/MM/YYYY")
          : this.$moment().subtract(7, "days").format("DD/MM/YYYY");
      },
      set(v) {
        const d = this.$moment(v, "DD/MM/YYYY", true);
        if (d.isValid()) {
          this.adminStore.creditLogFilter.from =
            d.format("YYYY-MM-DD") + "T" + this.fromTime;
        }
      },
    },
    fromTime: {
      get() {
        const v = this.adminStore.creditLogFilter.from;
        return v ? this.$moment(v).format("HH:mm") : "00:00";
      },
      set(v) {
        this.adminStore.creditLogFilter.from = this.fromDate + "T" + v;
      },
    },
    toDate: {
      get() {
        const v = this.adminStore.creditLogFilter.to;
        return v
          ? this.$moment(v).format("DD/MM/YYYY")
          : this.$moment().format("DD/MM/YYYY");
      },
      set(v) {
        const d = this.$moment(v, "DD/MM/YYYY", true);
        if (d.isValid()) {
          this.adminStore.creditLogFilter.to =
            d.format("YYYY-MM-DD") + "T" + this.toTime;
        }
      },
    },
    toTime: {
      get() {
        const v = this.adminStore.creditLogFilter.to;
        return v ? this.$moment(v).format("HH:mm") : "23:59";
      },
      set(v) {
        this.adminStore.creditLogFilter.to = this.toDate + "T" + v;
      },
    },
    lastResultsLine() {
      const f = this.adminStore.creditLogFilter;
      const fmt = (v) => (v ? this.$moment(v).format("DD/MM/YYYY HH:mm") : "");
      return `${fmt(f.from)} - ${fmt(f.to)}`;
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
      this.adminStore.fetchCreditLog();
    },
  },
};
</script>
