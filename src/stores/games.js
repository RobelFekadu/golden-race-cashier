import { defineStore } from "pinia";
import moment from "moment";
import gameApi from "@/api/game";
import { findOpenGame, findNextGame, needsMoreGames } from "@/utils/gameCache";

export const GAME_TYPES = {
  KART_RACING: {
    key: "KART_CAPE_TOWN",
    type: "KART_CAPE_TOWN",
    label: "Kart Racing",
    subtitle: "Cape Town Circuit",
    icon: "car",
  },
  MOTOR_BIKE_RACING: {
    key: "M6_SOUTHERN",
    type: "M6_SOUTHERN",
    label: "Motorbike Racing",
    subtitle: "M6 Southern",
    icon: "motorbike",
  },
  HORSE_RACING: {
    key: "H6_GOLDEN_GATE",
    type: "H6_GOLDEN_GATE",
    label: "Horse Racing",
    subtitle: "H6 Golden Gate",
    icon: "horse",
  },
  GREYHOUND_LONDON: {
    key: "G6_LONDON",
    type: "G6_LONDON",
    label: "Greyhounds Racing",
    subtitle: "G6 London",
    icon: "greyhound",
  },
  GREYHOUND_SANTA_MONICA: {
    key: "G6_SANTA_MONICA",
    type: "G6_SANTA_MONICA",
    label: "Greyhounds Racing",
    subtitle: "G6 Santa Monica",
    icon: "greyhound",
  },
  KENO: {
    key: "KENO",
    type: "KENO",
    label: "Keno",
    subtitle: "Keno Deluxe",
    icon: "keno",
  },
  GREYHOUND_SANTA_MONICA_5: {
    key: "G6_SANTA_MONICA_5",
    type: "G6_SANTA_MONICA_5",
    label: "Greyhound Racing",
    subtitle: "G6 Santa Monica",
    icon: "greyhound",
  },
};

const GAME_TYPE_LIST = Object.values(GAME_TYPES);

const GAME_TYPES_BY_KEY = GAME_TYPE_LIST.reduce((byKey, game) => {
  byKey[game.key] = game;
  return byKey;
}, {});

export const RACING_GAME_TYPES = GAME_TYPE_LIST.filter(
  (game) => game.icon !== "keno",
).map((game) => game.type);

export const FOOTER_GAMES = [
  GAME_TYPES.KART_RACING,
  GAME_TYPES.MOTOR_BIKE_RACING,
  GAME_TYPES.HORSE_RACING,
  GAME_TYPES.GREYHOUND_LONDON,
  GAME_TYPES.GREYHOUND_SANTA_MONICA,
  GAME_TYPES.KENO,
];

const POLL_INTERVALS = {
  KENO: 30000,
  default: 600000,
};

