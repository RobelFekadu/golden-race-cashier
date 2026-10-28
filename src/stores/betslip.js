import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import slipApi from "@/api/slip";
import printerApi from "@/api/printer";
import moment from "moment";
import {
  generateCombos,
  generateQuinella,
  marketLabel,
} from "@/utils/betCombos";
import { GAME_TYPES, RACING_GAME_TYPES, useGamesStore } from "@/stores/games";

export const STAKE_PRESETS = [10, 30, 50, 100, 200];

export const useBetslipStore = defineStore("betslip", {
  state: () => ({
    selectedNumbers: [],
    pickNumbers: [],
    betslip: {
      bets: [],
    },
    pendingSelections: [],
    forecastSelections: { 1: [], 2: [], 3: [] },
    quinellaSelections: [],
    forecastMeta: null,
    stake: 10,
    totalStake: 0,
    totalToWin: 0,
    maxWinning: 0,
    minStake: 10,
    activeTab: "selection",
    fastbetHelpOpen: false,
    payTable: [3.8, 15, 35, 100, 300, 1800, 2150, 3000, 4200, 5000],
    selectedPaytable: [],

    cancelId: "",
    redeemId: "",
    ticket: null,
    loadingCancel: false,
    loadingRedeem: false,
    loadingPlaceBet: false,
    loadingOdd: false,
    expiredBets: [],
    recallBets: [],
  }),

  getters: {
    betCount(state) {
      return state.betslip.bets.length;
    },
    hasBets(state) {
      return state.betslip.bets.length > 0;
    },
    forecastRowCount(state) {
      return [1, 2, 3].filter((row) => state.forecastSelections[row].length > 0)
        .length;
    },
    hasForecastSelections() {
      return this.forecastRowCount > 0;
    },
    hasQuinellaSelections() {
      return this.quinellaSelections.length > 0;
    },
    formattedTotalStake(state) {
      return state.totalStake.toFixed(2);
    },
    formattedMaxWinning(state) {
      return state.maxWinning.toFixed(2);
    },
  },

  actions: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },

    toggleFastbetHelp() {
      this.fastbetHelpOpen = !this.fastbetHelpOpen;
    },

    setStake(stake) {
      let betslipLen = this.betslip.bets.length;

      if (betslipLen === 0) {
        this.stake = stake;
        return;
      }

      if (this.totalStake / betslipLen < 20) {
        for (let key in this.betslip.bets) {
          this.betslip.bets[key].stake = stake;
        }
        this.updateTotalStake();
        this.stake = stake;
      } else {
        for (let key in this.betslip.bets) {
          this.betslip.bets[key].stake += stake;
        }
        this.updateTotalStake();
      }
    },

    addStake(amount) {
      this.stake += amount;
      this.setStake(this.stake);
    },

    clearStake() {
      this.stake = this.minStake;
      for (let key in this.betslip.bets) {
        this.betslip.bets[key].stake = this.minStake;
      }
      this.updateTotalStake();
    },

    setBetStake(stake, id) {
      let bet = this.betslip.bets.find((b) => b.id === id);

      if (bet.stake + stake < this.minStake) {
        bet.stake = this.minStake;
      } else {
        bet.stake += stake;
      }

      this.updateTotalStake();
    },

    setBetStakeFromInput(stake, id) {
      let bet = this.betslip.bets.find((b) => b.id === id);
      if (!bet) return;

      if (stake >= this.minStake) {
        bet.stake = stake;
      }
      this.updateTotalStake();
    },

    formatLetter(value) {
      let firstLetter = value.charAt(0).toUpperCase();
      let word = value.substring(1, value.length).toLowerCase();
      return firstLetter + word;
    },

    async placeBet() {
      if (this.betslip.bets.length === 0) return;

      const payloadBets = [];

      for (let key in this.betslip.bets) {
        const bet = JSON.parse(JSON.stringify(this.betslip.bets[key]));

        if (bet.gameType === "keno") {
          delete bet.id;
          delete bet.pay;
          delete bet.gameType;
          delete bet.market;
          delete bet.slipType;
          delete bet.endTime;
          delete bet.gameNumber;
          bet.gameType = "KENO";
          payloadBets.push(bet);
        } else if (RACING_GAME_TYPES.includes(bet.gameType)) {
          let betType = bet.slipType;
          bet.betType = betType;
          delete bet.slipType;

          let rank;
          if (
            Array.isArray(bet.picks) &&
            bet.picks.length > 0 &&
            typeof bet.picks[0] === "number"
          ) {
            rank = bet.picks;
          } else if (betType === "PLACE") {
            rank = [bet.picks[0].participantNumber];
          } else {
            rank = [];
            for (let i = 0; i < bet.picks.length; i++) {
              let pick = bet.picks.find((p) => p.rank === i + 1);
              rank[i] = pick.participantNumber;
            }
          }
          bet.picks = rank;

          delete bet.id;
          delete bet.entryId;
          delete bet.pay;
          delete bet.picksDisplay;
          delete bet.market;
          delete bet.gameNumber;
          delete bet.endTime;
          payloadBets.push(bet);
        } else {
          payloadBets.push(bet);
        }
      }

      this.loadingPlaceBet = true;

      let res = await slipApi.create({ bets: payloadBets });
      this.loadingPlaceBet = false;

      if (res.status === 201 && res.data) {
        await this.printTicket(res.data);
      }

      return res;
    },

    switchGameType(gameType) {
      const meta = Object.values(GAME_TYPES).find(
        (game) => game.key === gameType || game.type === gameType,
      );
      return meta?.label || gameType;
    },

    oddsForCombo(betType, picks, meta = {}) {
      const gamesStore = useGamesStore();
      const entries = meta.entries || gamesStore.openGame?.entries || [];

      if (betType === "WIN" || betType === "PLACE" || betType === "SHOW") {
        const entry = entries.find(
          (item) => item.participantNumber === picks[0],
        );
        if (betType === "WIN") return entry?.winOdd ?? 0;
        if (betType === "PLACE") return entry?.placeOdd ?? 0;
        return entry?.showOdd ?? 0;
      }

      const odds = meta.odds || gamesStore.openGameOdds;
      if (!odds) return 0;

      if (betType === "QUINELLA") {
        const [first, second] = picks;
        return (
          odds.quinellaOdds?.find(
            (item) =>
              (item.participantNumber1 === first &&
                item.participantNumber2 === second) ||
              (item.participantNumber1 === second &&
                item.participantNumber2 === first),
          )?.odd ?? 0
        );
      }

      if (betType === "EXACTA") {
        return (
          odds.exactaOdds?.find(
            (item) =>
              item.firstPlaceParticipantNumber === picks[0] &&
              item.secondPlaceParticipantNumber === picks[1],
          )?.odd ?? 0
        );
      }

      if (betType === "TRIFECTA") {
        return (
          odds.trifectaOdds?.find(
            (item) =>
              item.firstPlaceParticipantNumber === picks[0] &&
              item.secondPlaceParticipantNumber === picks[1] &&
              item.thirdPlaceParticipantNumber === picks[2],
          )?.odd ?? 0
        );
      }

      return 0;
    },

    async printTicket(ticket) {
      try {
        const res = await printerApi.printTicket(ticket);
        return res.status === 200 || res.status === 201;
      } catch (e) {
        return false;
      }
    },

    toggleButton(number) {
      if (
        !this.selectedNumbers.includes(number) &&
        this.selectedNumbers.length < 10
      ) {
        this.selectedNumbers.push(number);
      } else {
        this.selectedNumbers = this.selectedNumbers.filter((n) => n !== number);
      }
    },

    clearSelected() {
      this.selectedNumbers = [];
      this.selectedPaytable = [];
    },

    setSelectedNumbers(numbers) {
      this.selectedNumbers = [...numbers].sort((a, b) => a - b);
      this.selectedPaytable =
        this.selectedNumbers.length > 0
          ? [this.selectedNumbers.length - 1]
          : [];
    },

    addKeno(
      gameNumber,
      endTime,
      gameId,
      isSpecial = false,
      pay = 0,
      market = "Win",
    ) {
      if (this.selectedNumbers.length === 0) return;

      this.selectedNumbers.sort((a, b) => a - b);
      if (!isSpecial) {
        pay = this.payTable[this.selectedNumbers.length - 1];
      }

      const bet = {
        id: uuidv4(),
        gameType: "keno",
        market: market,
        picks: this.selectedNumbers.map((a) => a),
        stake: this.minStake,
        gameId: gameId,
        betType: "WIN",
        gameNumber: gameNumber,
        pay: pay,
        slipType: "",
        endTime: endTime,
      };

      this.betslip.bets.push(bet);
      this.updateTotalStake();
    },

    addRacingGame(
      id,
      gameType,
      gameNumber,
      endTime,
      gameId,
      pay,
      market,
      slipType,
      picks,
      picksDisplay,
    ) {
      let entryId = id && id.length > 0 ? id : uuidv4();

      const bet = {
        id: uuidv4(),
        entryId: entryId,
        gameType: gameType,
        market: market,
        picks: picks,
        picksDisplay: picksDisplay,
        stake: this.stake || this.minStake,
        gameNumber: gameNumber,
        gameId: gameId,
        pay: pay,
        slipType: slipType,
        endTime: endTime,
      };

      this.betslip.bets.push(bet);
      this.updateTotalStake();
    },

    togglePendingSelection(selection) {
      const index = this.pendingSelections.findIndex(
        (s) =>
          s.entryId === selection.entryId && s.slipType === selection.slipType,
      );
      if (index >= 0) {
        this.pendingSelections.splice(index, 1);
        return;
      }
      this.pendingSelections.push({
        ...selection,
        stake: this.stake || this.minStake,
      });
    },

    isPendingSelection(entryId, slipType) {
      return this.pendingSelections.some(
        (s) => s.entryId === entryId && s.slipType === slipType,
      );
    },

    removePendingSelection(entryId, slipType) {
      this.pendingSelections = this.pendingSelections.filter(
        (s) => !(s.entryId === entryId && s.slipType === slipType),
      );
    },

    clearPendingSelections() {
      this.pendingSelections = [];
    },

    commitPendingSelections() {
      for (const selection of this.pendingSelections) {
        const exists = this.betslip.bets.some(
          (b) =>
            b.entryId === selection.entryId &&
            b.slipType === selection.slipType,
        );
        if (!exists) {
          this.betslip.bets.push({ ...selection, id: uuidv4() });
        }
      }
      this.pendingSelections = [];
      this.updateTotalStake();
    },

    toggleForecastPick(number, row, meta) {
      if (meta) this.forecastMeta = meta;
      const selections = this.forecastSelections;
      const list = selections[row];
      const index = list.indexOf(number);
      if (index >= 0) {
        list.splice(index, 1);
      } else {
        list.push(number);
      }
      if (list.length === 0) {
        for (let r = row + 1; r <= 3; r++) selections[r] = [];
      }
    },

    setForecastRow(row, numbers, meta) {
      if (meta) this.forecastMeta = meta;
      this.forecastSelections[row] = numbers.slice();
      if (numbers.length === 0) {
        for (let r = row + 1; r <= 3; r++) this.forecastSelections[r] = [];
      }
    },

    toggleForecastColumn(number, meta) {
      if (meta) this.forecastMeta = meta;
      const allSelected = [1, 2, 3].every((row) =>
        this.forecastSelections[row].includes(number),
      );

      if (allSelected) {
        for (const row of [1, 2, 3]) {
          this.forecastSelections[row] = this.forecastSelections[row].filter(
            (n) => n !== number,
          );
        }
        if (this.forecastSelections[1].length === 0) {
          this.forecastSelections[2] = [];
          this.forecastSelections[3] = [];
        } else if (this.forecastSelections[2].length === 0) {
          this.forecastSelections[3] = [];
        }
        return;
      }

      for (const row of [1, 2, 3]) {
        if (!this.forecastSelections[row].includes(number)) {
          this.forecastSelections[row].push(number);
        }
      }
    },

    toggleQuinellaPick(number, meta) {
      if (meta) this.forecastMeta = meta;
      const list = this.quinellaSelections;
      const index = list.indexOf(number);
      if (index >= 0) {
        list.splice(index, 1);
      } else {
        list.push(number);
      }
    },

    isQuinellaSelected(number) {
      return this.quinellaSelections.includes(number);
    },

    clearQuinella() {
      this.quinellaSelections = [];
    },

    commitQuinella() {
      if (this.quinellaSelections.length === 0) return false;
      const meta = this.forecastMeta || {};
      const participantCount = Array.isArray(meta.field)
        ? meta.field.length
        : 0;
      const combos = generateQuinella(
        this.quinellaSelections,
        participantCount,
      );
      if (combos.length === 0) return false;
      for (const combo of combos) {
        this.betslip.bets.push({
          id: uuidv4(),
          gameType: meta.apiType,
          betType: combo.betType,
          market: marketLabel(combo.betType),
          picks: combo.picks,
          picksDisplay: combo.picks.join(","),
          pay: this.oddsForCombo(combo.betType, combo.picks, meta),
          stake: this.stake || this.minStake,
          gameId: meta.gameId,
          gameNumber: meta.gameNumber,
          endTime: meta.endTime,
          slipType: combo.betType,
        });
      }
      this.clearQuinella();
      this.updateTotalStake();
      return true;
    },

    isForecastSelected(number, row) {
      return this.forecastSelections[row].includes(number);
    },

    clearForecast() {
      this.forecastSelections = { 1: [], 2: [], 3: [] };
      this.quinellaSelections = [];
      this.forecastMeta = null;
    },

    commitForecast() {
      const rows = [1, 2, 3].map((row) => this.forecastSelections[row].slice());
      if (rows.every((row) => row.length === 0)) return false;

      const meta = this.forecastMeta || {};
      const participantCount = Array.isArray(meta.field)
        ? meta.field.length
        : 0;
      const combos = generateCombos(rows, participantCount);
      if (combos.length === 0) return false;

      for (const combo of combos) {
        this.betslip.bets.push({
          id: uuidv4(),
          gameType: meta.apiType,
          betType: combo.betType,
          market: marketLabel(combo.betType),
          picks: combo.picks,
          picksDisplay: combo.picks.join(","),
          pay: this.oddsForCombo(combo.betType, combo.picks, meta),
          stake: this.stake || this.minStake,
          gameId: meta.gameId,
          gameNumber: meta.gameNumber,
          endTime: meta.endTime,
          slipType: combo.betType,
        });
      }

      this.clearForecast();
      this.updateTotalStake();
      return true;
    },

    setBetOddFromInput(odd, id) {
      const bet = this.betslip.bets.find((b) => b.id === id);
      if (!bet) return;
      const value = parseFloat(odd);
      if (!isNaN(value) && value > 0) {
        bet.pay = value;
        this.updateTotalToWin();
      }
    },

    removePick(id) {
      this.betslip.bets = this.betslip.bets.filter((b) => b.id !== id);
      this.updateTotalStake();
    },

    clearPicks() {
      this.betslip.bets = [];
      this.pendingSelections = [];
      this.clearForecast();
      this.updateTotalStake();
    },

    updateTotalStake() {
      this.totalStake = 0;
      for (let key in this.betslip.bets) {
        const bet = this.betslip.bets[key];
        const factor = Array.isArray(bet.combinations)
          ? bet.combinations.length
          : 1;
        this.totalStake += bet.stake * factor;
      }
      this.updateTotalToWin();
    },

    updateTotalToWin() {
      this.totalToWin = 0;
      this.maxWinning = 0;

      for (let key in this.betslip.bets) {
        let bet = this.betslip.bets[key];
        let win = 0;

        if (bet.gameType === "keno") {
          win = this.payTable[bet.picks.length - 1] * bet.stake;
        } else {
          win = bet.pay * bet.stake;
        }

        this.totalToWin += win;
        if (win > this.maxWinning) this.maxWinning = win;
      }
    },

    checkExpiredBets() {
      for (let i = 0; i < this.betslip.bets.length; i++) {
        let bet = this.betslip.bets[i];
        let duration = moment.duration(moment(bet.endTime).diff(moment()));

        if (duration.asSeconds() <= 0) {
          this.expiredBets.push(JSON.parse(JSON.stringify(bet)));
        }
      }

      for (let z = 0; z < this.expiredBets.length; z++) {
        let expiredBet = this.expiredBets[z];
        this.betslip.bets = this.betslip.bets.filter(
          (b) => b.id !== expiredBet.id,
        );
      }
    },

    clearExpiredBets() {
      this.expiredBets = [];
    },

    async fetchCancelSlip() {
      this.loadingCancel = true;
      this.ticket = null;
      if (this.cancelId.length > 0) {
        const res = await slipApi.fetchSlip(this.cancelId);
        if (res.status === 200 || res.status === 304) {
          this.cancelId = "";
          this.ticket = res.data;
        }
        this.loadingCancel = false;
        return res;
      }
      this.loadingCancel = false;
    },

    async cancelBet() {
      this.loadingCancel = true;
      const res = await slipApi.cancelBet(this.ticket.id);
      if (res.status === 201) {
        this.cancelId = "";
        this.ticket = null;
        this.loadingCancel = false;
        return true;
      }
      this.loadingCancel = false;
      return false;
    },

    async fetchRedeemSlip() {
      this.loadingRedeem = true;
      this.ticket = null;
      if (this.redeemId.length > 0) {
        const res = await slipApi.fetchSlip(this.redeemId);
        if (res.status === 200 || res.status === 304) {
          this.ticket = res.data;
        }
        this.loadingRedeem = false;
        return res;
      }
      this.loadingRedeem = false;
    },

    async redeemBet() {
      this.loadingRedeem = true;
      const res = await slipApi.redeemBet(this.ticket.id);
      if (res.status === 201) {
        this.redeemId = "";
        this.ticket = null;
        this.loadingRedeem = false;
        return true;
      }
      this.loadingRedeem = false;
      return false;
    },

    async fetchRecallBets() {
      const res = await slipApi.recallBets();
      if (res.status === 200) {
        this.recallBets = res.data;
      }
      return res;
    },
  },
});
