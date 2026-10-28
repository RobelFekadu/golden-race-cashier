<template>
  <div
    class="flex h-[25px] w-full items-center justify-center overflow-hidden rounded-[2px] bg-[#191B1C] text-[calc(17px*var(--tfs))] font-bold leading-none text-white"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "OddsBar",
  props: {
    value: { type: [Number, String], default: null },
  },
  computed: {
    text() {
      if (this.value === null || this.value === undefined) return "--";
      const val = parseFloat(this.value);
      return isNaN(val) ? "--" : val.toFixed(2);
    },
  },
};
</script>
