import { GAME_TYPES } from "@/stores/games";

const DEFAULT_MAX_PAYOUT_PER_BET = 100000;

const CODE128_BARS = [
  11011001100, 11001101100, 11001100110, 10010011000, 10010001100, 10001001100,
  10011001000, 10011000100, 10001100100, 11001001000, 11001000100, 11000100100,
  10110011100, 10011011100, 10011001110, 10111001100, 10011101100, 10011100110,
  11001110010, 11001011100, 11001001110, 11011100100, 11001110100, 11101101110,
  11101001100, 11100101100, 11100100110, 11101100100, 11100110100, 11100110010,
  11011011000, 11011000110, 11000110110, 10100011000, 10001011000, 10001000110,
  10110001000, 10001101000, 10001100010, 11010001000, 11000101000, 11000100010,
  10110111000, 10110001110, 10001101110, 10111011000, 10111000110, 10001110110,
  11101110110, 11010001110, 11000101110, 11011101000, 11011100010, 11011101110,
  11101011000, 11101000110, 11100010110, 11101101000, 11101100010, 11100011010,
  11101111010, 11001000010, 11110001010, 10100110000, 10100001100, 10010110000,
  10010000110, 10000101100, 10000100110, 10110010000, 10110000100, 10011010000,
  10011000010, 10000110100, 10000110010, 11000010010, 11001010000, 11110111010,
  11000010100, 10001111010, 10100111100, 10010111100, 10010011110, 10111100100,
  10011110100, 10011110010, 11110100100, 11110010100, 11110010010, 11011011110,
  11011110110, 11110110110, 10101111000, 10100011110, 10001011110, 10111101000,
  10111100010, 11110101000, 11110100010, 10111011110, 10111101110, 11101011110,
  11110101110, 11010000100, 11010010000, 11010011100, 1100011101011,
];

const LOGO_SVG = `
  <svg class="ticket-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 70" aria-label="Golden Race">
    <path fill="#000" d="M0.3,9l43.3,0l1.6,0L39.7,19l-8.2,0l0,0l-15.8,0h0L44.1,70h-9.9L0.3,9z M75.9,1.5l3.9,7L46.5,68.5l-26-46.7h0l9.2,0l10.5,19l6.9,12.6L75.9,1.5z M73.4,0L47.2,47.4l-3.7-6.7l9.2-16.9L66,0H73.4z M50.3,0l-3.4,6.2l-46.5,0L3.7,0H50.3z" />
  </svg>
`;

export const ticketStyles = `
  html, body.pe-body {
    background: #fff !important;
    color: #000 !important;
    margin: 0;
    padding: 0;
  }
  .cashier-ticket .ticket80 {
    width: 72mm;
    max-width: 100%;
    margin: 0 auto;
    padding: 6px 0 4px;
    color: #000;
    font-family: DIN, sans-serif;
    font-weight: 700;
  }
  .cashier-ticket .ticket80 * {
    box-sizing: border-box;
  }
  .cashier-ticket .ticket-logo {
    display: block;
    width: 94px;
    height: 36px;
    margin: 2px auto 4px;
  }
  .cashier-ticket .ticket-box {
    border: 2px solid #000;
  }
  .cashier-ticket .ticket-header {
    padding: 1px 0;
  }
  .cashier-ticket .ticket-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    padding: 1px 6px;
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
  }
  .cashier-ticket .ticket-row > span:last-child {
    text-align: right;
  }
  .cashier-ticket .ticket-events {
    padding: 1px 0 2px;
  }
  .cashier-ticket .game-line {
    padding: 1px 6px 0;
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cashier-ticket .bet-line {
    height: 16px;
    margin: 0;
    padding: 0 6px 0 14px;
    font-family: DIN, sans-serif;
    font-size: 12px;
    line-height: 16px;
  }
  .cashier-ticket .bet-line:before {
    left: 14px;
    width: calc(100% - 20px);
  }
  .cashier-ticket .afterDotted {
    z-index: 4;
    background: #fff !important;
  }
  .cashier-ticket .afterDottedValue {
    position: relative;
    z-index: 5;
    background: #fff !important;
  }
  .cashier-ticket .ticket-totals {
    padding: 1px 0;
  }
  .cashier-ticket .barcode-wrap {
    margin-top: 3px;
    text-align: center;
  }
  .cashier-ticket .barcode {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
  }
  .cashier-ticket .empty {
    padding: 4px;
    font-size: 12px;
    text-align: center;
  }
`;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function firstPositive(...values) {
  const found = values.find(
    (value) => value !== undefined && value !== null && Number(value) > 0,
  );
  return found === undefined ? 0 : found;
}

