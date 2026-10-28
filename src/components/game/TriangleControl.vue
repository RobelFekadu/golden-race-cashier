<template>
  <span class="inline-flex items-center justify-center" :class="wrapClass">
    <svg
      v-if="direction === 'up'"
      class="h-[12px] w-[19px]"
      viewBox="0 0 19 12"
      aria-hidden="true"
    >
      <path
        d="M9.5 0 L19 12 L0 12 Z"
        fill="#A7AAB1"
        stroke="#9498A0"
        stroke-width="0.75"
      />
    </svg>
    <svg
      v-else
      class="h-[19px] w-[12px]"
      viewBox="0 0 12 19"
      aria-hidden="true"
    >
      <path
        d="M0 9.5 L12 0 L12 19 Z"
        fill="#A7AAB1"
        stroke="#9498A0"
        stroke-width="0.75"
      />
    </svg>
  </span>
</template>

<script>
export default {
  name: "TriangleControl",
  props: {
    direction: {
      type: String,
      default: "up",
      validator: (v) => ["up", "left"].includes(v),
    },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    wrapClass() {
      return this.direction === "up" ? "w-full" : "";
    },
  },
};
</script>
