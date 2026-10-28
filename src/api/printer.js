import { printHtml } from "@/utils/browserPrinter";
import {
  renderTicket,
  renderResults,
  renderReport,
  ticketStyles,
} from "@/utils/ticketTemplate";

function print(body, pageTitle) {
  return printHtml(body, {
    pageTitle,
    styles: ticketStyles,
  })
    .then((printed) => ({
      status: printed ? 200 : 500,
      data: { mode: "browser", printed },
    }))
    .catch((error) => ({
      status: 500,
      data: error?.message || "Unable to print ticket",
    }));
}

export default {
  async printTicket(ticket) {
    return print(renderTicket(ticket, "ticket"), "Bet Ticket");
  },

  async printRecall(ticket) {
    return print(renderTicket(ticket, "recall"), "Ticket Copy");
  },

  async printCancel(ticket) {
    return print(renderTicket(ticket, "cancel"), "Ticket Cancelled");
  },

  async printRedeem(ticket) {
    return print(renderTicket(ticket, "redeem"), "Ticket Paid Out");
  },

  async printReport(report) {
    return print(renderReport(report), "Report");
  },

  async printEventResult(results) {
    return print(renderResults(results), "Last Results");
  },

  async printNoWinBet(ticket) {
    return print(renderTicket(ticket, "nowin"), "No Win Ticket");
  },

  async ping() {
    return { status: 200, data: { mode: "browser" } };
  },
};
