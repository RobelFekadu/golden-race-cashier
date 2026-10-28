<template>
  <div
    class="flex min-w-0 flex-col"
    :class="{ 'cursor-pointer': !disabled }"
    @click="onClick"
  >
    <div
      class="relative flex h-[max(34px,5.56vh)] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-[2px] py-[0.65vh]"
      :class="[
        disabled ? 'bg-[#E8EDF1]' : 'bg-[#EEF2F5]',
        selected && !pickStyle ? 'ring-2 ring-inset ring-[#005AB5]' : '',
      ]"
      :style="dorsalStyle"
    >
      <span
        class="block text-[max(16px,min(1.667vw,2.963vh))] leading-none"
        :class="hasTextBg ? 'rounded-full px-[0.4em]' : ''"
        :style="{
          fontWeight: 900,
          color: textColor,
          background: hasTextBg ? pickStyle.textBg : '',
        }"
      >
        {{ entry.participantNumber }}
      </span>
      <span
        class="mt-0 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[max(9px,min(0.729vw,1.296vh))] uppercase leading-none"
        :class="hasTextBg ? 'rounded-full px-[0.5em]' : 'w-full'"
        :style="{
          fontWeight: 700,
          color: textColor,
          background: hasTextBg ? pickStyle.textBg : '',
        }"
      >
        {{ displayName }}
      </span>
    </div>

    <div
      v-if="showValue"
      class="mt-[max(5px,0.926vh)] flex h-[max(14px,2.31vh)] w-full min-w-0 items-center justify-center overflow-hidden rounded-[2px] bg-[#181A1C] px-[4px] text-[max(10px,min(0.9375vw,1.667vh))] leading-none text-[#FEFEFE]"
      :style="{ fontWeight: 400 }"
    >
      {{ valueText }}
    </div>
  </div>
</template>

<script>
const HAT_STRIPES =
  "repeating-linear-gradient(180deg, #000000 0 14%, #E5E5E5 14% 31%)";

const HAT_STYLES = {
  greyhound: {
    1: { bg: "#D0021B", text: "#FFFFFF" },
    2: { bg: "#0003EE", text: "#FFFFFF" },
    3: { bg: "#DADADB", text: "#000000" },
    4: { bg: "#000000", text: "#FFFFFF" },
    5: { bg: "#FF9403", text: "#000000" },
    6: { bg: HAT_STRIPES, text: "#FF0000", textBg: "#E5E5E5" },
  },
  "horse-racing": {
    1: { bg: "#C43446", text: "#FFFFFF" },
    2: { bg: "#DADADB", text: "#000000" },
    3: { bg: "#418AC5", text: "#FFFFFF" },
    4: { bg: "#B5C358", text: "#000000" },
    5: { bg: "#407D32", text: "#FFFFFF" },
    6: { bg: "#3B593E", text: "#AEDF71" },
    7: { bg: "#7B1FA2", text: "#FFFFFF" },
    8: { bg: "#E07B39", text: "#FFFFFF" },
  },
  "motor-racing": {
    1: { bg: "#D0021B", text: "#FFFFFF" },
    2: { bg: "#0003EE", text: "#FFFFFF" },
    3: { bg: "#DADADB", text: "#000000" },
    4: { bg: "#000000", text: "#FFFFFF" },
    5: { bg: "#FDD510", text: "#000000" },
    6: { bg: "#53B409", text: "#FFFFFF" },
    7: { bg: "#FF5A00", text: "#FFFFFF" },
    8: { bg: "#00A651", text: "#FFFFFF" },
  },
};

export default {
  name: "ParticipantCard",
  props: {
    entry: { type: Object, required: true },
    value: { type: [Number, String], default: null },
    disabled: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    hatFolder: { type: String, default: "" },
  },
  emits: ["select"],
  computed: {
    displayName() {
      const first = this.entry.participantFirstName || "";
      const last = this.entry.participantLastName || "";
      return `${first} ${last}`.trim();
    },
    pickStyle() {
      if (!this.selected || !this.hatFolder) return null;
      const map = HAT_STYLES[this.hatFolder];
      if (!map) return null;
      return map[this.entry.participantNumber] || null;
    },
    textColor() {
      if (this.pickStyle) return this.pickStyle.text;
      return this.disabled ? "#C4C9CC" : "#030303";
    },
    hasTextBg() {
      return !!(this.pickStyle && this.pickStyle.textBg);
    },
    dorsalStyle() {
      const shadow = this.disabled
        ? "0 0 2px rgba(0,0,0,0.07), 0 1px 1px rgba(0,0,0,0.05)"
        : "0 0 2px rgba(0,0,0,0.14), 0 2px 2px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.2)";
      return {
        background: this.pickStyle ? this.pickStyle.bg : "",
        boxShadow: shadow,
      };
    },
    showValue() {
      return !this.disabled && this.value !== null && this.value !== undefined;
    },
    valueText() {
      return this.value === null || this.value === undefined
        ? "--"
        : String(this.value);
    },
  },
  methods: {
    onClick() {
      if (this.disabled) return;
      this.$emit("select");
    },
  },
};
</script>
