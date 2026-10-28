<template>
  <div class="px-[50px] py-[28px]">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Promotions</h3>
    </div>

    <div
      class="flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-gray-200 bg-surface-light"
    >
      <div
        class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4"
      >
        <svg
          class="w-7 h-7 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v17m0 0a3 3 0 01-6 0m6 0a3 3 0 006 0M7 7h10"
          />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">
        Promotions configuration coming soon
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromotionsTab",
};
</script>
