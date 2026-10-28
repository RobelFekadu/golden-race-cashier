export const GAME_GLYPHS = {
  car: "e061",
  motorbike: "e008",
  horse: "e057",
  greyhound: "e02b",
  keno: "e065",
};

export function gameGlyph(icon) {
  return GAME_GLYPHS[icon] || "e02b";
}
