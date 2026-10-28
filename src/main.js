import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

import Notifications from "@kyvg/vue3-notification";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import VueDraggableResizable from "vue-draggable-resizable";

import moment from "moment";

const app = createApp(App);

app.component("VueDatePicker", VueDatePicker);
app.component("vue-draggable-resizable", VueDraggableResizable);

const store = createPinia();
store.use(moment);

app.use(store);
app.use(router);
app.use(Notifications);

app.config.globalProperties.$moment = moment;

app.config.globalProperties.$filters = {
  currency(value) {
    return (
      "Br " +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    );
  },
  inputCurrency(value) {
    return value.toFixed(2);
  },
  specialBet(value) {
    switch (value) {
      case "81":
        return "Heads";
      case "82":
        return "Tails";
      case "83":
        return "Evens";
      default:
        return value;
    }
  },
  formatLetter(value) {
    let firstLetter = value.charAt(0).toUpperCase();
    let word = value.substring(1, value.length).toLowerCase();
    return firstLetter + word;
  },
};

app.mount("#app");