function formatMoney(value) {
  const amount = Math.trunc(toNumber(value));
  return `Br ${amount.toLocaleString("en-US")}`;
}

function formatOdd(value) {
  const odd = Number(value);
  if (!Number.isFinite(odd) || odd <= 0) return "";
  return odd.toFixed(2).replace(".", ",");
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatPrintedAt(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatEventTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getStoredHardwareId() {
  try {
    return localStorage.getItem("hardwareId") || "";
  } catch {
    return "";
  }
}

function unwrapTicket(ticket) {
  if (!ticket) return {};
  if (typeof ticket === "string") {
    try {
      return unwrapTicket(JSON.parse(ticket));
    } catch {
      return {};
    }
  }
  if (
    ticket.ticket &&
    typeof ticket.ticket === "object" &&
    !Array.isArray(ticket.ticket.bets)
  ) {
    return ticket.ticket;
  }
  return ticket;
}

function gameMeta(value) {
  if (!value) return null;
  return (
    Object.values(GAME_TYPES).find(
      (game) => game.key === value || game.type === value,
    ) || null
  );
}

function gameLabel(value) {
  const meta = gameMeta(value);
  if (meta) return meta.label;
  return String(value || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const GAME_ICON_FILES = {
  car: "kart",
  motorbike: "motorbike",
  horse: "horse",
  greyhound: "dog",
  keno: "keno",
};

function gameIconFile(value) {
  const meta = gameMeta(value);
  return GAME_ICON_FILES[meta?.icon] || "kart";
}

function marketLabel(value) {
  const raw = String(value || "").toUpperCase();
  if (raw.includes("TRIFECTA")) return "Trifecta";
  if (raw.includes("EXACTA")) return "Exacta";
  if (raw.includes("QUINELLA")) return "Quinella";
  if (raw.includes("PLACE")) return "Place";
  if (raw.includes("SHOW")) return "Show";
  return "Win";
}

function picksText(picks) {
  if (!Array.isArray(picks)) return picks ?? "";
  return picks
    .map((pick) =>
      pick && typeof pick === "object" ? pick.participantNumber : pick,
    )
    .filter((pick) => pick !== null && pick !== undefined)
    .join(", ");
}

function betStake(bet) {
  return bet.netStake ?? bet.grossStake ?? bet.stake ?? 0;
}

function betOdd(bet) {
  return bet.winningOdd ?? bet.oddValue ?? bet.pay ?? bet.odds ?? 0;
}

function betPayout(bet) {
  return toNumber(betOdd(bet)) * toNumber(betStake(bet));
}

function sumStake(bets) {
  return bets.reduce((total, bet) => total + toNumber(betStake(bet)), 0);
}

function sumPayout(bets) {
  return bets.reduce((total, bet) => total + betPayout(bet), 0);
}

function groupBets(ticket) {
  const bets = Array.isArray(ticket.bets) ? ticket.bets : [];
  const groups = [];
  const byKey = new Map();

  for (const bet of bets) {
    const gameType = bet.gameType ?? ticket.gameType ?? "";
    const gameNumber = bet.gameNumber ?? ticket.gameNumber ?? "";
    const endTime =
      bet.gameEndTime ??
      bet.endTime ??
      bet.game?.endTime ??
      ticket.gameEndTime ??
      ticket.endTime ??
      ticket.game?.endTime ??
      "";
    const key = `${gameType}|${gameNumber}|${endTime}`;

    if (!byKey.has(key)) {
      const group = { gameType, gameNumber, endTime, bets: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    byKey.get(key).bets.push(bet);
  }

  if (groups.length === 0) {
    groups.push({
      gameType: ticket.gameType || "",
      gameNumber: ticket.gameNumber || "",
      endTime:
        ticket.gameEndTime || ticket.endTime || ticket.game?.endTime || "",
      bets: [],
    });
  }

  return groups;
}

function dottedLine(label, value, className) {
  return `<p class="dotted ${className}"><span class="preDotted"><span class="preDotted1">${escapeHtml(label)}</span></span><span class="afterDotted"><span class="afterDottedValue">${escapeHtml(value)}</span></span></p>`;
}

function code128Svg(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";

  const numeric = /^\d+$/.test(text);
  let codes;

  if (numeric && text.length % 2 === 0) {
    codes = [105];
    for (let index = 0; index < text.length; index += 2) {
      codes.push(Number(text.slice(index, index + 2)));
    }
  } else {
    codes = [104];
    for (const char of text) {
      const code = char.charCodeAt(0) - 32;
      if (code >= 0 && code <= 95) codes.push(code);
    }
  }

  if (codes.length <= 1) return "";

  let checksum = codes[0];
  for (let index = 1; index < codes.length; index += 1) {
    checksum += codes[index] * index;
  }
  codes.push(checksum % 103, 106);

  const bits = codes.map((code) => CODE128_BARS[code]).join("");
  const quiet = 10;
  const height = 54;
  const rects = [];
  let x = quiet;
  let run = 0;
  let current = bits[0];

  for (const bit of bits) {
    if (bit === current) {
      run += 1;
      continue;
    }
    if (current === "1") {
      rects.push(
        `<rect x="${x}" y="0" width="${run}" height="${height}" fill="#000" />`,
      );
    }
    x += run;
    current = bit;
    run = 1;
  }

  if (current === "1") {
    rects.push(
      `<rect x="${x}" y="0" width="${run}" height="${height}" fill="#000" />`,
    );
  }
  x += run;

  const width = x + quiet;
  return `<svg class="barcode" xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" shape-rendering="crispEdges" role="img" aria-label="${escapeHtml(text)}">${rects.join("")}</svg>`;
}

export function renderTicket(ticketData, kind = "ticket") {
  const ticket = unwrapTicket(ticketData);
  const bets = Array.isArray(ticket.bets) ? ticket.bets : [];
  const groups = groupBets(ticket);
  const ticketNumber =
    ticket.ticketNumber ?? ticket.ticketId ?? ticket.id ?? ticket.code ?? "";
  const entityId =
    ticket.entityId ??
    ticket.hardwareId ??
    ticket.entity?.id ??
    ticket.user?.entityId ??
    getStoredHardwareId();
  const printedAt = formatPrintedAt(ticket.printedAt || new Date());
  const status =
    kind === "redeem"
      ? "PAID"
      : kind === "cancel"
        ? "CANCELLED"
        : kind === "nowin"
          ? "NO WIN"
          : kind === "recall"
            ? "COPY"
            : "";
  const totalStake = firstPositive(
    ticket.grossStake,
    ticket.netStake,
    ticket.totalStake,
    sumStake(bets),
  );
  const computedMaxWin = sumPayout(bets);
  const maxPayoutPerTicket = firstPositive(
    ticket.maxPayoutPerTicket,
    ticket.maxPayout,
    ticket.maxWinning,
    computedMaxWin,
  );
  const maxPayoutPerBet = firstPositive(
    ticket.maxPayoutPerBet,
    ticket.maxPayoutPerBetAmount,
    DEFAULT_MAX_PAYOUT_PER_BET,
  );
  const potentialWinning = firstPositive(
    ticket.maxWinning,
    ticket.maximumWinningPayout,
    computedMaxWin,
  );
  const maximumWinningPayout = maxPayoutPerBet
    ? Math.min(potentialWinning, maxPayoutPerBet)
    : potentialWinning;

  const eventBlocks = groups
    .map((group) => {
      const line = [
        gameLabel(group.gameType),
        formatEventTime(group.endTime),
        group.gameNumber,
      ]
        .filter((part) => part !== "" && part !== null && part !== undefined)
        .join(' " ');

      const betLines = group.bets
        .map((bet) => {
          const market = marketLabel(bet.betType ?? bet.market);
          const picks = picksText(bet.picks);
          const label = picks ? `${market} ${picks}` : market;
          const odd = formatOdd(betOdd(bet));
          const stake = formatMoney(betStake(bet));
          const value = [odd, stake].filter(Boolean).join(" ");
          return dottedLine(label, value, "bet-line");
        })
        .join("");

      return `<div class="game-line">${escapeHtml(line)}</div>${betLines}`;
    })
    .join("");

  const barcode = code128Svg(ticketNumber);

  return `
    <div class="ticket80">
      ${LOGO_SVG}
      <div class="ticket-header ticket-box">
        <div class="ticket-row"><span>Ticket ID</span><span>${escapeHtml(ticketNumber)}</span></div>
        <div class="ticket-row"><span>Entity ID</span><span>${escapeHtml(entityId)}</span></div>
        <div class="ticket-row"><span>Printed at</span><span>${escapeHtml(printedAt)}</span></div>
        ${status ? `<div class="ticket-row"><span>Status</span><span>${status}</span></div>` : ""}
      </div>
      <div class="ticket-events">
        ${eventBlocks}
        <div class="ticket-row"><span>Total stake</span><span>${escapeHtml(formatMoney(totalStake))}</span></div>
      </div>
      <div class="ticket-totals ticket-box">
        <div class="ticket-row"><span>Max. payout per ticket</span><span>${escapeHtml(formatMoney(maxPayoutPerTicket))}</span></div>
        <div class="ticket-row"><span>Max. payout per bet</span><span>${escapeHtml(formatMoney(maxPayoutPerBet))}</span></div>
        <div class="ticket-row"><span>Maximum winning payout</span><span>${escapeHtml(formatMoney(maximumWinningPayout))}</span></div>
      </div>
      ${barcode ? `<div class="barcode-wrap">${barcode}</div>` : ""}
    </div>
  `;
}

function winningNumbers(result) {
  const value = result?.result;
  if (!value) return [];
  if (Array.isArray(value.winningNumbers)) return value.winningNumbers;
  if (Array.isArray(value.picks)) return value.picks;
  if (Array.isArray(value)) return value;
  return [];
}

export function renderResults(payload = {}) {
  const results = Array.isArray(payload.results) ? payload.results : [];
  const meta = gameMeta(payload.gameType);
  const label = (
    payload.gameLabel ||
    gameLabel(payload.gameType) ||
    "KART RACING"
  ).toUpperCase();
  const trackName = payload.trackName || meta?.subtitle || "";
  const icon = gameIconFile(payload.gameType);

  const rows = results
    .slice(0, 10)
    .map((result) => {
      const event =
        result.game?.gameNumber ?? result.gameNumber ?? result.id ?? "";
      const numbers = winningNumbers(result).slice(0, 3);
      return `
        <table class="tbSize padding">
          <tbody>
            <tr style="width: 50%">
              <td align="left" style="width: 20%" class="ff fm"># ${escapeHtml(event)}</td>
              <td align="right" style="width: 80%;" class="ff fs">${escapeHtml(numbers.join(", ") || "--")}</td>
            </tr>
          </tbody>
        </table>
      `;
    })
    .join("");

  return `
    <div id="printAnchor" style="margin-left: 10px">
      <div id="ticketTop">
        <table class="tbHidden tbSize padding">
          <tbody>
            <tr>
              <td><img class="cashier-ticket logo-brand" src="./assets/cashier/logos/vbox/vbox_brand.svg"></td>
              <td><div class="cashier-ticket vertical-line"></div></td>
              <td><div class="cashier-ticket icon-game-compact"><img width="32px" src="./assets/cashier/logos/default/${icon}.svg"></div></td>
              <td><div class="cashier-ticket font-game font-game-compact align-right">${escapeHtml(label)}</div></td>
            </tr>
          </tbody>
        </table>
        <table style="width: 100%; padding-top: 10px; padding-bottom: 10px" class="tbHidden ff fm">
          <tbody>
            <tr style="width: 100%" class="tbHidden ff fl">
              <td align="center">${escapeHtml(trackName)}</td>
            </tr>
            <tr style="width: 100%">
              <td align="center">LATEST RESULTS</td>
            </tr>
          </tbody>
        </table>
      </div>
      ${rows}
    </div>
  `;
}

export function renderReport(payload = {}) {
  const rows = Object.entries(payload)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      const text =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      return `<div class="ticket-row"><span>${escapeHtml(key)}</span><span>${escapeHtml(text)}</span></div>`;
    })
    .join("");

  return `
    <div class="ticket80">
      <div class="ticket-row"><span>${escapeHtml(payload.shopName || "GOLDEN RACE")}</span><span>REPORT</span></div>
      <div class="ticket-row"><span>${escapeHtml(formatPrintedAt(new Date()))}</span><span></span></div>
      <div class="ticket-box"><div class="ticket-events">${rows || '<div class="empty">No data</div>'}</div></div>
    </div>
  `;
}

export default {
  renderTicket,
  renderResults,
  renderReport,
  ticketStyles,
};
