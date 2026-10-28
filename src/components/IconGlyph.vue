<template>
  <span class="shrink-0" :style="glyphStyle" aria-hidden="true">{{
    glyph
  }}</span>
</template>

<script>
export default {
  name: "IconGlyph",
  props: {
    family: { type: String, default: "system" },
    code: { type: String, required: true },
    size: { type: [String, Number], default: null },
  },
  computed: {
    familyName() {
      return this.family === "game" ? "ds-game-icons" : "Icons-System";
    },
    glyph() {
      return String.fromCodePoint(parseInt(this.code, 16));
    },
    glyphStyle() {
      return {
        fontFamily: this.familyName,
        fontSize: this.size || undefined,
        fontWeight: 400,
        fontStyle: "normal",
        fontVariant: "normal",
        lineHeight: 1,
        display: "inline-block",
        verticalAlign: "middle",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      };
    },
  },
};
</script>
