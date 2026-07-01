// Banner geometry from cryptic-crossword-05-JUN-2026.pdf vector analysis.

export const BANNER = {
  body: {
    x: 188.5546875,
    y: 24,
    width: 219.75,
    height: 20.25,
  },
  hangers: [
    { x: 203.5546875, y: 17.25, width: 3, height: 6.75 },
    { x: 390.3046875, y: 17.25, width: 3, height: 6.75 },
  ],
  notches: {
    radius: 3.75,
    left: { x: 187.8046875, y: 33.75 },
    right: { x: 409.0546875, y: 33.75 },
  },
  text: {
    size: 10.5,
    /** Baseline distance from top of page (from PDF glyph metrics). */
    baselineFromTop: 38.25,
  },
};
