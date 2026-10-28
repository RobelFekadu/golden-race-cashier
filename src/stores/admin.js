import { defineStore } from "pinia";
import moment from "moment";
import slipApi from "@/api/slip";
import gameApi from "@/api/game";
import { useGamesStore } from "./games";
import { useAuthStore } from "./auth";

const SUMMABLE = (reports) =>
  (reports || []).reduce((acc, r) => acc + Number(r || 0), 0);

const RANGE_KEYS = {
  Today: "today",
  Yesterday: "yesterday",
  "This Week": "thisWeek",
  "This Month": "thisMonth",
};

function resolveRange(filter) {
  if (filter && filter.from && filter.to) {
    return {
      from: moment(filter.from).toISOString(),
      to: moment(filter.to).toISOString(),
    };
  }
  if (filter && filter.from) {
    return {
      from: moment(filter.from).toISOString(),
      to: moment().toISOString(),
    };
  }
  if (filter && filter.to) {
    return {
      from: moment(filter.to).startOf("day").toISOString(),
      to: moment(filter.to).toISOString(),
    };
  }
  return timeRange(RANGE_KEYS[filter?.range] || "today");
}

function round(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function timeRange(label) {
  const now = moment();
  let from;
  let to = now;

  switch (label) {
    case "today":
      from = moment().startOf("day");
      break;
    case "thisWeek":
      from = moment().startOf("week");
      break;
    case "thisMonth":
      from = moment().startOf("month");
      break;
    case "yesterday":
      from = moment().subtract(1, "day").startOf("day");
      to = moment().startOf("day");
      break;
    case "lastWeek":
      from = moment().startOf("week").subtract(1, "week");
      to = moment().startOf("week");
      break;
    case "lastMonth":
      from = moment().startOf("month").subtract(1, "month");
      to = moment().startOf("month");
      break;
    default:
      from = moment().startOf("day");
  }

  return { from: from.toISOString(), to: to.toISOString() };
}

export const ADMIN_TABS = [
  { key: "openTickets", label: "Open Tickets" },
  { key: "tickets", label: "Tickets" },
  { key: "turnover", label: "Turnover" },
  { key: "quickReport", label: "Quick Report" },
  { key: "creditLog", label: "Credit Log" },
  { key: "results", label: "Results" },
  { key: "promotions", label: "Promotions" },
];

export const useAdminStore = defineStore("admin", {
  state: () => ({
    isOpen: false,
    activeTab: "openTickets",
    timezone: "Africa/Addis_Ababa",

    openTickets: [],
    loadingOpenTickets: false,

    // Tickets filter
    ticketsFilter: {
      range: "Today",
      from: "",
      to: "",
    },
    tickets: [],
    loadingTickets: false,

    // Turn-over
    turnover: {
      income: {
        totalIncome: 0,
        stakeTaxes: 0,
        netIncome: 0,
      },
      outcome: {
        paid: 0,
        promoJackpotPaid: 0,
      },
      cashBalance: {
        netBalance: 0,
      },
      settlements: [],
    },
    loadingTurnover: false,

    // Quick report
    quickReport: {
      today: {},
      thisWeek: {},
      thisMonth: {},
      yesterday: {},
      lastWeek: {},
      lastMonth: {},
    },
    loadingQuickReport: false,
    quickReportLoaded: false,

    // Credit log
    creditLogFilter: {
      from: "",
      to: "",
    },
    creditLog: [],
    loadingCreditLog: false,

    // Results
    resultsGameType: "",
    results: [],
    loadingResults: false,
  }),

  actions: {
    open(tab = "openTickets") {
      this.isOpen = true;
      this.activeTab = tab;
      this.loadActiveTab();
    },

    close() {
      this.isOpen = false;
    },

    setActiveTab(tab) {
      this.activeTab = tab;
      this.loadActiveTab();
    },

    loadActiveTab() {
      switch (this.activeTab) {
        case "openTickets":
          return this.fetchOpenTickets();
        case "tickets":
          return this.fetchTickets();
        case "turnover":
          return this.fetchTurnover();
        case "quickReport":
          return this.fetchQuickReport();
        case "creditLog":
          return this.fetchCreditLog();
        case "results":
          return this.fetchResults();
        default:
          return null;
      }
    },

    async fetchOpenTickets() {
      this.loadingOpenTickets = true;
      const res = await slipApi.recallBets();
      if (res.status === 200) {
        const authStore = useAuthStore();
        const slips = Array.isArray(res.data) ? res.data : [];
        this.openTickets = slips
          .filter(
            (slip) =>
              slip.status === "PLACED" ||
              (slip.bets || []).some((bet) => bet.status === "PLACED"),
          )
          .map((slip) => ({
            ...slip,
            cashierUsername: authStore.username,
          }));
      }
      this.loadingOpenTickets = false;
    },

    async fetchTickets() {
      this.loadingTickets = true;
      try {
        const res = await slipApi.recallBets();
        if (res.status === 200) {
          const authStore = useAuthStore();
          const { from, to } = resolveRange(this.ticketsFilter);
          const slips = Array.isArray(res.data) ? res.data : [];
          this.tickets = slips
            .filter((slip) => {
              const createdAt = moment(slip.createdAt);
              return (
                (!from || createdAt.isSameOrAfter(moment(from))) &&
                (!to || createdAt.isSameOrBefore(moment(to)))
              );
            })
            .map((slip) => ({
              ...slip,
              cashierUsername: authStore.username,
            }));
        }
      } catch (e) {
        this.tickets = [];
      }
      this.loadingTickets = false;
    },

    async fetchTurnover() {
      this.loadingTurnover = true;
      try {
        const range = resolveRange(this.ticketsFilter);
        const res = await slipApi.getShiftReport(range);

        if (res.status === 201 || res.status === 200) {
          const reports = Array.isArray(res.data)
            ? res.data
            : res.data
              ? [res.data]
              : [];
          const stakeAmount = SUMMABLE(reports.map((r) => r.stakeAmount));
          const revokedAmount = SUMMABLE(reports.map((r) => r.revokedAmount));
          const payoutAmount = SUMMABLE(reports.map((r) => r.payoutAmount));
          const unclaimedAmount = SUMMABLE(
            reports.map((r) => r.unclaimedAmount),
          );
          const net = SUMMABLE(reports.map((r) => r.net));

          this.turnover.income.totalIncome = stakeAmount;
          this.turnover.income.stakeTaxes = 0;
          this.turnover.income.netIncome = round(stakeAmount - revokedAmount);
          this.turnover.outcome.paid = payoutAmount;
          this.turnover.outcome.promoJackpotPaid = 0;
          this.turnover.outcome.unclaimedAmount = unclaimedAmount;
          this.turnover.cashBalance.netBalance = net;
          this.turnover.settlements = reports
            .filter((r) => r.cashierUsername)
            .map((r) => ({
              id: r.cashierId || r.cashierUsername,
              cashierUsername: r.cashierUsername,
              ticketNumber: r.stakeCount,
              amount: Number(r.net || 0),
            }));
        }
      } catch (e) {
        // keep last known values
      }
      this.loadingTurnover = false;
    },

    async fetchQuickReport() {
      this.loadingQuickReport = true;
      try {
        const labels = [
          "today",
          "thisWeek",
          "thisMonth",
          "yesterday",
          "lastWeek",
          "lastMonth",
        ];
        const results = await Promise.all(
          labels.map(async (label) => {
            const { from, to } = timeRange(label);
            const res = await slipApi.getShiftReport({ from, to });
            if (res.status === 201 || res.status === 200) {
              const reports = Array.isArray(res.data)
                ? res.data
                : res.data
                  ? [res.data]
                  : [];
              return {
                confirmedStake: SUMMABLE(reports.map((r) => r.stakeAmount)),
                cancelled: SUMMABLE(reports.map((r) => r.revokedAmount)),
                payments: SUMMABLE(reports.map((r) => r.payoutAmount)),
                promoMegaJackpot: 0,
                promoJackpot: 0,
                totalBalance: SUMMABLE(reports.map((r) => r.net)),
                openWin: SUMMABLE(reports.map((r) => r.unclaimedAmount)),
                tickets: SUMMABLE(reports.map((r) => r.stakeCount)),
              };
            }
            return {};
          }),
        );

        labels.forEach((label, i) => {
          this.quickReport[label] = results[i];
        });
        this.quickReportLoaded = true;
      } catch (e) {
        // keep last known values
      }
      this.loadingQuickReport = false;
    },

    async fetchCreditLog() {
      this.loadingCreditLog = true;
      try {
        const res = await slipApi.recallBets();
        if (res.status === 200) {
          const from = this.creditLogFilter.from || null;
          const to = this.creditLogFilter.to || null;
          const slips = Array.isArray(res.data) ? res.data : [];
          const entries = [];

          for (const slip of slips) {
            for (const bet of slip.bets || []) {
              const createdAt = bet.createdAt || slip.createdAt;
              const createdAtMoment = moment(createdAt);
              if (from && createdAtMoment.isBefore(moment(from))) continue;
              if (to && createdAtMoment.isAfter(moment(to))) continue;

              const grossStake = Number(bet.grossStake || bet.netStake || 0);
              const netWinning = Number(bet.netWinning || 0);
              entries.push({
                transactionId: bet.id,
                ticketId: slip.ticketNumber,
                createdAt,
                change: round(netWinning - grossStake),
                description: `${bet.gameType || ""} ${
                  bet.betType || ""
                } ${bet.status || ""}`.trim(),
              });
            }
          }

          entries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          let balance = 0;
          for (const entry of entries) {
            entry.previousCredit = round(balance);
            balance = round(balance + entry.change);
            entry.nextCredit = balance;
          }

          this.creditLog = entries.reverse();
        }
      } catch (e) {
        this.creditLog = [];
      }
      this.loadingCreditLog = false;
    },

    async fetchResults() {
      this.loadingResults = true;
      try {
        const gamesStore = useGamesStore();
        const gameType = gamesStore.activeApiType;
        this.resultsGameType =
          gamesStore.activeGameMeta?.label || gameType || "";
        const res = await gameApi.getResults(gameType);
        if (res.status === 200) {
          const data = res.data || {};
          const list = Array.isArray(data) ? data : data.recentResults || [];
          this.results = list.slice(0, 50);
        }
      } catch (e) {
        this.results = [];
      }
      this.loadingResults = false;
    },
  },
});
