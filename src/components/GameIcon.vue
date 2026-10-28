<template>
  <svg fill="currentColor" viewBox="0 0 24 24" v-bind="$attrs">
    <!-- Greyhound -->
    <template v-if="type === 'greyhound'">
      <g transform="scale(0.0416667)">
        <path :d="runnerPath" />
      </g>
    </template>

    <!-- Horse -->
    <template v-else-if="type === 'horse'">
      <g transform="scale(0.0416667)">
        <path :d="runnerPath" />
      </g>
    </template>

    <!-- Car -->
    <template v-else-if="type === 'car' || type === 'motorbike'">
      <path
        d="M5 11l2-5h10l2 5h-14zm-2 2v4h2l1-2h12l1 2h2v-4h-18zm6 1.5h2V13h-2v1.5zm4 0h2V13h-2v1.5z"
      />
    </template>

    <!-- Keno -->
    <template v-else-if="type === 'keno'">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </template>

    <!-- Cycle -->
    <template v-else-if="type === 'cycle' || type === 'skate'">
      <circle
        cx="6"
        cy="16"
        r="4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        cx="18"
        cy="16"
        r="4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        d="M9 16h6l1 4M7 16l-2-6h6l1 3"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </template>

    <!-- Harness / default -->
    <template v-else>
      <path
        d="M12 2l3 3-3 3-3-3 3-3zm0 6l3 3-3 3-3-3 3-3zm0 6l3 3-3 3-3-3 3-3z"
      />
    </template>
  </svg>
</template>

<script>
const RUNNER_PATH =
  "M575.9 86.2L544 105.4c-14.7 8.9-25.2 23.7-28.6 40.8l-3.3 16.6c-5.6 28.1-30.2 48.4-58.9 48.4H384v-32c0-17.7-14.3-32-32-32h-31.1l-31.5-49.5C283 88.9 275.4 84.3 267 84.3H176c-8.3 0-16 4.5-20.2 11.8l-41.4 72.4C110.8 175 96.9 184 81.4 184H32c-17.7 0-32 14.3-32 32v48c0 17.7 14.3 32 32 32h26.3c11.5 48.4 44.4 88.1 88.3 108.4L144 464c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16l.9-36.1c5.3.6 10.7 1 16.2 1H256c5.5 0 10.9-.4 16.2-1l.9 36.1c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16l-2.6-58.4c41-17.6 73.5-52.8 84.6-95.9l3.3-12.9 31.1-4.7c21.6-3.2 38.3-20.9 40.1-42.6l4.1-48.5c1.4-16.9-11.4-31.8-28.5-31.8zM256 256c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z";

export default {
  name: "GameIcon",
  props: {
    type: { type: String, default: "horse" },
  },
  data() {
    return { runnerPath: RUNNER_PATH };
  },
};
</script>