export const useGamesStore = defineStore("games", {
  state: () => ({
    activeGameType: "KART_CAPE_TOWN",
    gamesByType: {},
    oddsByGameId: {},
    loading: false,
    error: null,
    remainingMinutes: "00",
    remainingSeconds: "00",
    totalCountdown: 0,
    nowTick: Date.now(),
    gameUpdated: false,
    _timers: {},
    _countdownTimer: null,
    _refetchedGame: null,
  }),
  getters: {
    activeGames(state) {
      return state.gamesByType[state.activeGameType] || [];
    },
    openGame(state) {
      return findOpenGame(
        state.gamesByType[state.activeGameType] || [],
        state.nowTick,
      );
    },
    nextOpenGame(state) {
      const games = state.gamesByType[state.activeGameType] || [];
      const open = findOpenGame(games, state.nowTick);
      if (!open) return null;
      return findNextGame(games, open);
    },
    openGameOdds(state) {
      const open = this.openGame;
      return open ? state.oddsByGameId[open.id] || null : null;
    },
    activeGameMeta(state) {
      return (
        GAME_TYPES[state.activeGameType] ||
        GAME_TYPES_BY_KEY[state.activeGameType] ||
        GAME_TYPE_LIST.find((game) => game.type === state.activeGameType) ||
        GAME_TYPES.KART_RACING
      );
    },
    activeApiType() {
      const meta = this.activeGameMeta;
      return meta?.type || meta?.key || this.activeGameType;
    },
  },
  actions: {
    setActiveGame(gameType) {
      this.activeGameType = gameType;
      this.syncCountdown();
    },

    async fetchGames(gameType = this.activeGameType) {
      if (!needsMoreGames(this.gamesByType[gameType], 4)) {
        this.syncCountdown();
        await this.ensureGameOdds(gameType);
        return { status: 200, data: this.gamesByType[gameType] };
      }

      const apiType =
        (GAME_TYPES[gameType] && GAME_TYPES[gameType].type) ||
        GAME_TYPES_BY_KEY[gameType]?.type ||
        gameType;
      this.loading = true;
      this.error = null;
      try {
        const res = await gameApi.getUpComingGames(apiType);
        if (res.status === 200) {
          this.gamesByType[gameType] = Array.isArray(res.data) ? res.data : [];
          this.gameUpdated = true;
          this.syncCountdown();
          await this.ensureGameOdds(gameType);
        }
        this.loading = false;
        return res;
      } catch (err) {
        this.loading = false;
        this.error = err.message || "Failed to load games";
        return { status: 500, data: null };
      }
    },

    async fetchGameOdds(gameType = this.activeGameType) {
      const apiType =
        (GAME_TYPES[gameType] && GAME_TYPES[gameType].type) ||
        GAME_TYPES_BY_KEY[gameType]?.type ||
        gameType;
      if (apiType === GAME_TYPES.KENO.type) return null;

      try {
        const res = await gameApi.getRacingDisplay(apiType);
        if (res.status === 200 && Array.isArray(res.data)) {
          for (const item of res.data) {
            if (item?.openGame?.id && item.odds) {
              this.oddsByGameId[item.openGame.id] = item.odds;
            }
          }
        }
        return res;
      } catch (err) {
        return { status: 500, data: null };
      }
    },

    async ensureGameOdds(gameType = this.activeGameType) {
      const games = this.gamesByType[gameType] || [];
      const open = findOpenGame(games, Date.now());
      if (!open || this.oddsByGameId[open.id]) return;
      await this.fetchGameOdds(gameType);
    },

    startPolling(gameType = this.activeGameType) {
      this.stopPolling(gameType);
      const interval = POLL_INTERVALS[gameType] || POLL_INTERVALS.default;
      this._timers[gameType] = setInterval(() => {
        if (this.activeGameType === gameType) {
          this.fetchGames(gameType);
        }
      }, interval);
    },

    stopPolling(gameType = this.activeGameType) {
      if (this._timers[gameType]) {
        clearInterval(this._timers[gameType]);
        delete this._timers[gameType];
      }
    },

    stopAllPolling() {
      Object.keys(this._timers).forEach((k) => this.stopPolling(k));
    },

    startCountdown() {
      this.stopCountdown();
      this.updateCountdown();
      this._countdownTimer = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },

    stopCountdown() {
      if (this._countdownTimer) {
        clearInterval(this._countdownTimer);
        this._countdownTimer = null;
      }
    },

    updateCountdown() {
      this.nowTick = Date.now();
      const open = this.openGame;
      if (!open) {
        this.totalCountdown = Number.POSITIVE_INFINITY;
        this.remainingMinutes = "00";
        this.remainingSeconds = "00";
        return;
      }

      const seconds = moment
        .duration(moment(open.endTime).diff(moment()))
        .asSeconds();
      this.totalCountdown = seconds;

      if (seconds > 0) {
        const duration = moment.duration(seconds, "seconds");
        this.remainingMinutes = String(duration.minutes()).padStart(2, "0");
        this.remainingSeconds = String(duration.seconds()).padStart(2, "0");
      } else {
        this.remainingMinutes = "00";
        this.remainingSeconds = "00";
      }

      if (seconds <= 5 && this._refetchedGame !== open.id) {
        this._refetchedGame = open.id;
        this.fetchGames(this.activeGameType);
      }
    },

    syncCountdown() {
      const open = this.openGame;
      if (!open) return;
      this.updateCountdown();
    },

    getGameResults() {
      // Placeholder for result API call
      return null;
    },
  },
});
