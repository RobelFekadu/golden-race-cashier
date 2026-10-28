<template>
  <div class="relative z-[2] flex items-end gap-[2px]">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="flex h-[4.17vh] shrink-0 items-center rounded-t-[12px] border border-b-0 px-[20px] text-[max(13px,min(1.146vw,2.037vh))] font-[700] uppercase leading-none transition-colors"
      :class="
        modelValue === tab.key
          ? 'border-[#AEB6BD] bg-[#E4EAEE] text-[#030303]'
          : 'border-[#AEB6BD] bg-[#AEB6BD] text-[rgba(3,3,3,0.8)] hover:brightness-105'
      "
      @click="$emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "BettingModeTabs",
  props: {
    tabs: { type: Array, required: true },
    modelValue: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
};
</script>
