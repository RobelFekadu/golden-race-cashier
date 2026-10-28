<template>
  <div class="px-[50px] py-[28px]">
    <div class="flex items-center justify-between mb-4">
      <span
        class="text-[13px] font-semibold uppercase tracking-wide text-gray-700"
      >
        {{ adminStore.resultsGameType || "Active game" }}
      </span>
      <button
        class="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-colors"
        @click="printLastResults"
      >
        PRINT LAST RESULTS
      </button>
    </div>

    <!-- Results table -->
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Event ID
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Date / Time
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Results
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Win
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Place (1-2)
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Show (1-3)
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Exacta
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Quinella
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Trifecta
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Even / Odd
          </th>
          <th
            class="border border-gray-200 px-3 py-2 text-left text-[13px] font-semibold text-gray-700"
          >
            Over / Under
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in adminStore.results"
          :key="r.id || r.gameNumber"
          class="hover:bg-gray-50"
        >
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-mono text-gray-600"
          >
            {{ r.game?.gameNumber ?? r.gameNumber }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-600"
          >
            {{ formatDateTime(r.game?.endTime || r.endTime) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] font-semibold text-gray-800"
          >
            {{ formatResults(r) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ winningNumbers(r)[0] ?? "--" }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ sliceNumbers(r, 2) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ sliceNumbers(r, 3) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ formatExacta(r) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ formatQuinella(r) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ sliceNumbers(r, 3) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ formatOddEven(r) }}
          </td>
          <td
            class="border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
          >
            {{ formatOverUnder(r) }}
          </td>
        </tr>
        <tr v-if="adminStore.results.length === 0">
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
import { useAdminStore, useAuthStore, useGamesStore } from "@/stores";
import printerApi from "@/api/printer";

export default {
  name: "ResultsTab",
  setup() {
    const adminStore = useAdminStore();
    const authStore = useAuthStore();
    const gamesStore = useGamesStore();
    return { adminStore, authStore, gamesStore };
  },
  methods: {
    formatDateTime(dt) {
      return dt ? this.$moment(dt).format("DD/MM/YYYY HH:mm") : "--";
    },
    winningNumbers(r) {
      const res = r.result;
      if (!res) return [];
      if (Array.isArray(res.winningNumbers)) return res.winningNumbers;
      if (Array.isArray(res.picks)) return res.picks;
      if (Array.isArray(res)) return res;
      return [];
    },
    formatResults(r) {
      const nums = this.winningNumbers(r);
      return nums.length ? nums.join(" - ") : "--";
    },
    sliceNumbers(r, count) {
      const nums = this.winningNumbers(r);
      return nums.length ? nums.slice(0, count).join(", ") : "--";
    },
    formatExacta(r) {
      const nums = this.winningNumbers(r);
      return nums.length >= 2 ? `${nums[0]}, ${nums[1]}` : "--";
    },
    formatQuinella(r) {
      const nums = this.winningNumbers(r);
      if (nums.length < 2) return "--";
      return [Number(nums[0]), Number(nums[1])]
        .sort((a, b) => a - b)
        .join(", ");
    },
    formatOddEven(r) {
      const nums = this.winningNumbers(r);
      if (!nums.length) return "--";
      return nums[0] % 2 === 1 ? "Odd" : "Even";
    },
    formatOverUnder(r) {
      const nums = this.winningNumbers(r);
      if (!nums.length) return "--";
      return nums[0] >= 4 ? "Over" : "Under";
    },
    async printLastResults() {
      if (this.adminStore.results.length === 0) {
        await this.adminStore.fetchResults();
      }
      const payload = {
        gameType: this.gamesStore.activeApiType,
        results: this.adminStore.results,
        shopName: this.authStore.shopName,
        username: this.authStore.username,
        date: this.$moment().format("YYYY/MM/DD HH:mm:ss"),
      };
      const res = await printerApi.printEventResult(payload);
      if (res.status === 200 || res.status === 201) {
        this.$notify({ title: "Results sent to printer", type: "success" });
      } else {
        this.$notify({ title: "Print failed", type: "error" });
      }
    },
  },
};
</script>
